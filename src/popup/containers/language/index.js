
import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import { injectIntl, FormattedMessage } from 'react-intl'
import { setLan } from '@popup/utils'
import './style.less'


const list = [
  { id: 1, name: 'china', label: '中文', value: 'zh' },
  { id: 2, name: 'english', label: 'English', value: 'en' },
  { id: 3, name: 'korea', label: '한국어', value: 'ko' },
]

@inject("rootStore")
@observer
class Language extends Component {
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  onChange = (e) => {
    const id = e.currentTarget.dataset.id
    setLan(id)
    this.store.app.refreshLan()
    this.store.app.onBackPage()
  }

  render(){
    const { formatMessage: formatMsg } = this.props.intl
    return(
      <div className="language-container">
        <Header title={formatMsg({id: 'Settings_language'})}/>
        <ul className="language-box">
          {list.map(item => 
            <li key={item.id} data-id={item.value} onClick={this.onChange}>
              <Icon type={item.name} />
              <span>{item.label}</span>
            </li>
          )}
        </ul>
      </div>
    )
 }
}

export default injectIntl(Language)