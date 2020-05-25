import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'

import { Header } from 'components'
import Button from 'components/Button'
import ui from 'utils/ui';
import { connect } from 'react-redux'
import './index.scss'

type Props = {

}

class HardwareWallet extends Component<Props> {
  state = {
    // canBack: true,
  }
  onCreateAccount = () => {
    this.moveTo('/accountCreatePage1')()
  }
  onConnectWallet = () => {
    this.moveTo('/connectWallet')()
  }
  moveTo = (location) => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }

  render() {
    return (
      <Fragment>
        <Header title={I18n.t('firstLogin_HardwareWallet')} logo onBack={this.moveTo('/login')} hasSetting={false} />
        <div className="hardwareWallet-box">
          <div className="item_box">
            <i className="icon-add" />
            <Button className="btn" onClick={this.onCreateAccount}>{I18n.t('firstLogin_CreateAccount')}</Button>
            <p className="text">{I18n.t('HardwareWallet_UseByLedgerNewUsers')}</p>
          </div>
          <div className="item_box">
            <i className="icon-download" />
            <Button className="btn" onClick={this.onConnectWallet}>{I18n.t('HardwareWallet_ConnectWallet')}</Button>
            <p className="text">{I18n.t('HardwareWallet_UseByLedgerOldUsers')}</p>
          </div>
        </div>
      </Fragment>
    )
  }
}
export default HardwareWallet
