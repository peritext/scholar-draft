import React, {Component} from 'react';


class BlockAssetChoice extends Component {
  state = {
    searchTerm: ''
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.input){
        this.input.focus();
      }
    }, 1);
  }

  onTermChange = (e) => {
    const searchTerm = e.target.value;
    e.stopPropagation();
    this.setState({
      searchTerm
    })
  }

  onKeyUp = e => {
    // escape pressed
    if (e.which === 27 && typeof this.props.onAssetRequestCancel === 'function') {
      this.props.onAssetRequestCancel();
    }
  }

  onSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    const matching = this.props.options
            .filter(name => name.indexOf(this.state.searchTerm) > -1);
    // add an asset
    if (matching.length) {
      this.props.onAssetChoice();
    // interpret input as text to insert within contents
    } else {
      this.props.addPlainText('@' + this.state.searchTerm);
    }
  }

  render () {
    const {
      onAssetChoice,
      options = []
    } = this.props;

    const onOptionClick = e => {
      e.preventDefault();
      e.stopPropagation();
      onAssetChoice(e);
    }
    const bindRef = input => {
      this.input = input;
    }
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          @<input
            ref={bindRef}
            value={this.state.searchTerm}
            onChange={this.onTermChange}
            onKeyUp={this.onKeyUp}
            placeholder="search an asset"
          />
        </form>
        <ul>
          {
            options
            .filter(name => name.indexOf(this.state.searchTerm) > -1)
            .map((name, index) => 
              <li 
                style={{
                  cursor: 'pointer',
                  background: 'white'
                }}
                key={index} 
                onClick={onOptionClick}
              >{name}</li>
              )
          }
        </ul>
      </div>
    )
  }
}


export default BlockAssetChoice;