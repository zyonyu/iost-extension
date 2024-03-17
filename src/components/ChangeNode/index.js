import React, { Component, Fragment } from 'react'
import { I18n } from 'react-redux-i18n'
import Button from 'components/Button'
import { Header, Modal, Input, Toast } from 'components'
import i18n from 'utils/i18n'
import utils from 'utils'
import iost from 'iostJS/iost'
import user from 'utils/user'
import cx from 'classnames'

import './index.scss'

const defaultNodeList = [
  {
    name: 'IOST OFFICE',
    url: 'https://api.iost.io',
  },
  {
    name: 'IOST-US',
    url: 'http://18.209.137.246:30001',
  },
  {
    name: 'IOST-Korea',
    url: 'http://54.180.196.80:30001',
  },
  {
    name: 'IOST-UK',
    url: 'http://35.176.24.11:30001',
  },
]
type Props = {}

class ChangeRpc extends Component<Props> {
  state = {
    customList: [],
    currentNode: '',
    inputVisible: false,
    inputText: '',
    speedMap: {},
    blockMap: {},
  }

  componentDidMount() {
    this.getCustomList()
    this.init()
  }

  init = async () => {
    const accounts = await user.getUsers()
    if (accounts.length) {
      const activeAccount = await user.getActiveAccount()
      const account = activeAccount || accounts[0]
      const url = await utils.getCurrentNode(account)
      this.setState({
        currentNode: url,
      })
    }
  }

  getCustomList = () => {
    utils.getCustomNodeList().then(list => {
      this.setState(
        {
          customList: list,
        },
        () => {
          this.getBlockAndTime()
        },
      )
    })
  }

  getBlockAndTime() {
    defaultNodeList.forEach(elem => {
      utils
        .getHeadBlockAndTime(elem.url)
        .then(data => {
          this.setState({
            speedMap: { ...this.state.speedMap, [elem.url]: data.time },
            blockMap: { ...this.state.blockMap, [elem.url]: data.headBlock },
          })
        })
        .catch(err => {
          this.setState({
            speedMap: { ...this.state.speedMap, [elem.url]: -1 },
          })
        })
    })
    this.state.customList.forEach(url => {
      utils
        .getHeadBlockAndTime(url)
        .then(data => {
          this.setState({
            speedMap: { ...this.state.speedMap, [url]: data.time },
            blockMap: { ...this.state.blockMap, [url]: data.headBlock },
          })
        })
        .catch(err => {
          this.setState({
            speedMap: { ...this.state.speedMap, [url]: -1 },
          })
        })
    })
  }

  moveTo = location => () => {
    const { changeLocation } = this.props
    changeLocation(location)
  }

  switchNetwork = url => async () => {
    utils.setCurrentNode(url)
    iost.changeNetwork(url)
    this.setState({
      currentNode: url,
    })
  }

  onOpenModal = () => {
    this.setState({
      inputVisible: true,
    })
  }

  onCloseModal = () => {
    this.setState({
      inputVisible: false,
    })
  }

  addNodeItem = async () => {
    const url = this.state.inputText.trim()
    if (!utils.isURL(url)) {
      Toast.html(I18n.t('ChangeNode_Invalid_Address'))
      return
    }
    if (defaultNodeList.some(item => item.url === url)) {
      Toast.html(I18n.t('ChangeNode_Node_Exist'))
      return
    }
    const customList = this.state.customList
    if (customList.some(elem => elem === url)) {
      Toast.html(I18n.t('ChangeNode_Node_Exist'))
      return
    }
    // const data = await utils.getHeadBlockAndTime(url)
    const newList = [...customList, url]
    utils.setCustomNodeList(newList)

    utils.setCurrentNode(url)
    iost.changeNetwork(url)
    this.setState(
      {
        currentNode: url,
        customList: newList,
        inputVisible: false,
      },
      () => {
        this.getBlockAndTime()
      },
    )
  }

  onNodeChange = e => {
    this.setState({
      inputText: e.target.value,
    })
  }

  onDeleteNode = url => {
    const newList = this.state.customList.filter(elem => elem != url)
    utils.setCustomNodeList(newList)
    this.setState({
      customList: newList,
    })
  }

  render() {
    const { currentNode, customList, inputVisible, inputText, speedMap, blockMap } = this.state
    return (
      <Fragment>
        <Header title={I18n.t('Settings_changeNode')} onBack={this.moveTo('/accountSetting')} hasSetting={false} />
        <div className="changeNode-box">
          <p className="title">{I18n.t('ChangeNode_Default_Node')}</p>
          <ul className="node-list">
            {defaultNodeList.map((item, index) => (
              <li key={index} onClick={this.switchNetwork(item.url)}>
                <div>
                  <div>
                    {item.name}
                    <i className={cx('check', item.url == currentNode ? 'checked' : '')} />
                  </div>
                  <div className="url">{item.url}</div>
                </div>
                <div>
                  {!!speedMap[item.url] && <div>{speedMap[item.url] == -1 ? I18n.t('ChangeNode_Error') : `${speedMap[item.url]}ms`}</div>}
                  {/* {!!blockMap[item.url] && (
                    <div className="block">
                      {I18n.t('ChangeNode_Head_Block')}: {blockMap[item.url]}
                    </div>
                  )} */}
                </div>
              </li>
            ))}
          </ul>
          <p className="title">{I18n.t('ChangeNode_Custom_Node')}</p>
          {customList.length > 0 && (
            <ul className="node-list">
              {customList.map((url, index) => (
                <li key={index} onClick={this.switchNetwork(url)}>
                  <div className="node-link-box">
                    {url !== currentNode && (
                      <i
                        className="del-icon"
                        onClick={e => {
                          e.stopPropagation()
                          this.onDeleteNode(url)
                        }}
                      />
                    )}
                    <span>{url}</span>
                    <i className={cx('check', url == currentNode ? 'checked' : '')} />
                  </div>
                  <div>
                    {!!speedMap[url] && <div>{speedMap[url] == -1 ? I18n.t('ChangeNode_Error') : `${speedMap[url]}ms`}</div>}
                    {/* {!!blockMap[url] && <div className="block">{I18n.t('ChangeNode_Head_Block')}: {blockMap[url]}</div>} */}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Button className="btn-add-node" onClick={this.onOpenModal}>
            {I18n.t('ChangeNode_Add_Custom_Node')}
          </Button>
        </div>
        <Modal title="" visible={inputVisible} onClose={this.onCloseModal} DialogClass="add-node-modal-wrapper">
          <div className="add-node-container">
            <div className="modal-title">{I18n.t('ChangeNode_Add_Custom_Node')}</div>
            <Input
              value={inputText}
              name="nodeurl"
              placeholder={I18n.t('ChangeNode_Enter_Address')}
              className="input-address"
              onChange={this.onNodeChange}
            />
            <Button className="btn-confirm" disabled={inputText == ''} onClick={this.addNodeItem}>
              {I18n.t('ChangeNode_Confirm')}
            </Button>
          </div>
        </Modal>
      </Fragment>
    )
  }
}

export default ChangeRpc
