/**
 * Created by kascode on 05.12.15.
 */
import React, { Component, PropTypes } from 'react';
import { setStartRoutePoint, setMap } from '../../actions/Actions';

require('./ObstacleForm.css');

export default class ObstacleForm extends Component {
  render() {
    let confirm = this.props.onObstacleConfirm;
    return <div className={"card ObstacleForm " + (this.props.visibility ? "active" : "")}>
      <p className="card__text ObstacleForm__text">Подтвердите пренадлежность препятствия выделенному участку
        или передвинте препятствие</p>
      <button className="ObstacleForm__button card__button" onClick={confirm} >Подтвердить</button>
    </div>
  }
}
