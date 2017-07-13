import React, {Component} from 'react';


class BlockAssetChoice extends Component {
  state = {
    searchTerm: ''
  }

  componentDidMount() {
    this.props.onAssetChoiceFocus();  
    if (this.input){
      setTimeout(() => {
        this.input.focus();
      }, 300);
    }
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
      this.props.onAssetChoice(matching[0]);
    // interpret input as text to insert within contents
    } else {
      console.log('submit', this.props.contentId);
      this.props.addPlainText('@' + this.state.searchTerm);
    }
  }

  onInputClick = e => {
    e.stopPropagation();
    if (this.input) {
      this.input.focus();   
      this.props.onAssetChoiceFocus();  
      setTimeout(() => this.input.focus())   
    }
  }

  render () {
    const {
      onAssetChoice,
      options = []
    } = this.props;

    const onOptionClick = option => {
      onAssetChoice(option);
    }
    const bindRef = input => {
      this.input = input;
    };
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          @<input
            ref={bindRef}
            value={this.state.searchTerm}
            onBlur={this.onBlur}
            onChange={this.onTermChange}
            onKeyUp={this.onKeyUp}
            onClick={this.onInputClick}
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
                onClick={e => onOptionClick(name)}
              >{name}</li>
              )
          }
        </ul>
      </div>
    )
  }
}


export default BlockAssetChoice;