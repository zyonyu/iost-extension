
import React, { Component } from 'react'
import { IntlProvider, FormattedMessage, addLocaleData } from 'react-intl'
import { inject, observer } from "mobx-react";
import { hasRegister, getLockState, hasAccounts, getCurrentAccount } from '@popup/utils'
import iost from '@popup/iost'
import './style.less'
import chooseLocale from '@popup/i18n'

import Register from './register'
import AccountImport from './accountImport'
import Lock from './lock'
import Home from './home'
import Setting from './setting'
import AccountManage from './accountManage'
import Language from './language'
import About from './about'
import Agreement from './agreement'
import ChangePwd from './changePwd'
import Qrcode from './qrcode'
import Transfer from './transfer'
import TxResult from './txResult'
import GasManage from './gasManage'
import RamManage from './ramManage'

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import ko from 'react-intl/locale-data/ko';
addLocaleData([...en,...zh, ...ko]);

const pageDict = {
  'home': <Home />,
  'ramManage': <RamManage />,
  'gasManage': <GasManage />,
  'txResult': <TxResult />,
  'register': <Register />,
  'accountImport': <AccountImport />,
  'lock': <Lock />,
  'setting': <Setting />,
  'accountManage': <AccountManage />,
  'language': <Language />,
  'about': <About />,
  'agreement': <Agreement />,
  'changePwd': <ChangePwd />,
  'qrcode': <Qrcode />,
  'transfer': <Transfer />,
}

@inject("rootStore")
@observer
export default class  extends Component {
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  componentDidMount() {
    this._init()
  }

  _init = async () => {
    try {
      const isRegister = await hasRegister()
      if(!isRegister){
        this.store.app.onReplacePage('register')
      }else {
        const isLock = getLockState()
        if(isLock){
          this.store.app.onReplacePage('lock')
        }else {
          if(!hasAccounts()){
            this.store.app.onReplacePage('accountImport')
          }else {
            this.store.user.initAccounts()
            this.store.user.initCurrentAccount()
            const { currentAccount } = this.store.user
            iost.changeAccount(currentAccount)
            this.store.app.onReplacePage(Object.keys(pageDict)[0])
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
    this.store.app.setLoading(false)
  }

  render(){
    const { currentPage, lan } = this.store.app
    return(
      <IntlProvider
        locale={lan}
        messages={chooseLocale(lan)}
      >
        {pageDict[currentPage] || <Register />}
      </IntlProvider>
    )
 }
}