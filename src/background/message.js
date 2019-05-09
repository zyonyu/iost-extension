
import EventEmitter from 'eventemitter3'
import ext from 'utils/ext'
import uuidv4 from 'uuid/v4'

class Message extends EventEmitter{
  constructor() {
    super()
    this.ports = new Map() //ports
    ext.runtime.onConnect.addListener(this.onConnection)
  }

  onConnection = (port) => {
    const uuid = uuidv4();
    const name = `${port.name}_${uuid}`
    this.ports.set(name, port)
    console.log('new connect: '+ name)


    port.onMessage.addListener(message => {
      console.log(message)
      this.emit(message.action, message)
    })

    port.onDisconnect.addListener(() => {
      console.log('disconnect: '+ name)
      this.ports.delete(name)
    })
  }


  send(data){
    this.ports.forEach(port => port.postMessage(data))
  }


}

export default Message;