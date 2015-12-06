/**
 * Created by kascode on 04.12.15.
 */
import React, { Component, PropTypes } from 'react';
import Store from '../../store/store';

require('./RoundButton.css');

export default class RoundButton extends Component {

    render() {
        return <a
            className={'RoundButton' + ' ' + this.props.className}
            href={this.props.href}
            onclick={this.props.onclick ? this.props.onclick.bind(this) : null}>
            {this.props.text}
        </a>
    }
}

RoundButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    href: PropTypes.string,
    className: PropTypes.string
};