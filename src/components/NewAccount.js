/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'
import { I18n } from 'react-redux-i18n'
import Button from 'components/Button'
import Input from 'components/Input'

import './NewAccount.scss'

type Props = {

}

class NewAccount extends Component<Props> {
  render() {
    const { step, tx, onChange, onNext } = this.props
    if (step === '1') {
      return (
        <div className="popup_box">
          <div className="popup_box__title">创建新账号</div>
          <div className="popup_box__label">
            <div className="popup_box__label_tit">{I18n.t('CreateAccount_CreateUser')}</div>
            <div className="popup_box__label_con">{tx.createUser}</div>
          </div>
          <div className="popup_box__label">
            <div className="popup_box__label_tit">{I18n.t('CreateAccount_AccountName2')}</div>
            <div className="popup_box__label_con">{tx.accountName}</div>
          </div>
          <div className="popup_box__label">
            <div className="popup_box__label_tit">{I18n.t('CreateAccount_OwnerPublicKey1')}</div>
            <div className="popup_box__label_con">{tx.ownerPublicKey}</div>
          </div>
          <div className="popup_box__label">
            <div className="popup_box__label_tit">{I18n.t('CreateAccount_ActivePublicKey1')}</div>
            <div className="popup_box__label_con">{tx.activePublicKey}</div>
          </div>
          <div className="popup_box__label">
            <div className="popup_box__label_tit">{I18n.t('CreateAccount_AllotMemory')}</div>
            <div className="popup_box__label_con">{tx.allotMemory} bytes</div>
          </div>
          <div className="popup_box__label">
            <div className="popup_box__label_tit">{I18n.t('CreateAccount_PledgeIGAS')}</div>
            <div className="popup_box__label_con">{tx.pledgeIGAS} IOST</div>
          </div>
          <Button className="popup_box__btn" onClick={onNext}>{I18n.t('CreateAccount_NextStep')}</Button>
        </div>
      )
    }
    return (
      <div className="popup_box">
        <div className="popup_box__title">创建新账号</div>
        <div className="popup_box__input_box">
          <Input name="password" type="password" placeholder={I18n.t('Lock_EnterPassword')} onChange={onChange} className="input-key" />
        </div>
        <Button className="popup_box__btn" onClick={onNext}>{I18n.t('ManageAccount_Confirm')}</Button>
      </div>
    )
  }
}

export default NewAccount
