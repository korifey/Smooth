/**
 * Created by kascode on 09.02.16.
 */
import React, { Component, PropTypes } from 'react';

require('./ChoiceTooltip.css');

export default class ChoiceTooltip extends Component {
  render() {
    var choices = [];

    if (this.props.choices) {
      this.props.choices.forEach((choice, index, array) => {
        choices.push(
          <div
            className={"ChoiceTooltip__choice" + " choice_" + choice.state}
            onClick={choice.action}
            key={index}
          >
            {choice.title}
            {index < array.length-100 ? <div className='ChoiceTooltip__choice-delimeter'/> : ""}
          </div>);
      });
    }
    return (
      <div
        className={"ChoiceTooltip" + (this.props.show ? " visible" : "")}
        //style={"top: " + this.props.yoffset + "; left: " + this.props.xoffset}
        style={{top: this.props.yoffset, left: this.props.xoffset}}
      >
        {choices}
      </div>
    )
  }
}

ChoiceTooltip.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
  xoffset: PropTypes.number.isRequired,
  yoffset: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired
};
