
import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { injectIntl, FormattedMessage } from 'react-intl'
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import { setPassword } from '@popup/utils'
import './style.less'

@inject("rootStore")
@observer
class Register extends Component {
  state = {
    password: '',
    repassword: '',
    isChecked: true
  }
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  componentDidMount() {
    document.body.addEventListener('keypress',this.onKeyPress)
  }

  componentWillUnmount() {
    document.body.removeEventListener('keypress',this.onKeyPress)
  }

  onKeyPress = (e) => {
    const key = (e.shiftKey ? 'shift+' : '') + e.keyCode || e.which;
    if(key == '13'){
      e.stopPropagation();
      e.preventDefault();
      this.onSubmit()
    }
  }

  onChange = (value, name) => {
    this.setState({
      [name]: value
    })
  }

  onToggleChecked = () => {
    this.setState({
      isChecked: !this.state.isChecked
    })
  }

  onCheckPassword = () => {
    const { formatMessage: formatMsg } = this.props.intl
    const { password, repassword } = this.state
    if(password == null || password.length < 8){
      Toast.html(formatMsg({id: 'Password_Length'}))
      return false;
    }
    const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    if (!reg.test(password)) {
      Toast.html(formatMsg({id: 'Password_Combination'}))
      return false;
    }
    if (password != repassword) {
      Toast.html(formatMsg({id: 'Password_Different'}))
      return false;
    }
    return true
  }

  onSubmit = () => {
    const { formatMessage: formatMsg } = this.props.intl
    const { password, isChecked } = this.state
    if (!isChecked) {
      return Toast.html(formatMsg({id: 'firstLogin_AgreementTip3'}),3)
    }
    if(this.onCheckPassword()) {
      setPassword(password)
      this.store.app.onReplacePage('accountImport')
    }

  }

  onAgreement = () => {
    this.store.app.onPushPage('userAgreement')
  }

  render(){
    const { formatMessage: formatMsg } = this.props.intl
    const { isChecked } = this.state
    const { loading } = this.store.app
    return(
      <div className="register-container">
        <div className="landing-box">
          <Icon type="home" />
        </div>
        {!loading && <div className="register-box">
          <Input 
            name="password" 
            type="password" 
            onChange={this.onChange} 
            className="input"
            autoFocus
            placeholder={formatMsg({id: 'firstLogin_SetPassword'})}
          />
          <Input 
            name="repassword" 
            type="password" 
            className="input"
            onChange={this.onChange}
            placeholder={formatMsg({id: 'firstLogin_RepeatPassword'})}
          />
          <div className="line"></div>
          <Button onClick={this.onSubmit} >{formatMsg({id: 'firstLogin_ImportAccount'})}</Button>
          <p>
            {formatMsg({id: 'firstLogin_NoAndCreate1'})}
            <a href="https://iostaccount.endless.game" className="third-create" target="_blank">
            {formatMsg({id: 'firstLogin_NoAndCreate2'})}</a>
          </p>
          <div className="agreement-box">
            <Icon type="checkbox" active={isChecked} onClick={this.onToggleChecked}/>
            <span>
              {formatMsg({id: 'firstLogin_AgreementTip1'})}<br />
              <a href='javascript:;' onClick={this.onAgreement}> {formatMsg({id:'firstLogin_AgreementTip2'})}</a>
            </span>
          </div>
        </div>}
      </div>
    )
 }
}

export default injectIntl(Register)