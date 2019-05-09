
import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { Header, Icon, Input, Button, Toast } from '@popup/components'
import { comparePassword, updatePassword } from '@popup/utils'
import { injectIntl, FormattedMessage } from 'react-intl'
import './style.less'

@inject("rootStore")
@observer
class ChangePwd extends Component {
  state = {
    currentPwd: '',
    password: '',
    repassword: '',
    isPasswordRight: '',
    isDifferent: false
  }
  constructor(props){
    super(props)
    this.store = this.props.rootStore
  }

  onChange = (value, name) => {
    this.setState({
      [name]: value
    })
  }

  onCheckCurrentPwd = () => {
    this.setState({
      isPasswordRight: comparePassword(this.state.currentPwd)
    })
  }

  onCheckNewPwd = () => {
    const { password, repassword } = this.state
    this.setState({
      isDifferent: password != repassword
    })
  }

  onUpdatePwd = async () => {
    const { password, currentPwd, isPasswordRight, isDifferent } = this.state
    const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    if (!reg.test(password) || !isPasswordRight || isDifferent){
      return;
    }
    try {
      await updatePassword(password)
      this.store.app.onBackPage()
    } catch (err) {
      console.log(err)
    }

  }

  render(){
    const { formatMessage: formatMsg } = this.props.intl
    const { currentPwd, password, repassword, isPasswordRight, isDifferent } = this.state
    return(
      <div className="changepwd-container">
        <Header title={formatMsg({id: 'Settings_changePwd'})} />
        <div className="changepwd-box">
          <Input 
            name="currentPwd" 
            type="password" 
            onChange={this.onChange}
            onBlur={this.onCheckCurrentPwd}
            autoFocus
            placeholder={formatMsg({id: 'ChangePassword_CurrentPassword'})}
          />
          {(currentPwd == '' || isPasswordRight === '')? '': <p className={isPasswordRight?'approved':'verify-error'}>{formatMsg({id: isPasswordRight?'ChangePassword_Verification':'ChangePassword_Wrong'})}</p>}
          <Input
            name="password"
            type="password"
            onChange={this.onChange}
            placeholder={formatMsg({id: 'ChangePassword_NewPassword'})}
          />
          <Input
            name="repassword"
            type="password"
            onChange={this.onChange}
            className="input-pwd"
            placeholder={formatMsg({id: 'ChangePassword_Repeat'})}
            onBlur={this.onCheckNewPwd}
          />
          {isDifferent ? <p className="verify-error">{formatMsg({id: 'ChangePassword_Wrong'})}</p> : ''}
          <Button className="btn-submit" onClick={this.onUpdatePwd}>{formatMsg({id: 'Settings_changePwd'})}</Button>
        </div>
      </div>
    )
 }
}

export default injectIntl(ChangePwd)