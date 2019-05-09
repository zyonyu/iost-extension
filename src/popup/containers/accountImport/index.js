
import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import { injectIntl, FormattedMessage } from 'react-intl'
import _trim from 'lodash/trim'
import { privateKeyToPublicKey, getAccountBypublickKey, addAccounts, hasCurrentAccount, getCurrentAccount } from '@popup/utils'
import iost from '@popup/iost'
import './style.less'

@inject("rootStore")
@observer
class AccountImport extends Component {
  state = {
    privateKey: '',
    loading: false
  }

  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  componentDidMount() {
    document.body.addEventListener('keypress',this.onKeyPress)
  }

  componentWillUnmount() {
    document.body.removeEventListener('keypress',this.onKeyPress)
  }

  onKeyPress = (e) => {
    const key = (e.shiftKey ? 'shift+' : '') + e.keyCode || e.which;
    if(key == '13'){
      e.stopPropagation();
      e.preventDefault();
      this.onSubmit()
    }
  }

  onChange = (value, name) => {
    this.setState({
      [name]: value
    })
  }

  onSubmit = async () => {
    const { formatMessage: formatMsg } = this.props.intl
    try {
      this.setState({
        loading: true
      })
      let accounts = []
      const privateKey = _trim(this.state.privateKey)
      if(!privateKey){
        return Toast.html(formatMsg({id: 'ImportAccount_Tip2'}))
      }
      const publicKey = privateKeyToPublicKey(privateKey)
      if(!publicKey){
        return Toast.html(formatMsg({id: 'ImportAccount_Tip3'}))
      }
      let accounts1 = await getAccountBypublickKey(publicKey, true)
      let accounts2 = await getAccountBypublickKey(publicKey, false)
      accounts1 = accounts1.map(item => {
        return {
          name: item.account_info.name,
          network: 'MAINNET',
          privateKey,
          publicKey,
        }
      })
      accounts2 = accounts2.map(item => {
        return {
          name: item.account_info.name,
          network: 'TESTNET',
          privateKey,
          publicKey,
        }
      })
      accounts = accounts1.concat(accounts2)
      if(!accounts.length){
        return Toast.html(formatMsg({id: 'ImportAccount_Tip1'}))
      }
      
      this.setState({
        loading: false
      })
      const hasCurAccount = hasCurrentAccount()
      addAccounts(accounts)
      this.store.user.initAccounts()
      this.store.user.initCurrentAccount()
      if(!hasCurAccount){
        const currentAccount = getCurrentAccount()
        iost.changeAccount(currentAccount)
      }
      this.store.app.onReplacePage('accountManage')

    } catch (err) {
      console.log(err)
    }
  }

  render(){
    const { loading } = this.state
    const { accounts } = this.store.user
    const { formatMessage: formatMsg } = this.props.intl
    return(
      <div className="account-import-container">
        <Header
          title={formatMsg({id: 'firstLogin_ImportAccount'})} 
          logo={accounts.length<1}
        />
        <div className="account-import-box">
          <Input
            type="textarea" 
            name="privateKey" 
            autoFocus
            className="privateKey" 
            onChange={this.onChange} 
            placeholder={formatMsg({id: 'ImportAccount_EnterPrivate'})}
          />
          <Button className="btn-submit" onClick={this.onSubmit}>{loading ? <Icon type="loading" /> : formatMsg({id: 'ImportAccount_Submit'})}</Button>
        </div>
      </div>
    )
 }
}

export default injectIntl(AccountImport)