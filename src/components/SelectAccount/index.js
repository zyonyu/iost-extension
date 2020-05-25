import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'

import { Header } from 'components'
import Button from 'components/Button'
import './index.scss'

type Props = {

}

class SelectAccount extends Component<Props> {
  state = {
    accounts: [{
      id: 1,
      name: '工地苦尽甘来',
      balance: 10001,
    }, {
      id: 2,
      name: 'gsdfgsdf',
      balance: 55,
    }],
    selected: -1,
  }
  onImportAccount = () => {
    const { changeLocation } = this.props
    changeLocation('/account')
  }
  selectItem = (idx) => () => {
    this.setState({
      selected: this.state.selected === idx ? -1 : idx,
    })
  }
  moveTo = (location) => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }
  render() {
    const { accounts, selected } = this.state
    return (
      <Fragment>
        <Header title={I18n.t('SelectAccount_Title')} onBack={this.moveTo('/connectWallet')} hasSetting={false} />
        <div className="selectAccount_box">
          <p className="sel_text">{I18n.t('SelectAccount_Label')}</p>
          {
            accounts.map((item, idx) =>
              (
                <div className="sel_item_box" onClick={this.selectItem(idx)} key={item.id}>
                  {selected === idx ? <i className="icon-sel" /> : <i className="icon-unsel" />}
                  <div className="sel_item">
                    <p className="sel_item_title">{item.name}</p>
                    <p className="sel_item_text">{item.balance}</p>
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
export default SelectAccount
