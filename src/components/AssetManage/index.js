import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Header } from 'components'
import { Toast } from "components/index";
import Button from 'components/Button'
import './index.scss'
import iconSrc from "constants/icon";
import LoadingImage from "components/LoadingImage";
import cx from "classnames";
import Input from "components/Input";
import ui from "utils/ui";
import utils from 'utils'
import iost from 'iostJS/iost'
import user from 'utils/user'
import token, { getTokenInfo } from "utils/token";


type Props = {

}

let tokenList = [
  {symbol: 'iost', fullName: 'Endless Token'},
  {symbol: 'emogi', fullName: 'Endless Token'},
  {symbol: 'abct', fullName: 'Endless Token'},
  {symbol: 'iet', fullName: 'Endless Token'},
  {symbol: 'usdt', fullName: 'Endless Token'},
  {symbol: 'btc', fullName: 'Endless Token'},
  {symbol: 'eth', fullName: 'Endless Token'},
  {symbol: 'trx', fullName: 'Endless Token'},
]

/**
 * assets = { ['account-network']: [{symbol:'',fullName: ''}]}
 */
class AssetManage extends Component<Props> {
  state = {
    isLoading: false,
    token: '',
    assetsList: []
  }

  componentDidMount() {
    this.getAssets()
  }

  getAssets = () => {
    Promise.all([
      utils.getStorage('assets'),
      user.getActiveAccount()
    ]).then(([assetsList, account]) => {
      if(assetsList){
        this.setState({
          assetsList: assetsList[`${account.name}-${account.network}`] || []
        })
      }
    })
  }

  moveTo = (location) => () => {
    const { changeLocation } = this.props
    ui.settingLocation(location)
    changeLocation(location)
  }


  backTo = () => {
    const { changeLocation, locationList } = this.props
    ui.deleteLocation()
    const currentLocation = locationList[locationList.length - 1]
    changeLocation(currentLocation)
  }
  

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: '',
    })
  }

  goToTokenDetail = (selectSymbol) => () => {
    token.selectToken(selectSymbol)
    this.moveTo('/tokenDetail')()
  }

  onAddToken = async () => {
    const { token } = this.state
    try {
      const account = await user.getActiveAccount()
      const _user = `${account.name}-${account.network}`
      const data = await getTokenInfo(token, account.network == 'MAINNET')
      const assets = await utils.getStorage('assets', {})
      const asset = { symbol: 'token',fullName: data.full_name }
      assets[_user] = [...(assets[_user] || []), asset]
      await utils.setStorage('assets', assets)
      alert('add success')
    } catch (err) {
      console.log(err)
    }
  }



  render() {
    const { isLoading, assetsList } = this.state
    return (
      <Fragment>
        <Header title='资产管理' onBack={this.backTo} hasSetting={false} />
        <div className="AssetManage-box">
          <label className="label">
            {I18n.t('Transfer_Payee')}
          </label>
          <div className="input-box">
            <Input
              name="token"
              onChange={this.handleChange}
              placeholder="添加Token"
              className="input"
            />
            <Button
              className="btn-add"
              onClick={this.onAddToken}
            >
              添加
            </Button>
          </div>

          <p className="asset-title">我的资产</p>
          <ul className="token-list-wrapper">
            {
              tokenList.map(item =>
                <li key={item.symbol} onClick={this.goToTokenDetail(item.symbol)}>
                  <img src={iconSrc[item.symbol]} alt=""/>
                  <span>{`${item.symbol.toUpperCase()} (${item.fullName})`}</span>
                </li>
              )
            }
          </ul>

        </div>
      </Fragment>

    )
  }
}

const mapStateToProps = (state) => ({
  locationList: state.ui.locationList,
})

export default connect(mapStateToProps)(AssetManage)

