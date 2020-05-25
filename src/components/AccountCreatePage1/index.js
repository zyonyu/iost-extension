import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import Input from 'components/Input'
import classnames from 'classnames'
import { Header, Toast, Modal } from 'components'
import Button from 'components/Button'
import iost from 'iostJS/iost'
import store from '../../store'
import * as userActions from 'actions/user'

import ui from 'utils/ui';
import './index.scss'

const { Modal2 } = Modal

type Props = {

}

class AccountCreatePage1 extends Component<Props> {
  state = {
    account: '',
    publicKey: '',
    isLoading: false,
    illegal: false,
    modelInfo: {
      isConfirm: false,
      title: '',
      con: '',
    },
  }

  componentDidMount() {
    // ui.settingLocation('/AccountCreatePage1')
  }

  onNext = async () => {
    const { account, publicKey } = this.state
    if (account == '' || publicKey == '' || this.onBlur()) {
      return
    }
    this.setState({
      isLoading: true,
    })
    try {
      // 如果没有找到账户信息，就会报错
      await iost.rpc.blockchain.getAccountInfo(account)
      Toast.html(I18n.t('CreateAccount_AccountExist'))
    } catch (err) {
      store.dispatch(userActions.createAccountInfo({ name: account }))
      this.moveTo('/accountCreatePage2')()
    }
    this.setState({
      isLoading: false,
    })
  }

  onBlur = () => {
    const { account, illegal } = this.state
    const reg = new RegExp(/^[a-z1-9_]{5,11}$/);
    if (!reg.test(account)) {
      this.setState({
        illegal: true,
      })
    }
    return illegal
  }

  onFocus = () => {
    this.setState({
      illegal: false,
    })
  }

  // 随机生成账号
  onRandomGeneration = () => {
    const min = 5;
    const max = 11;
    let returnStr = ''
    const range = (max ? Math.round(Math.random() * (max - min)) + min : min)
    const charStr = 'abcdefghijklmnopqrstuvwxyz0123456789_'
    for (let i = 0; i < range; i++) {
      const index = Math.round(Math.random() * (charStr.length - 1));
      returnStr += charStr.substring(index, index + 1);
    }
    this.setState({
      illegal: false,
      account: returnStr,
    })
  }

  // 连接Ledger
  onConnectLedger = () => {
    this.setState({
      modelInfo: {
        isConfirm: true,
        title: I18n.t('CreateAccount_Modal2Title'),
        con: I18n.t('CreateAccount_Modal2Tip'),
      },
    })
    ui.toggleModal()
  }

  // 继续
  onConfirm = () => {
    const that = this
    const publicKey = 'AJSDKFJALKSDJ12412KLFGSDGDSFJ51L(假数据)'
    that.setState({
      modelInfo: {
        isConfirm: false,
        title: I18n.t('CreateAccount_Modal2Title'),
        con: `${I18n.t('CreateAccount_Modal2Tip2')}\n${publicKey}`,
      },
    })
    setTimeout(function () {
      that.setState({
        publicKey,
      })
      ui.toggleModal()
    }, 300)
  }

  // 取消/关闭
  onCancel = () => {
    const that = this
    ui.toggleModal()
    if (!that.state.modelInfo.isConfirm) {
      // 取消Toast
      Toast.failIcon(I18n.t('CreateAccount_ToastFailTip'), 3)
      // 拒绝Toast
      Toast.failIcon(I18n.t('CreateAccount_ToastFailTip2'), 3)
    }
    setTimeout(function () {
      that.setState({
        modelInfo: {},
      })
    }, 300)
  }

  // 账号输入
  accountChange = (e) => {
    this.setState({
      account: e.target.value,
    })
  }

  moveTo = (location) => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }

  render() {
    const {
      isLoading, account, publicKey, illegal, modelInfo,
    } = this.state
    return (
      <Fragment>
        <Header title={I18n.t('HardwareWallet_CreateAccount')} onBack={this.moveTo('/hardwareWallet')} hasSetting={false} />
        <div className="accountCreatePage1-box">
          <p className="title">{I18n.t('CreateAccount_SetAccountName')}</p>
          <p className="rule">{I18n.t('CreateAccount_IOSTTip1')}</p>
          <div className="accountName-box">
            <Input
              name="account"
              type="text"
              value={account}
              onChange={this.accountChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              className={classnames('input-accountName', illegal ? 'illegal_bor' : '')}
              placeholder={I18n.t('CreateAccount_InputAccountName')}
            />
            <i className="illegal" onClick={this.onRandomGeneration}>{I18n.t('CreateAccount_RandomGeneration')}</i>
          </div>
          <div className="accountName-box publickey-box">
            <Input
              name="publicKey"
              type="text"
              value={publicKey}
              readOnly
              className="input-accountName"
              placeholder={I18n.t('CreateAccount_GetIOSTpublicKey')}
            />
            <i className="illegal" onClick={this.onConnectLedger}>{I18n.t('CreateAccount_ConnectLedger')}</i>
          </div>
          <p className="tip">{I18n.t('CreateAccount_Tip')}</p>
          {
            isLoading ? <p className="rule">{I18n.t('CreateAccount_QueryStatus')}</p> : ''
          }
          <Button className="btn-nextStep" onClick={this.onNext} disabled={account == '' || publicKey == ''}>{I18n.t('CreateAccount_NextStep')}</Button>
        </div>
        <Modal2 title={modelInfo.title} isConfirm={modelInfo.isConfirm} onConfirm={this.onConfirm} onCancel={this.onCancel}>{modelInfo.con}</Modal2>
      </Fragment>
    )
  }
}

export default AccountCreatePage1
