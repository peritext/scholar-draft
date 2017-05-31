/* eslint react/prop-types: 0 */

import React from 'react';
import PropTypes from 'prop-types';

const AssetButton = ({ 
  onClick, 
  active,
  iconMap,
  ...otherProps 
}) => {
  const onMouseDown = event => event.preventDefault();
  return (
    <div
      className={`scholar-draft-AssetButton${active ? ' active' : ''}`}
      onMouseDown={onMouseDown}
      onClick={onClick}
      {...otherProps}
    >
      {iconMap.asset}
    </div>);
};

AssetButton.propTypes = {

  active: PropTypes.bool,

  iconMap: PropTypes.object,

  onClick: PropTypes.func
};

export default AssetButton;
