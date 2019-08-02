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
import ui from "utils/ui";

type Props = {

}

class TokenDetail extends Component<Props> {
  state = {
    isLoading: false,
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

  render() {
    const { selectedTokenSymbol, locationList } = this.props
    const { isLoading } = this.state
    return (
      <Fragment>
        <Header title={selectedTokenSymbol.toUpperCase()} onBack={this.backTo} hasSetting={false} />
        <div className="TokenDetail-box">
          <div className="logo-box">
            <img className="logo" src={iconSrc[selectedTokenSymbol]} alt=''/>
          </div>
          <div className="amount-box">
            <span className="amount">{isLoading ? <LoadingImage /> : '1234.56788765'}</span>
            <span>{selectedTokenSymbol}</span>
          </div>
          <p className="token-fullName">Token全称：Endless Token</p>
          <a className="view-detail" href={`https://www.iostabc.com/token/${selectedTokenSymbol}`} target="_blank">查看详情</a>

          <div className="btn-box">
            <Button
              className="btn-account"
              onClick={this.moveTo('/tokenTransfer')}
            >
              {I18n.t('Account_Transfer')}
            </Button>
            <Button
              className="btn-receipt btn-account"
              onClick={this.moveTo('/accountQRCode')}
            >
              {I18n.t('Account_Receive')}
            </Button>
          </div>
        </div>
      </Fragment>

    )
  }
}

const mapStateToProps = (state) => ({
  locationList: state.ui.locationList,
  selectedTokenSymbol: state.token.selectedTokenSymbol,
})

export default connect(mapStateToProps)(TokenDetail)

