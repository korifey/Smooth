/**
 * Created by kascode on 04.12.15.
 */
import React, { Component } from 'react';
import Store from '../../store/store';
import RoundButton from '../RoundButton/RoundButton';

require('./RouteDebug.css');

export default class RouteDebug extends Component {
  constructor() {
    super();
  }

  onSub(e) {
    return document.querySelector('#debugRoute').value;
  }

  render() {
    return <form className={"RouteDebug "}>
      <p className="RouteDebug__text">Route id</p>
      <input id="debugRoute" type="text" onchange={this.onInputChange} />
      <button className="RouteDebug__button" onClick={ (e) => {e.preventDefault(); this.props.onSubmit(this.onSub())} }>Расчитать</button>
    </form>
  }
}