
import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Header, Icon, Input, Button, Toast, ResourceProgress, Tabs } from '@popup/components'
import { injectIntl, FormattedMessage } from 'react-intl'
import { delay } from 'utils'
import iost from '@popup/iost'
import cx from 'classnames'
import './style.less'

const TabPane = Tabs.TabPane

@inject("rootStore")
@observer
class GasManage extends Component {
  state = {
    buyAmount: '',
    sellAmount: '',
    address: '',
    buyLoading: false,
    sellLoading: false,
  }

  _isMounted = false

  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  componentDidMount() {
    this._isMounted = true
    this.getData()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getData = async () => {
    while(this._isMounted && !this.state.isError){
      try {
        await this.store.user.getAccountInfo()
        await delay(5000)
      } catch (err) {
        if(this._isMounted){
          this.setState({
            isError: true
          })
        }
      }
    }
  }

  onChange = (value, name) => {
    this.setState({
      [name]: value
    })
  }

  onBuySubmit = async () => {
    const { buyAmount, address } = this.state
    const { currentAccount } = this.store.user
    try {
      this.setState({
        buyLoading: true
      })
      const rlt = await iost.signAndSend('gas.iost','pledge', [currentAccount.name, address || currentAccount.name, buyAmount])
      this.store.app.setTxResult(rlt)
    } catch (err) {
      this.store.app.setTxResult(err, false)
    }
  }

  onSellSubmit = async () => {
    const { sellAmount, address } = this.state
    const { currentAccount } = this.store.user
    try {
      this.setState({
        buyLoading: true
      })
      const rlt = await iost.signAndSend('gas.iost','unpledge', [currentAccount.name, address || currentAccount.name, sellAmount])
      this.store.app.setTxResult(rlt)
    } catch (err) {
      this.store.app.setTxResult(err, false)
    }
  }

  render(){
    const { buyAmount, sellAmount, address, buyLoading, sellLoading } = this.state
    const { formatMessage: formatMsg } = this.props.intl
    const { wallet: { balance, gas_info, loading, frozen_amount } } = this.store.user
    if(loading) return <div></div>
    return(
      <div className="gas-manage-container">
        <Header title={formatMsg({id: 'GasManage_Title'})} />
        <div className="gas-manage-box">
          <ResourceProgress 
            name="iGAS" 
            percent={gas_info.limit?((1-gas_info.current_total/gas_info.limit)*100):0}
            total={`${gas_info.limit} iGAS`} 
            used={`${formatMsg({id: 'GasManage_Locked'})}: ${parseInt(gas_info.limit-gas_info.current_total)} iGAS`}
            remaining={`${formatMsg({id: 'GasManage_Available'})}: ${gas_info.current_total} iGAS`}
          />
          <div className={cx('selling-gas', frozen_amount?'active':'')}>
            <span><b>{formatMsg({id: 'GasManage_UnStakeing'})} iGAS</b></span>
            <span>{frozen_amount} IOST</span>
          </div>
          <Tabs defalutActiveKey="1">
            <TabPane name={formatMsg({id: 'GasManage_Stake'})} className="tabpane-box" key="1" >
              <p className="field-box">
                <span>{formatMsg({id: 'GasManage_StakeAmount'})}</span>
                <span>{formatMsg({id: 'GasManage_Balance'})}{` ${balance} IOST`}</span>
              </p>
              <Input
                name="buyAmount"
                value={buyAmount}
                placeholder={formatMsg({id: 'GasManage_StakeEnter'})}
                onChange={this.onChange} 
              />
              <p className="field-box"><span>{formatMsg({id: 'GasManage_StakeAddress'})}</span></p>
              <Input
                name="address"
                value={address}
                placeholder={formatMsg({id: 'GasManage_Optional'})}
                onChange={this.onChange} 
              />
              <Button 
                className="btn-submit" 
                onClick={this.onBuySubmit} 
                disabled={Number(buyAmount)<=0 || buyLoading}
              >
                {buyLoading?<Icon type="loading" />: formatMsg({id: 'Transfer_Submit'})}
              </Button>
            </TabPane>
            <TabPane name={formatMsg({id: 'GasManage_UnStake'})} className="tabpane-box" key="2">
              <p className="field-box">
                <span>{formatMsg({id: 'GasManage_UnStakeAmount'})}</span>
                <span>{formatMsg({id: 'GasManage_CanUnStake'})}{` ${gas_info.pledged_amount} IOST`}</span>
              </p>
              <Input
                name="sellAmount"
                value={sellAmount}
                placeholder={formatMsg({id: 'GasManage_StakeEnter'})}
                onChange={this.onChange} 
              />
              <p className="field-box"><span>{formatMsg({id: 'GasManage_UnStakeAddress'})}</span></p>
              <Input
                name="address"
                value={address}
                placeholder={formatMsg({id: 'GasManage_Optional'})}
                onChange={this.onChange} 
              />
              <Button 
                className="btn-submit" 
                onClick={this.onSellSubmit} 
                disabled={Number(sellAmount)<=0 || sellLoading}
              >
                {sellLoading?<Icon type="loading" />: formatMsg({id: 'Transfer_Submit'})}
              </Button>
              <p>{formatMsg({id: 'GasManage_Tip'})}</p>
            </TabPane>
          </Tabs>
          <div className="pledg-records">
            <div className="title"><span>{formatMsg({id: 'GasManage_Records'})}</span></div>
            <ul>
              {gas_info.pledged_info.map( (t,i) => 
                <li key={i}><span>{formatMsg({id: 'GasManage_Records_Item'}, {name: t.pledger})}</span>
                  <span>{t.amount} IOST</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    )
 }
}

export default injectIntl(GasManage)