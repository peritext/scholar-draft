import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/asset.svg';

class AssetButton extends Component {
  
  static propTypes = {

    onClick: PropTypes.func
  };

  render = () => {

    const { 
      onClick, 
      active,
      iconMap,
      ...otherProps 
    } = this.props;

    return (<div
      className={'scholar-draft-AssetButton' + (active ? ' active': '')}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      {...otherProps}
    >
      {iconMap.asset}
    </div>);
  }
}

export default AssetButton;
