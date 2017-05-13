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

  render () {
    const {
      onAssetChoice,
      options = []
    } = this.props;

    const onOptionClick = e => {
      e.preventDefault();
      e.stopPropagation();
      console.log('on option click');
      onAssetChoice(e);
    }
    const bindRef = input => {
      this.input = input;
    }
    return (
      <div>
        <div>
          <input
            ref={bindRef}
            value={this.state.searchTerm}
            onChange={this.onTermChange}
            placeholder="search an asset"
          />
        </div>
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