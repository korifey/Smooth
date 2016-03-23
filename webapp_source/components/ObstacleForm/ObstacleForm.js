/**
 * Created by kascode on 05.12.15.
 */
import React, { Component, PropTypes } from 'react';
import { setStartRoutePoint, setMap } from '../../actions/Actions';

require('./ObstacleForm.css');

export default class ObstacleForm extends Component {
  render() {
    let confirm = this.props.onObstacleConfirm;
    let onPhotoInputChange = this.props.onPhotoInputChange;
    return <form className={"card ObstacleForm" + (this.props.visibility ? " active" : "")} action="http://localhost:3030/obstacle" method="post" enctype="multipart/form-data">
      <div className={"basic" + (this.props.formState === 'BASIC' ? " active" : "")}>
        <p className="card__text ObstacleForm__text">Подтвердите пренадлежность препятствия выделенному участку
          или передвинте препятствие</p>

        <input
            type="file"
            name="obstaclePhoto"
            className="input-file"
            id="obstacle-photo"
            onChange={onPhotoInputChange}/>
        <label
            htmlFor="obstacle-photo"
            className={"ObstacleForm__button card__button" + ((this.props.photoState === 'SELECTED' || this.props.photoState === 'LOADED') ? " success" : "")}>
          {(this.props.photoState === 'SELECTED' || this.props.photoState === 'LOADED') ? "Спасибо" : "Загрузите фото"}
        </label>
        <input type="hidden" name="obstacleLat"/>
        <input type="hidden" name="obstacleLng"/>
        <button
            className="ObstacleForm__button card__button"
            onClick={confirm}
            disabled={this.props.photoState !== 'SELECTED'}
        >
          Отправить
        </button>
      </div>
      <div className={"success" + (this.props.formState === 'SUCCESS' ? " active" : "")}>
        <p className="card__text">Спасибо! Препятствие успешно отправлено.</p>
      </div>
    </form>
  }
}
