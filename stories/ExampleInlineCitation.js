import React, {Component} from 'react';

class InlineCitation extends Component {
  constructor(props) {
    super(props);
    
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
    const title = e.target.value;
    onChange('resources', resourceId, {
      ...resource,
      title
    });
  };

  const onContextualizerPageChange = (e) => {
    const pages = e.target.value;
    onChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    });
  };
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
    <span
    >
      <input
        value={resource.title}
        onChange={onResourceTitleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onTitleClick}
        ref={bindTitle}
      />, pp.
      <input
        value={contextualizer.pages}
        onChange={onContextualizerPageChange}
        onClick={onPageClick}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={bindPage}
      />

      {children}
    </span>
  );    
  }
}
// const InlineCitation = (props) => {
//   const {
//     children,
//     asset,
//     onChange,
//     onBlur,
//     onFocus,
//   } = props;

//   const {
//     contextualizer = {},
//     contextualizerId,
//     resource = {},
//     resourceId,
//   } = asset;

//   const onResourceTitleChange = (e) => {
//     const title = e.target.value;
//     onChange('resources', resourceId, {
//       ...resource,
//       title
//     });
//   };

//   const onContextualizerPageChange = (e) => {
//     const pages = e.target.value;
//     onChange('contextualizers', contextualizerId, {
//       ...contextualizer,
//       pages
//     });
//   };
//   const onClick = e => {
//     console.log('on inline input click', e);
//   }
//   return (
//     <span
//       onClick={onClick}
//     >
//       <input
//         value={resource.title}
//         onChange={onResourceTitleChange}
//         onFocus={onFocus}
//         onBlur={onBlur}
//       />, pp.
//       <input
//         value={contextualizer.pages}
//         onChange={onContextualizerPageChange}
//         onFocus={onFocus}
//         onBlur={onBlur}
//       />

//       {children}
//     </span>
//   );
// };

export default InlineCitation;
