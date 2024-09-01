import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Header, Modal, Toast, LoadingImage, Input } from 'components'
import Button from 'components/Button'
import classnames from 'classnames'
import iost from 'iostJS/iost'
import bs58 from 'bs58'
import * as accountActions from 'actions/accounts'
import utils from 'utils'
import ui from 'utils/ui'
import user from 'utils/user'
import store from '../../store'
import hash from 'hash.js'
import './index.scss'

const { Modal1 } = Modal

class AccountManage extends Component<Props> {
  state = {
    password: undefined,
    pwdModelVisible: false,
    keyPwd: '',
    loading: false,
    hidePassword: true,
    current: null,
  }

  componentDidMount() {
    ui.settingLocation('/accountManage')
    this.getPassword()
  }

  getPassword = async () => {
    const password = await user.getLockPassword()
    this.setState({
      password,
    })
  }

  onCopy = () => {
    Toast.html(I18n.t('ManageAccount_Copy'))
  }

  moveTo = location => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }

  // 第一次导入账号后，点击返回会直接到主页account页面，
  // 正常情况下，从设置页进入，也就返回设置页。
  backTo = () => {
    const { changeLocation, locationList } = this.props
    ui.deleteLocation()
    const currentLocation = locationList[locationList.length - 1]
    if (currentLocation == '/accountImport') {
      changeLocation('/account')
    } else {
      changeLocation('/accountSetting')
    }
  }

  onDelete = async () => {
    const accounts = this.props.accounts.filter(item => user.getUserUnique(item) != user.getUserUnique(this.delItem))
    await user.setUsers(accounts)
    const activeAccount = await user.getActiveAccount()
    if (activeAccount && user.getUserUnique(activeAccount) == user.getUserUnique(this.delItem)) {
      if (accounts.length) {
        const account = accounts[0]
        // reset current account
        const nodeRpc = await utils.getCurrentNode(account)

        iost.changeNetwork(nodeRpc)
        // iost.loginAccount(account.name, account.publicKey)
        iost.changeAccount(account)
        user.setActiveAccount(account)
      } else {
        await user.removeActiveAccount()
        this.props.changeLocation('/accountImport')
      }
    }
    ui.toggleModal()
  }

  deleteAccount = item => () => {
    this.delItem = item
    ui.toggleModal()
  }

  showPrivateKey = item => () => {
    this.setState({
      pwdModelVisible: true,
      current: item,
    })
  }

  handleKeyPwdChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onCloseModal = () => {
    this.setState({
      pwdModelVisible: false,
    })
  }

  moveTo = location => () => {
    const { changeLocation, locationList } = this.props
    ui.settingLocation(location)
    changeLocation(location)
  }

  handlePrivateKey = async () => {
    const { keyPwd: currentPwd } = this.state
    const en_password = await user.getEnPassword()
    const _password = hash.sha256().update(currentPwd).digest('hex')
    if (_password === en_password) {
      const { current: account } = this.state
      store.dispatch(
        accountActions.setTempAccount({
          name: account.name,
          network: account.network,
          publicKey: account.publicKey,
          privateKey: utils.aesDecrypt(account.privateKey, currentPwd),
        }),
      )
      this.moveTo('/privateKey')()
    } else {
      Toast.html(I18n.t('ChangePassword_Wrong'))
    }
  }

  toggleHidePassword = () => {
    this.setState({
      hidePassword: !this.state.hidePassword,
    })
  }

  onKeyDown = e => {
    if (e.keyCode == 13) {
      this.handlePrivateKey()
    }
  }

  render() {
    const { pwdModelVisible, password, keyPwd, loading, hidePassword } = this.state
    const { accounts } = this.props
    if (!password) {
      return null
    }
    return (
      <Fragment>
        <Header title={I18n.t('Settings_accountManage')} onBack={this.backTo} onAddIost={this.moveTo('/accountImport')} setting={false} />
        <div className="accountManage-box">
          {accounts.map(item => (
            <div className="account-item" key={user.getUserUnique(item)}>
              <div className="left">
                <div className="account-name-box">
                  <span className={classnames('account-title', item.network == 'MAINNET' ? '' : item.network == 'LOCALNET' ? 'local' : 'test')}>
                    {item.network == 'MAINNET'
                      ? I18n.t('ManageAccount_Official')
                      : item.network == 'LOCALNET'
                      ? I18n.t('ManageAccount_Local')
                      : I18n.t('ManageAccount_Test')}
                  </span>
                  <span className="account-name">{item.name}</span>
                </div>
                <div className="publicKey-box">
                  <span className="publicKey-title">{I18n.t('ManageAccount_PublicKey')}</span>
                  <span className="publicKey-name">
                    <span className="truncate">************</span>
                    <CopyToClipboard onCopy={this.onCopy} text={item.publicKey}>
                      <i className="copy" />
                    </CopyToClipboard>
                    <i className="key" onClick={this.showPrivateKey(item)} />
                  </span>
                </div>
              </div>
              <i className="right" onClick={this.deleteAccount(item)} />
            </div>
          ))}
        </div>
        <Modal1 onDelete={this.onDelete} />
        <Modal title={I18n.t('Continue_With_Password')} visible={pwdModelVisible} onClose={this.onCloseModal} DialogClass="pwd-modal-wrapper">
          <div className="pwd-modal-container">
            <div className="input-box">
              <Input
                value={keyPwd}
                name="keyPwd"
                type={hidePassword ? 'password' : 'text'}
                className="input-address"
                onChange={this.handleKeyPwdChange}
                onKeyDown={this.onKeyDown}
              />
              <i className={hidePassword ? 'eye-close' : 'eye'} onClick={this.toggleHidePassword} />
            </div>
            <div className="btn-box">
              <Button className="btn-cancel" onClick={this.onCloseModal}>
                {I18n.t('Cancel')}
              </Button>
              <Button className="btn-confirm" disabled={keyPwd == ''} onClick={this.handlePrivateKey}>
                {loading ? <LoadingImage /> : I18n.t('Confirm')}
              </Button>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts.accounts,
  locationList: state.ui.locationList,
})

export default connect(mapStateToProps)(AccountManage)
