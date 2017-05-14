WIP
===

```
Initially inspired by https://github.com/AlastairTaft/draft-js-editor
```

`scholar-draft` aims at providing customizable and easy-to-use components for  building academy-oriented editing apps with `react-js` and [`draft-js`](https://draftjs.org) libs.

# Goals and raison d'être of `scholar-draft`

This module provides two [`draft-js`](https://draftjs.org) editor wrappers that are focused on three main goals :

* connect draft's editor [entities](https://draftjs.org/docs/advanced-topics-entities.html#content) to upstream applicationnal logic's assets data in a "one-way binding" manner (entities state is entirely contained upstream separately from the editor state)
* provide callbacks for adding, removing, & editing upstream entities from within the editor's interface
* allow to insert, move and edit footnotes within a draft-js editor, supporting entities as well

To do so, the module provides two components :

* `ContentEditor` : editor without footnotes support
* `SectionEditor` : editor with footnotes support

It also provides a set of `utils` functions for manipulating editor's content upstream (CRUD notes, CRUD assets, ...). Take a look at the `stories` folder for implementation examples.

# Features

* real-time and editable logic-connected entities within the editor
* footnotes management & edition support
* assets drag-and-drop support
* block and inline asset wrappers allowing developpers to provide their own assets components (examples : image preview, video preview, reference preview, ...)
* asset choice wrapper allowing developpers to provide their own asset selection component (example : input connected to server endpoint query, ...)
* markdown shortcuts handling
* customizable medium-like contextual toolbar

# ContentEditor API

## Props

### State-related props

`editorState` (ImmutableMap) -> the state of the editor

`readOnly` (Boolean)

`assets` (Object) -> map of the assets data to be potentially used by the connector

`assetChoiceProps` (Object) -> props to pass to the component displaying asset choice within the editor

`assetRequestPosition` (ImmutableMap) -> position where asset is requested (if requested)

### Method props

`onEditorChange(editor)`

`onNoteAdd()`

`onAssetRequest(selection)` -> triggers when an asset insertion is requested from the editor's ui

`onAssetRequestCancel()`

`onAssetRequestChoice(choice)`

`onAssetChange(assetProp, id, newObject)` -> when mods are applied from editor on an asset

`onAssetClick(assetId, assetData, event)` 

`onAssetMouseOver(assetId, assetData, event)` 

`onAssetMouseOut(assetId, assetData, event)` 

`onDrop(payload, selection)` 

`onClick(event)` 

`onBlur(event)` 

### Parametrization props

`inlineAssetsComponents` (Object) -> a map for displaying the inline assets components in the editor

`blockAssetsComponents` (Object) -> a map for displaying the block assets components in the editor

`AssetChoiceComponent` (ReactComponent) -> the component to use for displaying asset choice in editor (example : an input with a list of possible assets insertion)

`editorClass` (string) -> the class name to use

`editorStyle` (Object) -> a style object

`allowNotesInsertion` (Boolean)

`allowAssets` (Object) => {inline: Boolean, block: Boolean}

# SectionEditor API

## Props

### State-related props

`readOnly` (Boolean)

`mainEditor` (ImmutableMap) -> the state of the editor of the main object

`notesMap` (Object) -> map of `editorState` maps representing the editors of each map

`notesOrder` (Array<String>) -> order of the notes in the section editor

`assets` (Object) -> map of the assets data to be potentially used by the editor

`assetChoiceProps` (Object) -> props to pass to the component displaying asset choice within the editor

`assetRequestPosition` (ImmutableMap) -> position where asset is requested (if requested)

### Method props

`onEditorChange(contentType, noteId, editorState)` -> if first argument is 'main' will update main editor state, else related note

`onNoteAdd()`

`onNoteDelete(id)`

`onNotePointerMouseOver(noteId, event)`

`onNotePointerMouseOut(noteId, event)`

`onNotePointerMouseClick(noteId, event)`

`onNotesOrderChange(notesOrder)` -> update the note order 

`onAssetRequest(contentType, noteId, selection)` -> triggers when an asset insertion is requested from the editor's ui

`onAssetRequestCancel()`

`onAssetRequestChoice(choice)`

`onAssetChange(assetProp, id, newObject)` -> when mods are applied from editor on an asset

`onAssetClick(assetId, assetData, event)` 

`onAssetMouseOver(assetId, assetData, event)` 

`onAssetMouseOut(assetId, assetData, event)` 

`onDrop(contentId, payload, selection)` 

### Parametrization props

`mainEditorClass` (string) -> the class name to use

`noteEditorClass` (string) -> the class name to use

`mainEditorStyle` (Object) -> a style object

`noteEditorStyle` (Object) -> a style object

`InlineAssetComponents` (Object) -> a map for displaying the inline assets in the editor

`BlockAssetComponents` (Object) -> a map for displaying the block assets in the editor

`AssetChoiceComponent` (ReactComponent) -> the component to use for displaying asset choice in editor (example : an input with a list of possible assets insertion)


