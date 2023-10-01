import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import { Toast } from 'components'
import ResourceDetail from 'components/ResourceDetail'
import LoadingImage from 'components/LoadingImage'
import iost from 'iostJS/iost'
import { GET_TOKEN_BALANCE_INTERVAL } from 'constants/token'
import iconSrc from 'constants/icon'

import utils from 'utils'
import ui from 'utils/ui'
import user from 'utils/user'
import token, { defaultAssets, nftContactId } from 'utils/token'
import cx from 'classnames'

import './index.scss'

type Props = {}

class Index extends Component<Props> {
  state = {
    amount: 0,
    assetsList: [],
    isLoading: true,
    isError: false,
    tabIndex: 0,
    nftList: [],
  }
  _isMounted = false

  componentDidMount() {
    // 每次要重置为iost
    token.selectToken('iost')
    this._isMounted = true
    this.getData()
    this.getAssets()
    this.getNftList()
  }

  getData = async () => {
    while (this._isMounted && !this.state.isError) {
      await this.getResourceBalance(this.props)
      await utils.delay(5000)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getResourceBalance(nextProps)
    // 切换账号时，刷新资产
    this.getAssets()
    this.getNftList()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getTokenBalance = async () => {
    const { account, selectedTokenSymbol } = this.props
    iost.changeNetwork(utils.getNetWork(account))
    const { balance, frozen_balances } = await iost.rpc.blockchain.getBalance(iost.account.getID(), selectedTokenSymbol)

    let frozenAmount = 0

    if (frozen_balances && frozen_balances.length !== 0) {
      frozenAmount = frozen_balances.reduce((acc, cur) => ((acc += cur.amount), acc), 0)
    }

    this.setState({
      amount: balance,
      frozenAmount,
      isLoading: false,
    })
  }

  getResourceBalance = props => {
    return new Promise(async (resolve, reject) => {
      const { account } = props
      try {
        iost.changeNetwork(utils.getNetWork(account))
        const { balance, frozen_balances, gas_info, ram_info } = await iost.rpc.blockchain.getAccountInfo(account.name)
        const frozenAmount = frozen_balances.reduce((prev, next) => ((prev += next.amount), prev), 0)
        this.setState({
          amount: balance,
          frozenAmount,
          gas: gas_info.current_total,
          gas_used: Number((gas_info.limit - gas_info.current_total).toFixed(4)),
          userGasInfo: {
            current_total: gas_info.current_total,
            limit: gas_info.limit,
            pledged_info: gas_info.pledged_info,
          },
          userRamInfo: {
            available: Number((ram_info.available / 1024).toFixed(4)),
            total: Number((ram_info.total / 1024).toFixed(4)),
            used: Number((ram_info.used / 1024).toFixed(4)),
          },
          ram: Number((ram_info.available / 1024).toFixed(4)),
          ram_used: Number((ram_info.used / 1024).toFixed(4)),
          isLoading: false,
        })
        resolve()
      } catch (err) {
        resolve()
      }
    })
  }

  goToTokenDetail = selectSymbol => () => {
    token.selectToken(selectSymbol)
    this.props.moveTo('/tokenDetail')()
  }

  goToNFTDetail = id => () => {
    token.selectNft(id)
    this.props.moveTo('/nftDetail')()
  }

  getAssets = () => {
    Promise.all([utils.getStorage('assets'), user.getActiveAccount()]).then(([assetsList, account]) => {
      if (assetsList) {
        this.setState({
          assetsList: assetsList[`${account.name}-${account.network}`] || [],
        })
      }
    })
  }

  getNftList = async () => {
    const { account } = this.props
    const accountId = account.name
    const result = await iost.rpc.blockchain._provider
      .send('post', 'getContractStorage', {
        id: nftContactId,
        key: `userdata.${accountId}`,
        by_longest_chain: true,
      })
      .then(data => JSON.parse(data.data))
    if (result && result.nfts.length > 0) {
      const list = await Promise.all(
        result.nfts.map(id =>
          iost.rpc.blockchain._provider
            .send('post', 'getContractStorage', {
              id: nftContactId,
              key: `token_${id}`,
              by_longest_chain: true,
            })
            .then(data => JSON.parse(data.data)),
        ),
      )
      this.setState({
        nftList: list.map(item => ({
          id: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
        })),
      })
    }
  }

  onTabIndexChange = index => {
    this.setState({
      tabIndex: index,
    })
  }

  render() {
    const { frozenAmount, amount, gas, gas_used, userGasInfo, userRamInfo, ram, ram_used, isLoading, assetsList, tabIndex, nftList } = this.state
    const { account, moveTo } = this.props

    const url = account
      ? `${
          account.network == 'MAINNET'
            ? 'https://www.iostabc.com'
            : account.network == 'LOCALNET'
            ? account.endpoint || 'http://localhost:30001'
            : 'http://54.249.186.224'
        }/account/${account.name}`
      : '#'

    return (
      <div className="TokenBalance-box">
        <a target={account ? '_blank' : ''} href={url}>
          <div className="logo-box">
            <img className="logo" src="/static/images/logo.png" />
          </div>
          <div className="TokenBalance-amount-box">
            <span className="TokenBalance__amount">{isLoading ? <LoadingImage /> : amount}</span>
            <span className="TokenBalance__symbol">IOST</span>
            {/*(frozenAmount !== 0) && <span className="TokenBalance__frozenBalance"> (+ {frozenAmount})</span>*/}
          </div>
        </a>

        {!isLoading && (
          <div className="TokenBalance__resources">
            <div className="progress-wrapper">
              <div className="progress-box" onClick={moveTo('/gasManage')}>
                <div className="ram-default">
                  <span>iGAS</span>
                  <span className="percent">{`${
                    userGasInfo.limit ? Math.round((1 - userGasInfo.current_total / userGasInfo.limit) * 10000) / 100 : 0
                  }%`}</span>
                </div>
                <div className="progress-wrap">
                  <div
                    className="progress-inner"
                    style={{ width: `${userGasInfo.limit ? Math.round((1 - userGasInfo.current_total / userGasInfo.limit) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="progress-box" onClick={moveTo('/ramManage')}>
                <div className="ram-default">
                  <span>iRAM</span>
                  <span className="percent">{`${userRamInfo.total ? Math.round((userRamInfo.used / userRamInfo.total) * 10000) / 100 : 0}%`}</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-inner" style={{ width: `${userRamInfo.total ? (userRamInfo.used / userRamInfo.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="tabbar-wrapper">
              <div className={cx('tabbar-item', { active: tabIndex === 0 })} onClick={() => this.onTabIndexChange(0)}>
                Tokens
              </div>
              <div className={cx('tabbar-item', { active: tabIndex === 1 })} onClick={() => this.onTabIndexChange(1)}>
                NFTs
              </div>
            </div>

            <div className={cx('coin-list-wrapper', { active: tabIndex === 0 })}>
              {defaultAssets.map(item => (
                <TokenContent symbol={item.symbol} key={item.symbol} account={account} goToTokenDetail={this.goToTokenDetail} />
              ))}

              {assetsList.map(item => (
                <TokenContent symbol={item.symbol} key={item.symbol} account={account} goToTokenDetail={this.goToTokenDetail} />
              ))}

              <p className="add-token" onClick={moveTo('/assetManage')}>
                <i />
                {I18n.t('Account_AddToken')}
              </p>
            </div>

            <div className={cx('nft-list-wrapper', { active: tabIndex === 1 })}>
              {nftList.length == 0 ? <div className="nft-empty">暂无数据</div> : null}
              {nftList.map(item => (
                <NftContent key={item.id} name={item.name} imageUrl={item.imageUrl} goToNFTDetail={this.goToNFTDetail(item.id)} />
              ))}
            </div>

            {/*<p className="TokenBalance__resources_manage">*/}
            {/*  <a onClick={moveTo('/gasManage')}>{I18n.t('GasManage_Title')}</a>*/}
            {/*  <a onClick={moveTo('/ramManage')}>{I18n.t('RamManage_Title')}</a>*/}
            {/*</p>*/}
          </div>
        )}
      </div>
    )
  }
}

class TokenContent extends Component<Props> {
  state = {
    isLoading: true,
    balance: 0,
  }

  interval = null

  componentDidMount() {
    this.getTokenBalance()
    this.interval = setInterval(() => {
      this.getTokenBalance()
    }, 5000)
  }

  componentWillReceiveProps(nextProps) {
    const { account } = this.props
    const { account: newAccount } = nextProps
    if (`${account.name}-${account.network}` != `${newAccount.name}-${newAccount.network}`) {
      this.getTokenBalance()
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }

  getTokenBalance = async () => {
    const { symbol } = this.props
    const { balance } = await iost.rpc.blockchain.getBalance(iost.account.getID(), symbol)
    this.setState({
      isLoading: false,
      balance,
    })
  }

  render() {
    const { balance, isLoading } = this.state
    const { symbol, goToTokenDetail } = this.props

    return (
      <div className="coin-box" onClick={goToTokenDetail(symbol)}>
        <s className="img-name">
          <img className="coin-img" src={iconSrc['url'] + symbol + '.png'} onError={iconSrc['default']} alt="" />
          <span>{symbol.toUpperCase()}</span>
        </s>
        <span>{isLoading ? <LoadingImage /> : balance}</span>
      </div>
    )
  }
}

class NftContent extends Component<Props> {
  render() {
    const { id, name, imageUrl, goToNFTDetail } = this.props

    return (
      <div className="nft-item" onClick={goToNFTDetail}>
        <img src={imageUrl} alt={name} />
        <span>{name}</span>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Index)
