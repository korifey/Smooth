/**
 * Created by kascode on 04.12.15.
 */
import React, { Component } from 'react';
import Store from '../../store/store';
import RoundButton from '../RoundButton/RoundButton';

require('./RouteForm.css');

export default class RouteForm extends Component {
  constructor() {
    super();
  }

  render() {
    return <form className={"RouteForm " + (this.props.visibility ? "active" : "")}>
      <p className="RouteForm__text">Поставьте точки старта и финиша на карте</p>
      <button className="RouteForm__button" onClick={ (e) => {e.preventDefault(); this.props.onSubmit()} }>Расчитать</button>
    </form>
  }
}