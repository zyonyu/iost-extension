import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import ui from 'utils/ui';

import { Header, Modal, Toast } from 'components'
import Button from 'components/Button'
import Input from 'components/Input'
import './index.scss'

const { Modal2 } = Modal

type Props = {

}

class ConnectWallet extends Component<Props> {
  state = {
    accountName: '了记得链接里',
    timer: null
  }


  checkTimeOut = () => {
    this.timer = setTimeout(() => {
      ui.toggleModal()
      Toast.failIcon(I18n.t('ConnectWallet_ConnectTimeout'), 3)
    }, 1000 * 60 * 2)
  }
  onConnectWallet = () => {
    ui.toggleModal()
    // 监听 2分钟 超时
    this.checkTimeOut();
    setTimeout(() => {
      this.moveTo('/selectAccount')()
    }, 3000)
  }
  onCancel = () => {
    ui.toggleModal()
    clearTimeout(this.timer)
  }
  moveTo = (location) => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }

  render() {
    return (
      <Fragment>
        <Header title={I18n.t('ConnectWallet_ConnectHardwareWallet')} onBack={this.moveTo('/hardwareWallet')} hasSetting={false} />
        <div className="connectWallet-box">
          <div className="item_box">
            <i className="icon-ledger" />
            <p className="icon-step-text">Ledger</p>
            <Button className="btn" onClick={this.onConnectWallet}>{I18n.t('HardwareWallet_ConnectWallet')}</Button>
          </div>
          <div className="divied-line"><div className="divied-text">1</div></div>
          <div className="item_box">
            <p className="icon-step1-text">{I18n.t('ConnectWallet_ConnectWalletStep1')}</p>
            <div className="icon-view-box">
              <i className="icon-wallet" />
              <div className="arrow-right-box">
                <i className="icon-arrow-right" />
                <i className="icon-arrow-right" />
                <i className="icon-arrow-right" />
              </div>
              <i className="icon-ledger1" />
            </div>
          </div>
          <div className="divied-line"><div className="divied-text">2</div></div>
          <div className="item_box">
            <p className="icon-step2-text">{I18n.t('ConnectWallet_ConnectWalletStep2')}</p>
            <Input name="accountName" value={this.state.accountName} readOnly className="input-key" />
          </div>
          <div className="divied-line"><div className="divied-text">3</div></div>
          <div className="item_box">
            <p className="icon-step2-text">{I18n.t('ConnectWallet_ConnectWalletStep3')}</p>
            <i className="icon-pc" />
          </div>
        </div>
        <Modal2 title={I18n.t('ConnectWallet_Modal2Title')} isConfirm={false} onCancel={this.onCancel}>
          <i className="icon-loading" />
        </Modal2>
      </Fragment>
    )
  }
}
export default ConnectWallet
