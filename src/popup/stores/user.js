import { observable, computed, toJS, action } from "mobx"
import { getAccounts, getCurrentAccount, lock } from '@popup/utils'
import iost from '@popup/iost'
import { delay } from 'utils'

class User {
  @observable accounts = []
  @observable currentAccount = null
  @observable isStartGetInfo = false
  @observable wallet = {
    balance: 0,
    frozen_balances: [],
    frozen_amount: 0,
    gas_info: {
      current_total: 0,
      increase_speed: 0,
      limit: 0,
      pledge_gas: 0,
      pledged_info: [],
      pledged_amount: 0,
      transferable_gas: 0,
    },
    ram_info: {
      available: 0,
      total: 0,
      used: 0,
    },
    assets: [],
    loading: true
  }
  @observable ramInfo = {
    available_ram: 0,
    buy_price: 0,
    sell_price: 0,
    total_ram: 0,
    used_ram: 0,
  }

  @action
  initAccounts(data){
    this.accounts = getAccounts()
  }

  @action
  initCurrentAccount(){
    this.currentAccount = getCurrentAccount()
    if(this.currentAccount){
      iost.changeAccount(this.currentAccount)
      this.getAccountInfo()
    }
  }

  lock(){
    this.accounts = []
    this.currentAccount = null
    lock()
  }

  getAccountInfo = (isRam) => {
    return new Promise( async (resolve, reject) => {
      if(this.currentAccount){
        try {
          if(isRam){
            await this.getRamInfo()
          }
          await this.getIostInfo()
          resolve()
        } catch (err) {
          reject(err)
        }
      }else {
        resolve()
      }
    })
  }

  getIostInfo = async () => {
    try {
      const { balance, frozen_balances, gas_info, ram_info } = await iost.rpc.blockchain.getAccountInfo(this.currentAccount.name)
      const frozen_amount = frozen_balances.reduce((prev, next) => (prev += next.amount, prev), 0)
      const pledged_amount = gas_info.pledged_info.reduce((prev, next) => (prev += next.amount, prev), 0)
      const data = {
        balance,
        frozen_balances,
        frozen_amount,
        gas_info: {
          ...gas_info,
          gas_used: Number((gas_info.limit - gas_info.current_total).toFixed(4)),
          pledged_amount,
        },
        ram_info: {
          available: Number((ram_info.available/1024).toFixed(4)),
          total: Number((ram_info.total/1024).toFixed(4)),
          used: Number((ram_info.used/1024).toFixed(4)),
        },
        loading: false
      }
      console.log(data)
      this.setWallet(data)
    } catch (err) {
      console.log(err)
    }
  }

  @action
  setWallet(data){
    this.wallet = {...toJS(this.wallet), ...data}
  }

  getRamInfo = async () => {
    try {
      const rlt = await iost.rpc.getProvider().send('get', 'getRAMInfo')
      const data = {
        available_ram: Number(rlt.available_ram),
        buy_price: Number((rlt.buy_price*1024).toFixed(4)),
        sell_price: Number((rlt.sell_price*1024).toFixed(4)),
        total_ram: Number(rlt.total_ram),
        used_ram: Number(rlt.used_ram),
      }
      this.setRamInfo(data)
    } catch (err) {
      console.log(err)
    }
  }

  @action
  setRamInfo(data){
    this.ramInfo = data
  }

}

export default User