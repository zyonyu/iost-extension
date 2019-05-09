import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import { injectIntl, FormattedMessage } from 'react-intl'
import './style.less'

const list = [
  { id: 2, name: 'agreement' },
]

@inject("rootStore")
@observer
class About extends Component {
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  onEnter = (e) => {
    const name = e.currentTarget.dataset.pathname
    this.store.app.onPushPage(name)
  }


  render(){
    const { formatMessage: formatMsg } = this.props.intl
    return(
      <div className="about-container">
        <Header title={formatMsg({id: 'Settings_about'})} />
        <ul className="about-box">
          {list.map(item => 
            <li key={item.id} data-pathname={item.name} onClick={this.onEnter}>
              <Icon type={item.name}/>
              <span>{formatMsg({id: `AboutIOST_${item.name}`})}</span>
            </li>
          )}
        </ul>
      </div>
    )
 }
}

export default injectIntl(About)