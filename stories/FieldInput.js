import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class FieldInput extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
  };

  constructor (...args) {
    super(...args);

    this._rawStr = '';
    this._caretPosition = 0;
  }

  componentDidUpdate = ({ value }) => {
    if (this.props.value !== value) {
      const str = this._rawStr.substr(0, this._caretPosition);
      const index = String(this.props.value).indexOf(str) + this._caretPosition;

      if (index !== -1) {
        this.input.selectionStart = this.input.selectionEnd = index;
      }
    }
  }

  focus = () => {
    this.input.focus();
  }

  handleChange = (ev) => {
    console.log('update input');
    this._rawStr = String(ev.target.value);
    this._caretPosition = Number(ev.target.selectionEnd);

    if (this.props.onChange) {
      this.props.onChange(ev);
    }
  }

  render () {
    const bindRef = input => this.input = input;
    return (<input {...this.props} ref={bindRef} onChange={this.handleChange} />);
  }
};