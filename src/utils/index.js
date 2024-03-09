import crypto from 'crypto';
import axios from 'axios'

const defaultNode = 'https://api.iost.io'

const utils = {
  aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key)
    var crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  },
  aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key)
    var decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  },
  encrypt(data, key) {
    const endata = JSON.stringify(data)
    const cipher = crypto.createCipher('aes192', key)
    let crypted = cipher.update(endata, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  },
  decrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  },
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  setCustomNodeList(list) {
    chrome.storage.local.set({ customNodeList: list })
  },
  getCustomNodeList() {
    return new Promise(resolve => {
      chrome.storage.local.get('customNodeList', data => {
        resolve(data['customNodeList'] || [])
      })
    })
  },
  setCurrentNode(value) {
    return new Promise(resolve => chrome.storage.local.set({ currentNode: value }, resolve))
  },
  getCurrentNode(account) {
    return new Promise(resolve => {
      if (account && account.network === 'LOCALNET') {
        resolve(account.endpoint)
      }
      if (account && account.network == 'MAINNET') {
        chrome.storage.local.get('currentNode', data => {
          resolve(data['currentNode'] || defaultNode)
        })
      } else {
        resolve('https://test.api.iost.io')
      }
    })
  },
  getNetWork(account) {
    if (account.network === 'LOCALNET') {
      return account.endpoint
    }
    return account.network == 'MAINNET' ? defaultNode : 'https://test.api.iost.io'
  },
  getStorage(key, defaultValue) {
    return new Promise(resolve => chrome.storage.local.get(key, data => resolve(data[key] || defaultValue || false)))
  },
  setStorage(key, value) {
    return new Promise(resolve => chrome.storage.local.set({ [key]: value }, resolve))
  },
  isURL(str) {
    const regex = /^(http|https):\/\/[^ "]+$/
    return regex.test(str)
  },
  getHeadBlockAndTime(url) {
    return new Promise((resolve, reject) => {
      const startTime = new Date().getTime()
      axios
        .get(`${url}/getChainInfo`, {
          timeout: 5000,
        })
        .then(data => {
          const endTime = new Date().getTime()
          resolve({
            headBlock: data.data.head_block,
            time: endTime - startTime,
          })
        })
        .catch(error => reject(error))
    })
  },
}




// var data = 'Hello, this is a secret message!';
// var key = 'Password!';
// var encrypted = utils.aesEncrypt(data, key);
// var decrypted = utils.aesDecrypt(encrypted, key);
 
// console.log('Plain text: ' + data);
// console.log('Encrypted text: ' + encrypted);
// console.log('Decrypted text: ' + decrypted);


export default utils
