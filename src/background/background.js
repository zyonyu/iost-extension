import Message from './message'
import Store from './store'

class Background {
  constructor(){
    this.message = new Message()
    this.store = new Store()
    this.onListen()
  }


  onListen(){
    this.message.on('GET_NODES', (data) => {
      const nodes = this.store.getNodes()
      this.message.send({
        actionId: data.actionId,
        action: data.action,
        success: {
          nodes
        }
      })
    }).on('GET_ACCOUNT', (data) => {
      if(this.store.locked){
        this.message.send({
          actionId: data.actionId,
          action: data.action,
          failed: {
            type: 'locked'
          }
        })
      }else {
        const account = this.store.getCurrentAccount()
        this.message.send({
          actionId: data.actionId,
          action: data.action,
          success: {
            account
          }
        })
      }
    })
  }




}

const background = new Background()

window.background = background