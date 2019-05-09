
import React, { Component } from 'react'
import cx from 'classnames'
import './style.less'

class Tabs extends Component {
  static defaultProps = {
   onChange: () => {} 
  }

  state = {
    activeKey: ''
  }

  constructor(props){
    super(props)
  }

  onChange = (e) => {
    const activeKey = e.currentTarget.dataset.key
    this.setState({
      activeKey
    })
    this.props.onChange(activeKey)
  }

  render(){
    const { defalutActiveKey, children } = this.props
    const activeKey = this.state.activeKey || defalutActiveKey
    let list = []
    console.log(children)
    if(children instanceof Array){
      list = children.map(item => { return { 
        key: item.key, 
        label: item.props.name, 
        child: item.props.children,
        className: item.props.className,
      } })
    }else {
      list = [{ 
        key: children.key, 
        label: children.props.name, 
        value: children.props.value,
        className: item.props.className,
      }]
    }
    return(
      <div className="tabs-container">
        <div className="label-box">
          {list.map( item => 
            <span key={item.key} data-key={item.key} className={activeKey == item.key?'active':''} onClick={this.onChange}>{item.label}</span>
          )}
        </div>
        <div className="content-box">
          {list.map( item => 
            <div key={item.key} data-key={item.key} className={cx(activeKey == item.key?'active':'', item.className)}>{item.child}</div>
          )}
        </div>
      </div>
    )
 }
}

const TabPane = ({children}) => children

Tabs.TabPane = TabPane

export default Tabs