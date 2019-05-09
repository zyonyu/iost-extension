
import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Header, Icon, Input, Button, Toast, Dialog } from '@popup/components'
import { injectIntl, FormattedMessage } from 'react-intl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { confirmAlert } from 'react-confirm-alert'
import { getAccountKey } from 'utils'
import cx from 'classnames'
import { deleteAccount } from '@popup/utils'
import './style.less'

const DialogConfirm = Dialog.Confirm

@inject("rootStore")
@observer
class AccountManage extends Component {
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  onCopy = () => {
    const { formatMessage: formatMsg } = this.props.intl
    Toast.html(formatMsg({id: 'ManageAccount_Copy'}))
  }

  onDelete = (e) => {
    const key = e.currentTarget.dataset.key
    const { formatMessage: formatMsg } = this.props.intl
    confirmAlert({
      customUI: ({ onClose }) => (
        <DialogConfirm title={formatMsg({id: 'ManageAccount_Delete'})} onClose={onClose}>
          <p className="comfirm-delete-tip">{formatMsg({id: 'ManageAccount_DeleteTip'})}</p>
          <Button onClick={this.onDelConfirm(key, onClose)}>{formatMsg({id: 'ManageAccount_Confirm'})}</Button>
        </DialogConfirm>
      )
    })
  }

  onDelConfirm = (key, onClose) => () => {
    deleteAccount(key)
    onClose()
    this.store.user.initAccounts()
    this.store.user.initCurrentAccount()
    if(!this.store.user.accounts.length){
      this.store.app.onReplacePage('accountImport')
    }
  }

  onBack = () => {
    this.store.app.onReplacePage('setting')
  }

  render(){
    const { accounts } = this.store.user
    const { formatMessage: formatMsg } = this.props.intl
    return(
      <div className="account-manage-container">
        <Header
          title={formatMsg({id: 'Settings_accountManage'})} 
          addAccount
          onBack={this.onBack}
        />
        <ul className="account-list">
          {accounts.map(item => {
            const key = getAccountKey(item)
            return (
              <li className="account-item" key={key}>
                <div className="info-box">
                  <div className={cx('name-box', item.network != 'MAINNET' ? 'test' : 'official')}>
                    <span className="title">IOST {formatMsg({id: item.network != 'MAINNET' ?'ManageAccount_Test':'ManageAccount_Official'})}</span>
                    <span className="name">{item.name}</span>
                  </div>
                  <div className="pubkey-box">
                    <span className="title">{formatMsg({id: 'ManageAccount_PublicKey'})}</span>
                    <span className="name">
                      <span>********</span>
                      <CopyToClipboard onCopy={this.onCopy} text={item.publicKey}>
                        <Icon type="copy" />
                      </CopyToClipboard>
                    </span>
                  </div>
                </div>
                <Icon type="delete" onClick={this.onDelete} dataKey={key}/>
              </li>
            )
          }
          )}
        </ul>
      </div>
    )
 }
}

export default injectIntl(AccountManage)