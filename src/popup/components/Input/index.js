
import React, { Component } from 'react'
import cx from 'classnames'
import style from './style.less'

export default class  extends Component {
  static defaultProps = {
    onChange: () => {}
  }
  
  constructor(props){
    super(props)
    this.state = {
      value: props.value || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== undefined){
      this.setState({
        value: nextProps.value
      })
    }
  }
  

  onChange = (e) => {
    const name = e.target.name, value = e.target.value
    this.setState({
      value,
    },() => {
      this.props.onChange(value, name)
    })
  }

  render(){
    const { value } = this.state
    const { type = 'text', name, placeholder, autoFocus, className, boxClassName, onBlur } = this.props
    if(type == 'textarea'){
      return (
        <div className={cx('input-container', boxClassName)}>
          <textarea 
            name={name} 
            value={value}
            className={className}
            autoComplete="off" 
            onChange={this.onChange} 
            placeholder={placeholder}
            autoFocus={autoFocus}
            onBlur={onBlur}
          />
        </div>
      )
    }
    return(
      <div className={cx('input-container', boxClassName)}>
        <input 
          type={type} 
          name={name} 
          value={value}
          className={className}
          autoComplete="off" 
          onChange={this.onChange} 
          placeholder={placeholder}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      </div>
    )
 }
}