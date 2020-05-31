import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import { connect } from 'react-redux'
import ui from 'utils/ui'

import Input from 'components/Input'
import { Header } from 'components'
import Button from 'components/Button'
import NewAccount from 'components/NewAccount'
import TransactionSuccess from 'components/TransactionSuccess'
import TransactionFailed from 'components/TransactionFailed'
import * as userActions from 'actions/user'
import iost from 'iostJS/iost'
import './index.scss'

import { Landing, Toast } from 'components'
import hash from 'hash.js'

import ledgerInstance from 'iostJS/ledgerInstance'

type Props = {

}

class accountCreatePage2 extends Component<Props> {
  state = {
    allotMemory: '1024',
    pledgeIGAS: '10',
    showSelect: false,
    selected: 0,
    password: '',
  }

  componentDidMount() {
    // this.replaceKeyPair()
  }

  onPasswordChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  // 输入密码后确认
  createAccount = () => {
    const {
      publicKey,
      name,
    } = this.props.createAccountInfo
    ledgerInstance.newAccount(name, this.props.createrList[this.state.selected].name, publicKey)
    .onPending((response) => {

    })
    .onSuccess((response) => {
      const { changeLocation } = this.props
      changeLocation('/account')
    })
    .onFailed((err) => {
      ui.openPopup({ content: <TransactionFailed tx={err} /> })
    })

  }


  // 输入密码后确认
  confirm = async () => {
    const { password } = this.state
    const getEnPassword = () => new Promise((resolve, reject) => {
      chrome.storage.local.get(['password'],({password: en_password}) => {
        if(en_password){
          resolve(en_password)
        }else{
          reject()
        }
      })
    })
    try {
      const en_password = await getEnPassword()
      const _password = hash.sha256().update(password).digest('hex')
      // utils.aesDecrypt(en_password, password)
      if(_password === en_password){
        chrome.runtime.sendMessage({
          action: 'SET_PASSWORD',
          payload: {
            password
          }
        })
        this.createAccount();
      }else {
        Toast.html(I18n.t('Password_TryAgain'))
        throw new Error('invalid password')
      }
    } catch (err) {
      Toast.html(err)
      throw new Error(err)
    }
  }

  // 创建按钮
  create = () => {
    const {
      allotMemory, pledgeIGAS, selected,
    } = this.state
    const {
      publicKey,
      name,
    } = this.props.createAccountInfo
    const params = {
      createUser: this.props.createrList[selected].name,
      accountName: name,
      ownerPublicKey: publicKey,
      activePublicKey: publicKey,
      allotMemory,
      pledgeIGAS,
    }
    ui.openPopup({ position: 'bottom', content: <NewAccount step="1" tx={params} onNext={this.nextStep} /> })
  }

  // 下一步
  nextStep = () => {
    ui.closePopup()
    ui.openPopup({ position: 'bottom', content: <NewAccount step="2" tx={this.state.password} onChange={this.onPasswordChange} onNext={this.confirm} /> })
  }

  // 创建者-弹窗
  showSelect = () => {
    this.setState({
      showSelect: !this.state.showSelect,
    })
  }

  // 选择创建者
  selectItem = (idx) => () => {
    console.log(idx)
    this.setState({
      showSelect: !this.state.showSelect,
      selected: idx,
    })
  }

  moveTo = (location) => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }

  render() {
    const {
      allotMemory, pledgeIGAS, showSelect, selected,
    } = this.state

    const {
      publicKey,
      name,
    } = this.props.createAccountInfo
    return (
      <Fragment>
        <Header title={I18n.t('HardwareWallet_CreateAccount')} onBack={this.moveTo('/accountCreatePage1')} hasSetting={false} />
        <div className="accountCreatePage2-box">
          <span className="label">{I18n.t('CreateAccount_CreateUser')}</span>
          <div className="key-box">
            <Input name="createUser" value={this.props.createrList[selected].name} readOnly onClick={this.showSelect} className="input-key account_click" />
            { showSelect ?
              <div className="show_pop">
                {
                  this.props.createrList.map((item, idx) =>
                    (
                      <div className="show_pop_item" onClick={this.selectItem(idx)} key={item.name}>
                        {/* <span className="type">{item.type}</span> */}
                        <span className="name">{item.name}</span>
                        {selected === idx ? <i className="selected_icon" /> : ''}
                      </div>
                    )
                  )
                }
              </div> : ''
            }
          </div>
          <span className="label">{I18n.t('CreateAccount_AccountName2')}</span>
          <div className="key-box">
            <Input name="accountName" value={name} readOnly onChange={this.handleChange} className="input-key" />
          </div>
          <span className="label">{I18n.t('CreateAccount_OwnerPublicKey1')}</span>
          <div className="key-box">
            <Input name="ownerPublicKey" value={publicKey} readOnly onChange={this.handleChange} className="input-key" />
          </div>
          <span className="label">{I18n.t('CreateAccount_ActivePublicKey1')}</span>
          <div className="key-box">
            <Input name="activePublicKey" value={publicKey} readOnly onChange={this.handleChange} className="input-key" />
          </div>
          <div className="info-box">
            <div className="info-item">
              <div>{I18n.t('CreateAccount_AllotMemory')}(byte)</div>
              <div>{allotMemory}</div>
            </div>
            <div className="info-item">
              <div>{I18n.t('CreateAccount_PledgeIGAS')}(IOST)</div>
              <div>{pledgeIGAS}</div>
            </div>
          </div>
          <div className="page2-btn-box">
            <Button onClick={this.create}>{I18n.t('CreateAccount_Create')}</Button>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  locationList: state.ui.locationList,
  createrList: state.user.createrList,
  createAccountInfo: state.user.createAccountInfo,
})

export default connect(mapStateToProps)(accountCreatePage2)
