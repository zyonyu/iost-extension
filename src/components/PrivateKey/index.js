import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Header, Modal, Toast, LoadingImage, Input } from 'components'
import Button from 'components/Button'
import classnames from 'classnames'
import * as accountActions from 'actions/accounts'
import store from '../../store'
import './index.scss'

class PrivateKey extends Component {
  state = {
    hidePassword: false,
    account: {},
  }

  componentDidMount() {
    const { account } = this.props

    if (account) {
      this.setState({
        account,
      })
      // reset account
      store.dispatch(accountActions.setTempAccount(null))
    }
  }

  backTo = () => {
    const { changeLocation, locationList } = this.props
    ui.deleteLocation()
    const currentLocation = locationList[locationList.length - 1]
    changeLocation(currentLocation)
  }

  moveTo = location => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }

  onCopy = () => {
    Toast.html(I18n.t('ManageAccount_Copy'))
  }

  toggleHidePassword = () => {
    this.setState({
      hidePassword: !this.state.hidePassword,
    })
  }

  render() {
    const { account, hidePassword } = this.state
    return (
      <Fragment>
        <Header title={I18n.t('Show_Private_Key')} onBack={this.backTo} hasSetting={false} />
        <div className="privateKey-wrapper">
          <div className="alert">{I18n.t('Show_Private_Key_Warning')}</div>
          <div className="privateKey-box">
            <div className="privateKey-header">
              <span>
                {I18n.t('Account')}： {account.name}
              </span>
              <div>
                <i className={hidePassword ? 'eye-close' : 'eye'} onClick={this.toggleHidePassword} />
                <CopyToClipboard onCopy={this.onCopy} text={account.privateKey}>
                  <i className="copy" />
                </CopyToClipboard>
              </div>
            </div>
            <div className="privateKey-content">
              {hidePassword
                ? account.privateKey
                : '*****************************************************************************************************'}
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  account: state.accounts.tempAccount,
  locationList: state.ui.locationList,
})

export default connect(mapStateToProps)(PrivateKey)
