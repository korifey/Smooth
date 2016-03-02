/**
 * Created by kascode on 04.12.15.
 */
import React, { Component } from 'react';
import Store from '../../store/store';
import RoundButton from '../RoundButton/RoundButton';

require('./ModeToggle.css');

export default class ModeToggle extends Component {
  constructor() {
    super();
  }

  render() {
    return <div className="ModeToggle">
      <RoundButton text="Найти меня" onClick={this.props.onLocationClick}/>
      <RoundButton
        text="Транспорт"
        onClick={this.props.onTransportClick}
        className={this.props.transportState ? 'success' : ''}
      />
    </div>
  }
}