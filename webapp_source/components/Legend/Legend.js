/**
 * Created by kascode on 12.02.16.
 */
import React, { Component, PropTypes } from 'react';

require('./Legend.css');

export default class Legend extends Component {
  renderLegendElement(name, color, distance) {
    return <div className="Legend-item">
      <div className="Legend-item__name">{name}</div>
      <div className="Legend-item__example">
        <div className="Legend-item__line" style={{backgroundColor: color}}></div>
      </div>
      <div className="Legend-item__distance">{distance ? (distance + "м") : ""}</div>
    </div>
  }

  render() {
    return <div className="Legend">
      {this.renderLegendElement("Тротуары", "#64DD17", this.props.walkDistance)}
      {this.renderLegendElement("Опасный путь", "#FF5252", this.props.badDistance)}
      {this.renderLegendElement("Транспорт", "#3F51B5", this.props.transportDistance)}
    </div>
  }
}

Legend.propTypes = {
  walkDistance: PropTypes.number,
  badDistance: PropTypes.number,
  transportDistance: PropTypes.number
};