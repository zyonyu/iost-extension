import { observable, computed, toJS, action } from "mobx"
import { getLan } from '@popup/utils'

class App {
  @observable currentPage = 'register'
  @observable pages = []
  @observable lan = getLan()
  @observable loading = true
  @observable txResult = {
    success: false
  }

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  refreshLan(){
    this.lan = getLan()
  }

  @action
  setLoading(value){
    this.loading = value
  }

  @action
  onPushPage = (pageName) => {
    this.currentPage = pageName
    this.pages.push(pageName)
  }

  @action
  onReplacePage = (pageName) => {
    this.currentPage = pageName
    this.pages.splice(-1,1,pageName)
  }

  @action
  onBackPage = () => {
    this.pages.pop()
    if(this.pages.length){
      this.currentPage = this.pages[this.pages.length-1]
    }
  }

  @action
  setTxResult(data, success = true){
    this.txResult = {...data, success}
    this.onPushPage('txResult')
  }

 
}

export default App
