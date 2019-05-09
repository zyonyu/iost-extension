
import bs58 from 'bs58'
import EC from 'elliptic'
import axios from 'axios'
import iost from '@popup/iost'
import config from 'utils/config'
import ext from 'utils/ext';

const secp = new EC.ec('secp256k1')

const Algorithm = {
  Ed25519: 2,
  Secp256k1: 1,
}

const winBgPage = ext.extension.getBackgroundPage()
const bg = winBgPage.background

const getLan = () => bg.store.getLan()

const setLan = (lan) => bg.store.setLan(lan)

const setPassword = (password) => bg.store.setPassword(password)

const hasRegister = () => bg.store.hasRegister()

const unlock = (password) => bg.store.unlock(password)

const lock = () => bg.store.lock()

const getLockState = () => bg.store.lockState

const hasAccounts = () => bg.store.hasAccounts

const getAccounts = () => bg.store.getAccounts()

const deleteAccount = (key) => bg.store.deleteAccount(key)

const hasCurrentAccount = () => bg.store.hasCurrentAccount

const getCurrentAccount = () => bg.store.getCurrentAccount()

const setCurrentAccount = (key) => bg.store.setCurrentAccount(key)

const getCurrentNode = () => bg.store.getCurrentNode()


const privateKeyToPublicKey = (privateKey) => {
  const decodedPrivateKey = bs58.decode(privateKey);
  const edKP = new iost.pack.KeyPair(decodedPrivateKey, privateKey.length>50?Algorithm.Ed25519:Algorithm.Secp256k1);
  return bs58.encode(Buffer.from(edKP.pubkey, 'hex'))
}

const getAccountBypublickKey = async (publickKey, isProd = true) => {
  const url = config.nodes[isProd? 0 : 1].defaulteExplorer
  try {
    const { data } = await axios.get(`${url}/iost-api/accounts/${publickKey}`,{
      timeout: 10000
    })
    if(data.code == 0){
      return data.data.accounts || []
    }
  } catch (err) {
    console.log(err)
  }
  return []
}

const addAccounts = (accounts) => bg.store.addAccounts(accounts)

const comparePassword = (password) =>   bg.store.comparePassword(password)

const updatePassword = (password) =>   bg.store.updatePassword(password)

export {
  getLan,
  setLan,
  setPassword,
  hasRegister,
  unlock,
  lock,
  getLockState,
  hasAccounts,
  getAccounts,
  deleteAccount,
  hasCurrentAccount,
  getCurrentAccount,
  setCurrentAccount,
  getCurrentNode,
  privateKeyToPublicKey,
  getAccountBypublickKey,
  addAccounts,
  comparePassword,
  updatePassword,
}