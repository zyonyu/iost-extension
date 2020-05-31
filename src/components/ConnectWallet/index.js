import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import ui from 'utils/ui';
import utils from 'utils'
import * as userActions from 'actions/accounts'

import { Header, Modal, Toast } from 'components'
import Button from 'components/Button'
import Input from 'components/Input'
import './index.scss'
import _trim from 'lodash/trim'
import { privateKeyToPublicKey, publickKeyToAccount, nameAndPublicKeyToAccount } from 'utils/key'
import user from 'utils/user';
import store from '../../store'

const { Modal2 } = Modal

type Props = {

}

class ConnectWallet extends Component<Props> {
  state = {
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
    this.getAccount()
    // setTimeout(() => {
    //   this.moveTo('/selectAccount')()
    // }, 3000)
  }

  getAccount = async () => {
    
    const privateKey = _trim(this.props.createrList[0].key);
    const { changeLocation } = this.props;

    let publicKey,
      accounts = []
    try {
      publicKey = privateKeyToPublicKey(privateKey)
      let accounts1 = await publickKeyToAccount(publicKey, true)
      let accounts2 = await publickKeyToAccount(publicKey, false)
      const password = await user.getLockPassword()
      accounts1 = accounts1.map((item) => ({
        name: item.account_info.name,
        network: 'MAINNET',
        privateKey: utils.aesEncrypt(privateKey, password),
        publicKey,
      }));
      accounts2 = accounts2.map((item) => ({
        name: item.account_info.name,
        network: 'TESTNET',
        privateKey: utils.aesEncrypt(privateKey, password),
        publicKey,
      }));
      accounts = accounts1.concat(accounts2);
    } catch (e) {
      console.log(e)
      publicKey = ''
    }

    const invalidLoginInput = !accounts.length || !privateKey || !publicKey

    if (invalidLoginInput) {
      if (!privateKey) {
        Toast.html(I18n.t('ImportAccount_Tip2'))
      } else if (!publicKey) {
        Toast.html(I18n.t('ImportAccount_Tip3'))
      } else if (!accounts.length) {
        Toast.html(I18n.t('ImportAccount_Tip1'))
      }
      return
    }

    store.dispatch(userActions.setWalletAccounts(accounts))
    this.moveTo('/selectAccount')()
    // try {
    //   accounts = await user.addUsers(accounts)
    //   const activeAccount = await user.getActiveAccount()
    //   if (activeAccount) {
    //     changeLocation('/selectAccount')
    //   } else {
    //     iost.changeNetwork(utils.getNetWork(accounts[0].network))

    //     iost.rpc.blockchain.getAccountInfo(accounts[0].name)
    //       .then((accountInfo) => {
    //         if (!iost.isValidAccount(accountInfo, accounts[0].publicKey)) {
    //           return
    //         }
    //         iost.changeAccount(accounts[0])

    //         // iost.loginAccount(accounts[0].name, accounts[0].publicKey)
    //         chrome.storage.local.set({ activeAccount: accounts[0] }, () => {
    //           changeLocation('/selectAccount')
    //         })
    //       })
    //       .catch()
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
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
            <Input name="accountName" value={this.props.createrList[0].name} readOnly className="input-key" />
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

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  locationList: state.ui.locationList,
  createrList: state.user.createrList,
  createAccountInfo: state.user.createAccountInfo,
})

export default connect(mapStateToProps)(ConnectWallet)