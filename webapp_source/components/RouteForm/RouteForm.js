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

    hideRouteForm() {

    }

    render() {
        return <form className={"RouteForm " + (this.props.visibility ? "active" : "")}>
            <p className="RouteForm__text">Введите адреса точек маршрута или поставьте точки прямо на карте</p>
            <input type="text" id="routeStart" className="RouteForm__input" placeholder="Адрес начала маршрута" />
            <input type="text" id="routeFinish" className="RouteForm__input" placeholder="Адрес конца маршрута" />
            <button className="RouteForm__button">Расчитать</button>
            <a onclick=""></a>
        </form>
    }
}