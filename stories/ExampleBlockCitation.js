import React, {Component} from 'react';
import PropTypes from 'prop-types';

class BlockCitation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  // static contextTypes = {
  //   emitter: PropTypes.object
  // }

  // componentDidMount() {
  //   this.unsubscribe = this.context.emitter.subscribe(assets => {
  //     const asset = assets[this.props.assetId];
  //     this.setState({
  //       asset
  //     })
  //   });
  // }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  render = () => {
    const {
      children,
      asset,
      onMouseOver,
      onMouseOut,
      onChange,
      onFocus,
      onBlur
    } = this.props;

    // const {
    //   asset
    // } = this.state;
    if (!asset) {
      return null;
    }

    const {
      resource,
      resourceId,
      contextualizerId,
      contextualizer,
      contextualization,
    } = asset;


    const onResourceTitleChange = e => {
      const title = e.target.value;
      onChange('resources', resourceId, {
        ...resource,
        title
      })
    };

    const onContextualizerPageChange = e => {
      const pages = e.target.value;
      onChange('contextualizers', contextualizerId, {
        ...contextualizer,
        pages
      })
    }

    const bindTitle = title => {
      this.title = title;
    };
    const bindPage = page => {
      this.page = page;
    }
    const onTitleClick = e => {
      onFocus(e);
      setTimeout(() => {
        this.title.focus();
      }, 1);
    };
    const onPageClick = e => {
      onFocus(e);
      setTimeout(() => {
        this.page.focus();
      }, 1);
    };
    return (
      <div className="citation-block">
        <span><i>
              <input
                value={resource.title}
                onChange={onResourceTitleChange}
                ref={bindTitle}
                onClick={onTitleClick}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </i>. <i>pp. <input
                value={contextualizer.pages}
                onChange={onContextualizerPageChange}
                onFocus={onFocus}
                onBlur={onBlur}
                ref={bindPage}
                onClick={onPageClick}
              /></i>. 
            {
              resource.authors.map(author => author.firstName + ' ' + author.lastName).join(', ')
            }
        </span>
      </div>
    );
  }
};

export default BlockCitation;


