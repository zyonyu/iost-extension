
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
        await this.store.user.getAccountInfo(true)
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
      const rlt = await iost.signAndSend('ram.iost','buy', [currentAccount.name, address || currentAccount.name, parseInt(buyAmount * 1024)])
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
      const rlt = await iost.signAndSend('ram.iost','sell', [currentAccount.name, address || currentAccount.name, parseInt(sellAmount * 1024)])
      this.store.app.setTxResult(rlt)
    } catch (err) {
      this.store.app.setTxResult(err, false)
    }
  }

  render(){
    const { buyAmount, sellAmount, address, buyLoading, sellLoading } = this.state
    const { formatMessage: formatMsg } = this.props.intl
    const { wallet: { balance, ram_info, loading }, ramInfo } = this.store.user
    if(loading) return <div></div>
    return(
      <div className="ram-manage-container">
        <Header title={formatMsg({id: 'RamManage_Title'})} />
        <div className="ram-manage-box">
          <ResourceProgress 
            name="iRAM" 
            percent={ram_info.total?ram_info.used/ram_info.total*100:0}
            total={`${ram_info.total} KB`} 
            used={`${formatMsg({id: 'RamManage_Used'})}: ${ram_info.used} KB`}
            remaining={`${formatMsg({id: 'RamManage_Remaining'})}: ${ram_info.available} KB`}
          />
          <Tabs defalutActiveKey="1">
            <TabPane name={formatMsg({id: 'RamManage_Buy'})} className="tabpane-box" key="1" >
              <p className="field-box">
                <span>{formatMsg({id: 'RamManage_PurchaseAmount'})}</span>
                <span>{formatMsg({id: 'RamManage_PurchasePrice'})}{` ${ramInfo.buy_price} IOST/KB`}</span>
              </p>
              <Input
                name="buyAmount"
                value={buyAmount}
                placeholder={formatMsg({id: 'RamManage_PurchaseEnter'})}
                onChange={this.onChange} 
              />
              <p className="equal-iost">{`=${(buyAmount*ramInfo.buy_price).toFixed(4)} IOST`}</p>
              <p className="field-box"><span>{formatMsg({id: 'RamManage_Address'})}</span></p>
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
            <TabPane name={formatMsg({id: 'RamManage_Sell'})} className="tabpane-box" key="2">
              <p className="field-box">
                <span>{formatMsg({id: 'RamManage_SellAmount'})}</span>
                <span>{formatMsg({id: 'RamManage_SellPrice'})}{` ${ramInfo.sell_price} IOST/KB`}</span>
              </p>
              <Input
                name="sellAmount"
                value={sellAmount}
                placeholder={formatMsg({id: 'RamManage_SellEnter'})}
                onChange={this.onChange} 
              />
              <p className="equal-iost">{`=${(sellAmount*ramInfo.sell_price).toFixed(4)} IOST`}</p>
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
        </div>
      </div>
    )
 }
}

export default injectIntl(GasManage)