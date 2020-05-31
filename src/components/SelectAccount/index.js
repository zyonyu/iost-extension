import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import { connect } from 'react-redux'

import { Header } from 'components'
import Button from 'components/Button'
import './index.scss'

import iost from 'iostJS/iost'
import user from 'utils/user';
import utils from 'utils'

type Props = {

}

class SelectAccount extends Component<Props> {
  state = {
    accounts: [],
  }

  componentWillMount() {
    this.setState({
      accounts: this.props.accounts
    })
  }

  onImportAccount = async () => {
    let accounts = this.state.accounts.filter( item => item.selected);
    const { changeLocation } = this.props
    try {
      accounts = await user.addUsers(accounts)
      const activeAccount = await user.getActiveAccount()
      if (activeAccount) {
        changeLocation('/account')
      } else {
        iost.changeNetwork(utils.getNetWork(accounts[0].network))

        iost.rpc.blockchain.getAccountInfo(accounts[0].name)
          .then((accountInfo) => {
            if (!iost.isValidAccount(accountInfo, accounts[0].publicKey)) {
              this.throwErrorMessage()
              return
            }
            iost.changeAccount(accounts[0])

            // iost.loginAccount(accounts[0].name, accounts[0].publicKey)
            chrome.storage.local.set({ activeAccount: accounts[0] }, () => {
              changeLocation('/account')
            })
          })
          .catch(this.throwErrorMessage)
      }
    } catch (e) {
      console.log(e)
    }
    // changeLocation('/account')
  }
  selectItem = (idx) => () => {
    let data = this.state.accounts;
    data[idx].selected = !data[idx].selected;
    data[idx].ledget = true;
    this.setState({
      accounts: data
    })
  }
  moveTo = (location) => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }
  render() {
    const { selected, accounts } = this.state

    return (
      <Fragment>
        <Header title={I18n.t('SelectAccount_Title')} onBack={this.moveTo('/connectWallet')} hasSetting={false} />
        <div className="selectAccount_box">
          <p className="sel_text">{I18n.t('SelectAccount_Label')}</p>
          {
            accounts.map((item, idx) =>
              (
                <div className="sel_item_box" onClick={this.selectItem(idx)} key={item.id}>
                  {item.selected ? <i className="icon-sel" /> : <i className="icon-unsel" />}
                  <div className="sel_item">
                    <p className="sel_item_title">{item.name}</p>
                    <p className="sel_item_text">
                      {item.network == 'MAINNET' ? I18n.t('ManageAccount_Official') : item.network == 'LOCALNET' ? I18n.t('ManageAccount_Local') : I18n.t('ManageAccount_Test')}
                    </p>
                  </div>
                </div>
              )
            )
          }
          <Button className="btn" disabled={selected === -1} onClick={this.onImportAccount}>{I18n.t('SelectAccount_ImportAccount')}</Button>
        </div>
      </Fragment>
    )
  }
}
const mapStateToProps = (state) => ({
  accounts: state.accounts.walletAccounts,
})

export default connect(mapStateToProps)(SelectAccount)