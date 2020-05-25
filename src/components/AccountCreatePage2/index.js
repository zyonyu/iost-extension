import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import ui from 'utils/ui'

import Input from 'components/Input'
import { Header } from 'components'
import Button from 'components/Button'
import NewAccount from 'components/NewAccount'
import * as userActions from 'actions/user'
import iost from 'iostJS/iost'
import './index.scss'

type Props = {

}

class accountCreatePage2 extends Component<Props> {
  state = {
    // createUser: 'aaaaaa',
    accountName: '辣椒水里的看',
    ownerPublicKey: 'FGSDGFSADFGSDFGDSFGHSDHSDGFHS',
    activePublicKey: 'SDFHSDFGHSDFSDFGSDFGSDFGDG',
    allotMemory: '1024',
    pledgeIGAS: '10',
    accountList: [{
      id: 1,
      type: '主网',
      name: '将罚款是的搜嘎帝国时代放公司对方感受到法国',
    }, {
      id: 2,
      type: '主网',
      name: 'fdasdfasdf',
    }],
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
  confirm = () => {
    console.log(456)
    ui.closePopup()
    const { changeLocation } = this.props
    changeLocation('/account')
  }

  // 创建按钮
  create = () => {
    const {
      accountName, ownerPublicKey, activePublicKey, allotMemory, pledgeIGAS, accountList, selected,
    } = this.state
    const params = {
      createUser: accountList[selected].name,
      accountName,
      ownerPublicKey,
      activePublicKey,
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
      accountName, ownerPublicKey, activePublicKey, allotMemory, pledgeIGAS, accountList, showSelect, selected,
    } = this.state
    return (
      <Fragment>
        <Header title={I18n.t('HardwareWallet_CreateAccount')} onBack={this.moveTo('/accountCreatePage1')} hasSetting={false} />
        <div className="accountCreatePage2-box">
          <span className="label">{I18n.t('CreateAccount_CreateUser')}</span>
          <div className="key-box">
            <Input name="createUser" value={accountList[selected].name} readOnly onClick={this.showSelect} className="input-key account_click" />
            { showSelect ?
              <div className="show_pop">
                {
                  accountList.map((item, idx) =>
                    (
                      <div className="show_pop_item" onClick={this.selectItem(idx)} key={item.id}>
                        <span className="type">{item.type}</span>
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
            <Input name="accountName" value={accountName} readOnly onChange={this.handleChange} className="input-key" />
          </div>
          <span className="label">{I18n.t('CreateAccount_OwnerPublicKey1')}</span>
          <div className="key-box">
            <Input name="ownerPublicKey" value={ownerPublicKey} readOnly onChange={this.handleChange} className="input-key" />
          </div>
          <span className="label">{I18n.t('CreateAccount_ActivePublicKey1')}</span>
          <div className="key-box">
            <Input name="activePublicKey" value={activePublicKey} readOnly onChange={this.handleChange} className="input-key" />
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

export default accountCreatePage2
