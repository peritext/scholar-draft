import React, {Component} from 'react';

class InlineCitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.asset.resource && props.asset.resource.title,
      pages: props.asset.contextualizer && props.asset.contextualizer.pages,
    }
  }

  componentDidMount() {
    console.log('inline citation did mount', this.state);
    // this.setState({
    //   title: this.props.asset.resource && this.props.asset.resource.title,
    //   pages: this.props.asset.contextualizer && this.props.asset.contextualizer.pages,
    // });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.asset !== nextProps.asset
      || this.state.pages !== nextState.pages
      || this.state.title !== nextState.title
    );
  }

  render() {
  const {
    children,
    asset,
    onChange,
    onBlur,
    onFocus,
  } = this.props;

  const {
    contextualizer = {},
    contextualizerId,
    resource = {},
    resourceId,
  } = asset;

  const onResourceTitleChange = (e) => {
    e.stopPropagation();
    console.log('change title');
    this.setState({
      title: e.target.value
    });
  };

  const onContextualizerPageChange = (e) => {
    e.stopPropagation();
    console.log('change pages', e.target.value);
    this.setState({
      pages: e.target.value
    });
  };
  const bindTitle = title => {
    this.title = title;
  };
  const bindPage = page => {
    this.page = page;
  }
  const onTitleClick = e => {
    e.stopPropagation();
    console.log('on title focus');
    onFocus(e);
    setTimeout(() => {
      this.title.focus();
    }, 1);
  };
  const onPageClick = e => {
    e.stopPropagation();
    onFocus(e);
    setTimeout(() => {
      this.page.focus();
    }, 1);
  };

  const onPagesBlur = e => {
    const pages = this.state.pages;
    console.log('save pages', pages, onChange, onBlur)
    onChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    });
    onBlur(e);
  }
  const onTitleBlur = e => {
    const title = this.state.title;
    onChange('resources', resourceId, {
      ...resource,
      title
    });
    onBlur(e);
  };
  return (
    <span
    >
      <input
        value={this.state.title}
        onChange={onResourceTitleChange}
        onFocus={onFocus}
        onBlur={onTitleBlur}
        onClick={onTitleClick}
        ref={bindTitle}
      />, pp.
      <input
        value={this.state.pages}
        onChange={onContextualizerPageChange}
        onClick={onPageClick}
        onFocus={onFocus}
        onBlur={onPagesBlur}
        ref={bindPage}
      />

      {children}
    </span>
  );    
  }
}
export default InlineCitation;
