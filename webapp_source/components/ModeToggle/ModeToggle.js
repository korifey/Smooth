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
    this.state = Store.getState().uiState
  }

  render() {
    return <div className="ModeToggle">
      <RoundButton text="Найти меня"/>
      <RoundButton
          text="Построить маршрут"
          className={"success " + (this.props.routeButtonActive ? 'active' : '')}
          onClick={this.props.onRouteClick}
      />
      <RoundButton
          text="Сообщить о барьере"
          className={"warning " + (this.props.obstacleButtonActive ? 'active' : '')}
          onClick={this.props.onObstacleClick}
      />
    </div>
  }
}