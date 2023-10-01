import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Header } from 'components'
import { Toast, Modal, Input } from 'components/index'
import Button from 'components/Button'
import './index.scss'
import iconSrc from 'constants/icon'
import LoadingImage from 'components/LoadingImage'
import cx from 'classnames'
import ui from 'utils/ui'
import iost from 'iostJS/iost'
import token, { getTokenInfo, nftContactId } from 'utils/token'
import utils from 'utils/index'
import user from 'utils/user'
// 1000517
type Props = {}

class TokenDetail extends Component<Props> {
  state = {
    isLoading: true,
    nftInfo: {
      id: '',
      owner: '',
      name: '',
      category: '',
      imageUrl: '',
      desc_en: '',
      desc_zh: '',
    },
    sendAccount: '',
    sendVisible: false,
    sendLoading: false,
    receiver: '',
  }

  componentDidMount() {
    this.getNftDetail()
  }

  componentWillUnmount() {}

  moveTo = location => () => {
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

  getNftDetail = async () => {
    const { selectedNFT } = this.props
    const res = await iost.rpc.blockchain._provider
      .send('post', 'getContractStorage', {
        id: nftContactId,
        key: `token_${selectedNFT}`,
        by_longest_chain: true,
      })
      .then(data => JSON.parse(data.data))
    if (res) {
      let desc_en = '',
        desc_zh = ''
      if (res.meta) {
        const meta = JSON.parse(res.meta)
        if (meta && meta.length && meta[0].values) {
          if (meta[0].values.en && meta[0].values.en.length) {
            desc_en = meta[0].values.en.join('\n')
          }
          if (meta[0].values.cn && meta[0].values.cn.length) {
            desc_zh = meta[0].values.cn.join('\n')
          }
        }
      }

      this.setState({
        isLoading: false,
        nftInfo: {
          id: res.id,
          owner: res.owner,
          name: res.name,
          category: res.category,
          imageUrl: res.imageUrl,
          desc_en: desc_en,
          desc_zh: desc_zh,
        },
      })
    }
  }

  showSendModal = () => {
    this.setState({
      sendVisible: true,
    })
  }

  onCloseModal = () => {
    this.setState({
      sendVisible: false,
    })
  }

  sendNft = async () => {
    if (this.state.sendLoading) return
    const token = this.state.nftInfo.id
    const account = iost.account.getID()
    const activeAccount = await user.getActiveAccount()
    const receiver = this.state.receiver
    iost
      .signAndSendNFT(
        nftContactId,
        'transfer',
        [token, account, receiver, '1', ''],
        activeAccount.network === 'LOCALNET' ? activeAccount.chainID : null,
      )
      .on('pending', () => {
        this.setState({
          sendLoading: true,
        })
      })
      .on('success', response => {
        this.setState({ sendLoading: false })
        ui.settingTransferInfo({ ...response, isNFT: true })
        this.moveTo('/tokenTransferSuccess')()
      })
      .on('failed', err => {
        this.setState({ sendLoading: false })
        ui.settingTransferInfo(err)
        this.moveTo('/tokenTransferFailed')()
      })
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  render() {
    const { isLoading, nftInfo, sendVisible, sendLoading, receiver } = this.state
    const lang = I18n._getLocale()
    const account = iost.account.getID()
    return (
      <Fragment>
        <Header title={nftInfo.name.toUpperCase()} onBack={this.backTo} hasSetting={false} />
        {isLoading ? (
          <div className="NftDetail-wrapper loading">
            <LoadingImage />
          </div>
        ) : (
          <div className="NftDetail-wrapper">
            <div className="content-box">
              <div className="logo-box">
                <img className="logo" src={nftInfo.imageUrl} alt="" />
              </div>
              <div className="title">拥有者</div>
              <div className="value">{nftInfo.owner}</div>
              <div className="title">名字</div>
              <div className="value">{nftInfo.name}</div>
              <div className="title">种类</div>
              <div className="value">{nftInfo.category}</div>
              <div className="title">详情</div>
              <div className="value desc">{lang === 'zh' ? nftInfo.desc_zh : nftInfo.desc_en}</div>
              {nftInfo.owner === account ? (
                <Button className="btn-nft-send" onClick={this.showSendModal} disabled={sendLoading}>
                  发送
                </Button>
              ) : null}
            </div>
          </div>
        )}
        <Modal title="" visible={sendVisible} onClose={this.onCloseModal} DialogClass="send-nft-modal-wrapper">
          <div className="send-nft-container">
            <div className="modal-title">发送</div>
            <Input value={receiver} name="receiver" placeholder="接收人" className="input-address" onChange={this.handleChange} />
            <Button className="btn-confirm" disabled={receiver == ''} onClick={this.sendNft}>
              {sendLoading ? <LoadingImage /> : '发送'}
            </Button>
          </div>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  locationList: state.ui.locationList,
  selectedNFT: state.token.selectedNFT,
})

export default connect(mapStateToProps)(TokenDetail)
