import EventEmitter from 'eventemitter3'
import ext from 'utils/ext'

class Message extends EventEmitter{
  constructor(name) {
    super()

    this.name = name;
    this.port = null
    this._connect()
  }

  _connect(){
    this.port = ext.runtime.connect({ name: this.name })
    
    this.port.onMessage.addListener(this.onMessage);
    
    this.port.onDisconnect.addListener(() => {
      // console.log(this.port)
    })
  }

  onMessage = (message) => {
    window.postMessage({ message }, '*')
  }


  send({action, actionId, data}) {
    this.port.postMessage({
      action,
      actionId,
      data,
    })
  }
}

export default Message;