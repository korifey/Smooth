/**
 * Created by kascode on 04.12.15.
 */
import React, { Component, PropTypes } from 'react';
import Store from '../../store/store';

require('./RoundButton.css');

export default class RoundButton extends Component {

    render() {
        let clickFunc = this.props.onClick;
        return <button
            className={'RoundButton' + ' ' + this.props.className}
            href={this.props.href}
            onClick={clickFunc}
            disabled={this.props.buttonDisabled}
        >
            {this.props.text}
        </button>
    }
}

RoundButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    href: PropTypes.string,
    className: PropTypes.string
};