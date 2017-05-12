import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/asset.svg';

const styles = {
  iconContainer: {
    display: 'inline-block',
    height: 24,
    width: 24,
  },
};

class AssetButton extends Component {
  
  static propTypes = {

    onClick: PropTypes.func
  };

  render = () => {

    const { 
      onClick, 
      ...otherProps 
    } = this.props;

    return (<div
      style={styles.iconContainer}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      {...otherProps}
    >
      <SVGInline
        svg={iconSVG}
      />
    </div>);
  }
}

export default AssetButton;