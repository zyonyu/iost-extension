
import config from 'utils/config'
import storage from 'utils/storage'
import { lan, sha256, aesEncrypt, aesDecrypt, encrypt, decrypt, getAccountKey } from 'utils'

const keys = ['nodes', 'accounts', 'currentAccount']

class Store {
  constructor(){
    this.nodes = new Map()
    this.accounts = new Map() //
    this.currentAccount = null
    this.password = 'qweasd123'//null
    this.locked = false//true
    this.lan = lan
    
    this._initLan()
    this._initNodes()
    this.updateAccountType()
  }

  async updateAccountType(){
    try {
      const accounts = await this.getStorage('accounts')
      if(accounts instanceof Array && !this.locked && this.password){
        if(accounts.length){
          console.log(accounts)
          let list = accounts.map(item => this.decryptAccount(item))
          console.log(list)
          await this.setStorage('accounts', encrypt(list, this.password))
          await this._initAccounts()
        }
      }else {
        await this._initAccounts()
      }
    } catch (err) {
      console.log(err)
    }
  }

  async _initLan(){
    this.lan = await this.getStorage('locale', lan)
  }

  _initNodes(){
    config.nodes.map(item => this.nodes.set(item.name, item) )
  }

  async _initAccounts(){
    if(!this.locked){
      try {
        let accounts = await this.getStorage('accounts')
        if(accounts){
          accounts = decrypt(accounts, this.password)
          accounts.map(account => {
            const key = getAccountKey(account)
            this.accounts.set(key, account)
          })
          await this._initCurrentAccount()
        }
      } catch (err) {
        this.lock()
        throw 'password error'
      }
    }
  }

  encryptAccount(account){
    const arr = ['privateKey', 'password', 'token', 'retoken']
    return arr.reduce((prev, next) => {
      if(prev[next]){
        prev[next] = aesEncrypt(prev[next], this.password)
      }
      return prev
    },account)
  }

  decryptAccount(account){
    const arr = ['privateKey', 'password', 'token', 'retoken']
    console.log(this.password)
    return arr.reduce((prev, next) => {
      if(prev[next]){
        prev[next] = aesDecrypt(prev[next], this.password)
      }
      return prev
    },account)
  }

  async _initCurrentAccount(){
    if(this.hasAccounts){
      let curKey = await this.getStorage('currentAccount')
      curKey = curKey.indexOf(':') > -1?curKey: decrypt(curKey, this.password)
      if(curKey && this.accounts.has(curKey)){
        this.setCurrentAccount(curKey)
      }else {
        const accounts = this.getAccounts()
        const key = getAccountKey(accounts[0])
        this.setCurrentAccount(key)
      }
    }
  }


  getNodes(){
    return [...this.nodes.keys()].map(key => this.nodes.get(key))
  }

  getCurrentNode(){
    return this.nodes.get(this.getCurrentAccount().network)
  }

  get hasAccounts() {
    return this.accounts.size
  }

  getAccounts(){
    return [...this.accounts.keys()].map(key => this.accounts.get(key))
  }

  setCurrentAccount(key){
    if(key){
      this.currentAccount = key
      this.setStorage('currentAccount', encrypt(key, this.password) )

      // set iost account network
    }
  }

  getCurrentAccount(){
    const account = this.accounts.get(this.currentAccount)
    return account
  }

  get hasCurrentAccount(){
    return this.accounts.has(this.currentAccount)
  }

  addAccounts(accounts){
    if(!this.locked && accounts.length){
      let firstKey = ''
      accounts.map(account => {
        const key = getAccountKey(account)
        if(!firstKey){
          firstKey = key
        }
        this.accounts.set(key,account)
      })
      // aesEncrypt
      const newAccounts = encrypt(this.getAccounts(), this.password)
      this.setStorage('accounts', newAccounts)
      if(!this.hasCurrentAccount){
        this.setCurrentAccount(firstKey)
      }
    }
  }

  deleteAccount(key){
    if(this.accounts.has(key)){
      this.accounts.delete(key)
      const newAccounts = encrypt(this.getAccounts(), this.password)
      this.setStorage('accounts', newAccounts)
      if(!this.hasCurrentAccount && newAccounts.length){
        this.setCurrentAccount(getAccountKey(newAccounts[0]))
      }
    }
  }
  

  getLan(){
    return this.lan
  }

  setLan(lan){
    this.lan = lan
    this.setStorage('locale', lan)
  }

  lock(){
    this.locked = true
    this.password = null
    this.accounts = new Map() //
    this.accounts.clear()
    this.currentAccount = null
  }

  async unlock(password){
    try {
      const encryptPassword = await this.getEncryptPassword()
      if(encryptPassword === sha256(password)){
        this.password = password
        this.locked = false
        await this.updateAccountType()
      }else {
        throw 'invalid password'
      }
    } catch (err) {
      throw err
    }
  }

  get lockState(){
    return this.locked
  }

  setPassword(str){
    this.locked = false
    this.password = str
    const encryptPassword = sha256(str)
    this.setStorage('password', encryptPassword)
  }

  async updatePassword(newPwd){
    try {
      for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const endata = await this.getStorage(key)
        if(endata){
          const dedata = decrypt(endata, this.password)
          this.setStorage(key, encrypt(dedata, newPwd)) 
        }
      }
      this.setPassword(newPwd)
    } catch (err) {
      throw err
    }
  }

  comparePassword(password){
    return this.password === password
  }

  getEncryptPassword(){
    return this.getStorage('password')
  }

  async hasRegister(){
    try {
      const password = await this.getEncryptPassword()
      if(password){
        return true
      }
    } catch (err) {
      console.log(err)
    }
    return false
  }

  getStorage(key, defaultValue) {
    return new Promise(resolve => (
        storage.get(key, data => resolve(data[key] || defaultValue || false))
    ));
  }

  setStorage(key, value){
    return new Promise(resolve => (
      storage.set({[key]: value}, resolve)
    ))
  }

  
}


export default Store