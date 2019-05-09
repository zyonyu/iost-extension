
import React, { Component } from 'react'
import { Button, Icon, Header } from '@popup/components'
import { injectIntl, FormattedMessage } from 'react-intl'
import './style.less'

class Dialog extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        
      </div>
    )
 }
}

const Confirm = ({ title, onClose, children}) => (
  <div className="confirm-dialog-box">
    <div className="overlay"></div>
    <div className="content-wrapper">
      <div className="content-box">
        <span className="title">{title}</span>
        <Icon type="close" onClick={onClose} className="icon-close"/>
        {children}
      </div>
    </div>
  </div>
)



Dialog.Confirm = Confirm
export default Dialog