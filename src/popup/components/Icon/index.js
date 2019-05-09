
import React, { Component } from 'react'
import classnames from 'classnames'
import style from './style.less'

export default class  extends Component {
  constructor(props){
    super(props)
  }
  render(){
  const { type, active, className, color, onClick, dataKey } = this.props
    return(
      <i className={classnames(`icon-${type}`, className, color, active?'active':'' )} onClick={onClick} data-key={dataKey}/>
    )
 }
}