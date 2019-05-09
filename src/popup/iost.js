import IOST from 'iost'
import bs58 from 'bs58'
import config from 'utils/config'
import EventEmitter from 'eventemitter3'
import { getAccountKey } from 'utils'
import { getCurrentNode, setCurrentAccount } from '@popup/utils'


class IWallet {
  constructor(){
    this.pack = IOST
    this.iost = new IOST.IOST(config.defaultConfig)
    this.rpc = new IOST.RPC(new IOST.HTTPProvider(config.nodes[0].url))
    this.iost.setRPC(this.rpc)
    this.account = new IOST.Account('empty')
  }

  changeAccount(account){
    setCurrentAccount(getAccountKey(account))
    this.changeNetwork()
    this.account = new IOST.Account(account.name)
    const kp = new IOST.KeyPair(bs58.decode(account.privateKey),account.privateKey.length>50?2:1)
    this.account.addKeyPair(kp, "owner")
    this.account.addKeyPair(kp, "active")
    this.iost.setAccount(this.account);
  }

  changeNetwork(){
    const node = getCurrentNode()
    const provider = new IOST.HTTPProvider(node.url)
    this.iost = new IOST.IOST(config.defaultConfig, provider)
    this.rpc = new IOST.RPC(provider)
    this.iost.setRPC(this.rpc)
  }

  signAndSend(contractName, action, args){
    return new Promise((resolve, reject) => {
      const tx = this.iost.callABI(contractName, action, args)
      const node = getCurrentNode()
      tx.setChainID(node.chain_id)
      this.account.signTx(tx)

      let inverval = null, times = 90

      const handler = new IOST.TxHandler(tx, this.rpc)
      handler.onPending(({hash, pre_tx_receipt}) => {
        if(pre_tx_receipt){
          if(pre_tx_receipt.status_code == 'SUCCESS'){
            resolve(pre_tx_receipt)
          }else {
            reject(pre_tx_receipt)
          }
        }else {
          inverval = setInterval(() => {
            times--;
            if(!times){
              clearInterval(inverval)
              reject(`Error: tx ${hash} on chain timeout.`)
            }else {
              this.rpc.transaction.getTxByHash(hash).then(({transaction}) => {
                const tx_receipt = transaction.tx_receipt
                if(tx_receipt){
                  clearInterval(inverval)
                  if(tx_receipt.status_code === "SUCCESS"){
                    resolve(tx_receipt)
                  }else {
                    reject(tx_receipt)
                  }
                }
              })
            }
          },1000)
        }
      }).onFailed((err) => {
        clearInterval(inverval)
        reject(err)
      })
      .send()
    })
  }

}

const iost = new IWallet()

export default iost