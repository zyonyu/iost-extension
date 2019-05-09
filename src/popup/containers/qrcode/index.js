
import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { injectIntl, FormattedMessage } from 'react-intl'
import QRCode from 'qrcode.react'
import './style.less'

@inject("rootStore")
@observer
class Qrcode extends Component {
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  onCopy = () => {
    const { formatMessage: formatMsg } = this.props.intl
    Toast.html(formatMsg({id: 'CopySuccess'}))
  }

  render(){
    const { formatMessage: formatMsg } = this.props.intl
    const { currentAccount } = this.store.user
    return(
      <div className="qrcode-container">
        <Header title={formatMsg({id: 'Account_Receive'})} />
        <div className="qrcode-box">
          <p className="title">{formatMsg({id: 'Receive_Title'})}</p>
          <QRCode value={currentAccount.name} />
          <p className="name">{currentAccount.name}</p>
          <CopyToClipboard onCopy={this.onCopy} text={currentAccount.name}>
            <Button className="btn-copy">{formatMsg({id:'Receive_Copy'})}</Button>
          </CopyToClipboard>
        </div>
      </div>
    )
 }
}

export default injectIntl(Qrcode)