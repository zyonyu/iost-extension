
import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { injectIntl, FormattedMessage } from 'react-intl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import cx from 'classnames'
import './style.less'

@inject("rootStore")
@observer
class TxResult extends Component {
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  onClose = () => {
    this.store.app.onBackPage()
  }

  onCopy = () => {
    const { formatMessage: formatMsg } = this.props.intl
    Toast.html(formatMsg({id: 'CopySuccess'}))
  }

  render(){
    const { formatMessage: formatMsg } = this.props.intl
    const { txResult: tx } = this.store.app
    return(
      <div className="tx-result-container">
        <Header title={formatMsg({id: 'transferResult'})} />
        <div className="tx-result-box">
          <div className={cx('logo-box', tx.success?'success':'failed')}>
            <Icon type={tx.success?'success': 'failed'}/>
            <p>{formatMsg({id: tx.success?'transferSuccess': 'transferFailed'})}</p>
          </div>
          <div className="field-item">
            <p>{formatMsg({id: 'txid'})}</p>
            <p>{tx.tx_hash}</p>
          </div>
          <div className="field-item">
            <p>{formatMsg({id: 'gasUsage'})}</p>
            <p>{tx.gas_usage} iGAS</p>
          </div>
          {!tx.success && <div className="field-item">
            <p>
              {formatMsg({id: 'transferFailedTip'})}
              <CopyToClipboard onCopy={this.onCopy} text={`${tx.message}(status code: ${tx.status_code}})`}>
                <Icon type="copy"/>
              </CopyToClipboard>
            </p>
            {tx.message && <p className="error-info">{tx.message} (status code: {tx.status_code})</p>}
          </div>}
          <Button className="btn-close" onClick={this.onClose}>{formatMsg({id: 'transferClose'})}</Button>
        </div>
      </div>
    )
 }
}

export default injectIntl(TxResult)