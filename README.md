WIP
===

```
Initially inspired by https://github.com/AlastairTaft/draft-js-editor
```

`scholar-draft` aims at providing customizable and easy-to-use components for  building academy-oriented editing apps with `react-js` and [`draft-js`](https://draftjs.org) libraries.

# Goals of `scholar-draft`

This module provides two react editor components that pursue the following main goals :

* easily connect draft's editor [entities](https://draftjs.org/docs/advanced-topics-entities.html#content) to upstream applicationnal logic in a "one-way binding" manner : **in scholar-draft, entities state and components are entirely handled upstream separately from the editor state**. An entity's data is called an `asset` in the module's vocabulary
* provide callbacks for adding, removing, & editing upstream assets from within the editor's interface
* **allow to insert, move and edit footnotes** within a draft-js editor, while supporting assets as well
* provide two ways to add an asset to the draft : drag-and-drop, inline selection thanks to an input component

To do so, the module provides two components :

* `BasicEditor` : editor without footnotes support
* `Editor` : editor with footnotes support

These components are as "pure" as possible, that is they do not contain their content's state but rather receive it in their props and trigger callbacks when subjected to user's change. For that reason the module also provides a set of `utils` functions for manipulating editor's state upstream of the editor (Create/Update/Delete operations on contents' notes, Create/Update/Delete operations on contents'  assets, ...). Take a look at the `stories` folder for implementation examples.

# Features

* upstream-connected entities support
* footnotes management & edition support
* assets drag-and-drop support
* block and inline asset wrappers allowing developpers to provide their own assets components (examples : image preview component, video preview component, reference preview component, ...). These components can be provided as plain previews, or can host user interactions and trigger callbacks to change upstream assets.
* asset choice wrapper allowing developpers to provide their own asset selection component (example : an input field enabling to search in the list of relevant assets, ...)
* markdown shortcuts handling
* customizable medium-like contextual toolbar
* customizable style, through css classes selectors
* keyboard shortcuts (default: `@` for inserting an asset, `cmd+^` for inserting a footnote)

# Editor API

```js
Editor.propTypes = {
    /**
     * EDITOR STATE
     */
    // draft-js immutable object representing the main editor state
    mainEditorState: PropTypes.object,
    // map of immutable objects representing the notes editor state
    notes: PropTypes.object,
    // array of ids for representing the order of notes
    notesOrder: PropTypes.array,
    assetRequestPosition: PropTypes.object,
    assetRequestContentId: PropTypes.string,
    assetChoiceProps: PropTypes.object,
    focusedEditorId: PropTypes.string,
    // custom context object that will be passed to downstream entity decoration components
    customContext: PropTypes.object,
    // list of objects possibly embeddable inside the editor
    assets: PropTypes.object,

    /**
     * CALLBACKS
     */
    onEditorChange: PropTypes.func,
    onNoteAdd: PropTypes.func,
    onAssetChange: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetClick: PropTypes.func,
    onAssetMouseOver: PropTypes.func,
    onAssetMouseOut: PropTypes.func,
    onAssetBlur: PropTypes.func,
    handlePastedText: PropTypes.func,
    onNotePointerMouseOver: PropTypes.func,
    onNotePointerMouseOut: PropTypes.func,
    onNotePointerMouseClick: PropTypes.func,
    onNoteDelete: PropTypes.func,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onClick: PropTypes.func,
    onBlur: PropTypes.func,

    /**
     * CUSTOMIZATION
     */
    // (translated) messages to provide to the editor for displaying
    messages: PropTypes.shape( {
      addNote: PropTypes.string,
      summonAsset: PropTypes.string,
      cancel: PropTypes.string,
    } ),
    // custom class for the editor
    editorClass: PropTypes.string,
    // editor placeholder text
    editorPlaceholder: PropTypes.string,
    inlineAssetComponents: PropTypes.object,
    blockAssetComponents: PropTypes.object,
    AssetChoiceComponent: PropTypes.func,
    NotePointerComponent: PropTypes.func,
    AssetButtonComponent: PropTypes.func,
    NoteButtonComponent: PropTypes.func,
    NoteLayout: PropTypes.func,
    inlineEntities: PropTypes.array,
    iconMap: PropTypes.object,
    inlineButtons: PropTypes.array,
    NoteContainerComponent: PropTypes.func,
    ElementLayoutComponent: PropTypes.func,
    
    // rendering mode to provide to entity decoration components
    renderingMode: PropTypes.string,

    keyBindingFn: PropTypes.func,
    
    // custom inline styles
    editorStyles: PropTypes.object,
  }
```

# Utils API

`insertAssetInEditor(editorState, asset, selection)` returns new editorState

`insertNoteInEditor(editorState, noteId, selection)` returns new editorState

`deleteAssetFromEditor(editorState, id, callback)` returns new editorState

`deleteNoteFromEditor(editorState, id, callback)` returns new editorState

`updateNotesFromEditor(editorState, notes)` returns updated notes map 

`updateAssetsFromEditor(editorState, assets)` returns new assets map

`getUnusedAssets(editorState, assets)` returns asset map

`getUsedAssets(editorState, assets)` returns asset map

`insertFragment(editorState, fragment)`

