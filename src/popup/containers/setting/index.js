
import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { injectIntl, FormattedMessage } from 'react-intl'
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import './style.less'

const list = [
  { id: 1, name: 'accountManage', icon: 'account' },
  { id: 2, name: 'language', icon: 'book' },
  { id: 3, name: 'changePwd', icon: 'key'},
  { id: 4, name: 'lock', icon: 'lock' },
  { id: 5, name: 'about', icon: 'wallet' },
]

@inject("rootStore")
@observer
class Setting extends Component {
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  onEnter = (e) => {
    const name = e.currentTarget.dataset.pathname
    this.store.app.onPushPage(name)
  }

  onBack = () => {
    this.store.app.onReplacePage('home')
  }

  render(){
    const { formatMessage: formatMsg } = this.props.intl
    return(
      <div className="setting-container">
        <Header 
          title={formatMsg({id: 'Settings_Title'})} 
          onBack={this.onBack}
        />
        <ul className="setting-list">
          {list.map(item => 
            <li key={item.id} onClick={this.onEnter} data-pathname={item.name}>
              <Icon type={item.icon}/>
              <span>{formatMsg({id: `Settings_${item.name}`})}</span>
            </li>
          )}
        </ul>
      </div>
    )
 }
}

export default injectIntl(Setting)