/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

class AssetButton extends Component {
  render = () => {
    const {
      onClick, 
      active,
      iconMap,
      message,
      ...otherProps 
    } = this.props;
    const onMouseDown = event => event.preventDefault();
    const bindRef = (element) => {
      this.element = element;
    };
    return (
      <div
        ref={bindRef}
        className={`scholar-draft-AssetButton${active ? ' active' : ''}`}
        onMouseDown={onMouseDown}
        onClick={onClick}
        data-tip={message}
        {...otherProps}
      >
        {iconMap.asset}
        <ReactTooltip 
          place={active ? 'left' : 'right'}
        />
      </div>);
  }
}

AssetButton.propTypes = {

  active: PropTypes.bool,

  iconMap: PropTypes.object,

  onClick: PropTypes.func,

  message: PropTypes.string,
};

export default AssetButton;
