
import React, { Component } from 'react'
import style from './style.less'

const ResourceProgress = ({ onClick, name, total, used, remaining, percent }) => (
  <div className="resource-progress-container" onClick={onClick}>
    <div className="top-box">
      <span>{name}</span>
      <span>{total}</span>
    </div>
    <div className="progress-box">
      <div className="inner" style={{width: `${percent}%`}}></div>
    </div>
    <div className="bottom-box">
      <span>{used}</span>
      <span>{remaining}</span>
    </div>
  </div>
)

export default ResourceProgress