import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import Input from 'components/Input'
import Button from 'components/Button'
import { Landing, Toast } from 'components'
import iost from 'iostJS/iost'
import { privateKeyToPublicKey } from 'utils/key'
import utils from 'utils'
import ui from 'utils/ui';
import hash from 'hash.js'
import user from 'utils/user';

import './index.scss'

type Props = {

}

class Login extends Component<Props> {
  state = {
    password: '',
    repassword: '',
    account: '',
    privateKey: '',
    isChecked: true,
    errorMessage: '',
    hasPassword: false,
  }

  componentWillMount() {
    this.checkPassword();
  }

  componentDidMount() {
    ui.settingLocation('/login')
  }

  checkPassword = async () => {
    const enpassword = await user.getEnPassword()
    this.setState({
      hasPassword: !!enpassword
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: '',
    })
  }

  onCheckPassword = () => {
    const { password, repassword } = this.state
    if (password == null || password.length < 8) {
      Toast.html(I18n.t('Password_Length'))
      return false;
    }
    const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    if (!reg.test(password)) {
      Toast.html(I18n.t('Password_Combination'))
      return false;
    }
    if (password != repassword) {
      Toast.html(I18n.t('Password_Different'))
      return false;
    }
    return true
  }

  keyOnImport = (e) => {
    if (e.keyCode == 13) {
      this.onImport()
    }
  }

  onImport = () => {
    const { password, isChecked, hasPassword } = this.state
    if(hasPassword) {
      ui.settingLocation('/accountImport')
      this.props.changeLocation('/accountImport')
      return
    }
    if (!isChecked) {
      Toast.html(I18n.t('firstLogin_AgreementTip3'))
      return
    }
    if (this.onCheckPassword()) {
      // save password
      const en_password = hash.sha256().update(password).digest('hex')
      // const en_password = utils.aesEncrypt('account', password)
      chrome.storage.local.set({ password: en_password })
      chrome.runtime.sendMessage({
        action: 'SET_PASSWORD',
        payload: {
          password
        }
      })
      ui.settingLocation('/accountImport')
      this.props.changeLocation('/accountImport')
    }
  }

  onOpenWallet = () => {
    const { password, isChecked, hasPassword } = this.state
    if(hasPassword) {
      ui.settingLocation('/hardwareWallet')
      this.props.changeLocation('/hardwareWallet')
      return
    }
    if (!isChecked) {
      Toast.html(I18n.t('firstLogin_AgreementTip3'))
      return
    }
    if (this.onCheckPassword()) {
      // save password
      const en_password = hash.sha256().update(password).digest('hex')
      // const en_password = utils.aesEncrypt('account', password)
      chrome.storage.local.set({ password: en_password })
      chrome.runtime.sendMessage({
        action: 'SET_PASSWORD',
        payload: {
          password
        }
      })
      ui.settingLocation('/hardwareWallet')
      this.props.changeLocation('/hardwareWallet')
    }

  }


  tryLogin = async () => {
    const { account, privateKey } = this.state
    const { changeLocation } = this.props

    let publicKey
    try {
      publicKey = privateKeyToPublicKey(privateKey)
    } catch (e) {
      publicKey = ''
    }

    const invalidLoginInput = !account || !privateKey || !publicKey

    if (invalidLoginInput) {
      this.throwErrorMessage()
      return
    }

    iost.changeNetwork(utils.getNetWork(account.network))
    iost.rpc.blockchain.getAccountInfo(account)
      .then((accountInfo) => {
        if (!iost.isValidAccount(accountInfo, publicKey)) {
          this.throwErrorMessage()
          return
        }
        iost.changeAccount(account)
        // iost.loginAccount(account, privateKey)
        changeLocation('/account')
      })
      .catch(this.throwErrorMessage)
  }

  throwErrorMessage = () => {
    this.setState({
      errorMessage: I18n.t('invalidLoginInfo'),
    })
  }

  moveTo = (location) => () => {
    const { changeLocation } = this.props
    ui.settingLocation(location)
    changeLocation(location)
  }

  toggleChecked = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    })
  }

  render() {
    const { password, repassword, isChecked, errorMessage, hasPassword } = this.state
    return (
      <Fragment>
        <Landing />
        <div className="login-box">
          {
            hasPassword ? null : (
              <Input
                name="repassword"
                type="password"
                className="input-password"
                value={repassword}
                onChange={this.handleChange}
                onKeyDown={this.keyOnImport}
                placeholder={I18n.t('firstLogin_RepeatPassword')}
              />
            )
          }
          {
            hasPassword ? null : (
              <Input
                name="repassword"
                type="password"
                className="input-password"
                value={repassword}
                onChange={this.handleChange}
                onKeyDown={this.keyOnImport}
                placeholder={I18n.t('firstLogin_RepeatPassword')}
              />
            )
          }

          {!!errorMessage && <p className="login-errorMessage">{errorMessage}</p>}
          <div className="line" />
          <Button className="btn-accountImport" onClick={this.onImport}>{I18n.t('firstLogin_ImportAccount')}</Button>
          <p>{I18n.t('firstLogin_NoAndCreate1')}<a href="https://iostaccount.io/create" className="third-create" target="_blank">{I18n.t('firstLogin_NoAndCreate2')}</a></p>
          <Button className="btn-accountImport" onClick={this.onOpenWallet}>{I18n.t('firstLogin_HardwareWallet')}</Button>
          <p className="p_10_0">{I18n.t('firstLogin_UseByLedgerUsers')}</p>
          <div className="radio-box">
            <i className={isChecked ? '' : 'noChecked'} onClick={this.toggleChecked} />
            <span>
              {I18n.t('firstLogin_AgreementTip1')}<a onClick={this.moveTo('/userAgreement')}>{I18n.t('firstLogin_AgreementTip2')}</a>
            </span>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Login
