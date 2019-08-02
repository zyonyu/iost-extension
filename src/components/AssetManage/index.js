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
import token from "utils/token";

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



class AssetManage extends Component<Props> {
  state = {
    isLoading: false,
    tokenName: '',
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
      tokenName: e.target.value,
    })
  }

  goToTokenDetail = (selectSymbol) => () => {
    token.selectToken(selectSymbol)
    this.moveTo('/tokenDetail')()
  }


  checkToken = () => {
    const { tokenName } = this.state

  }


  render() {
    const { isLoading } = this.state
    return (
      <Fragment>
        <Header title={I18n.t('Settings_assetManage')} onBack={this.backTo} hasSetting={false} />
        <div className="AssetManage-box">
          <label className="label">
            {I18n.t('Account_AddToken')}
          </label>
          <div className="input-box">
            <Input
              name="tokenName"
              onChange={this.handleChange}
              placeholder={I18n.t('AssetManage_TokenName')}
              className="input"
            />
            <Button
              className="btn-add"
              onClick={this.checkToken}
            >
              {I18n.t('AssetManage_Add')}
            </Button>
          </div>

          <p className="asset-title">{I18n.t('AssetManage_MyAsset')}</p>
          <ul className="token-list-wrapper">
            {
              tokenList.map(item =>
                <li key={item.symbol} onClick={this.goToTokenDetail(item.symbol)}>
                  <img src={iconSrc[item.symbol] ? iconSrc[item.symbol] : iconSrc['default']} alt=""/>
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

