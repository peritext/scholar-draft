WIP
===

```
Initially inspired by https://github.com/AlastairTaft/draft-js-editor
```

`scholar-draft` aims at providing customizable and easy-to-use components for  building academy-oriented apps with `react-js` lib.

This module provides two [`draft-js`](https://draftjs.org) editor wrappers that are focused on three main goals :

* connect draft's editor [entities](https://draftjs.org/docs/advanced-topics-entities.html#content) to upstream logic's data, that is editor's entities whose state is handled in the editor's upstream application logic
* provide callbacks for editing upstream entities from within content editor's interface
* allow to insert, move and edit footnotes within a draft-js editor


# Features

* real-time and editable logic-connected entities within the editor
* footnotes management & edition
* assets insertion request management
* assets drag-and-drop support
* two types of assets wrappers : block and inline (assets contents's components are provided by user)
* markdown shortcuts
* side toolbar and medium-like contextual toolbar (customizable)

The module provides two components :

* `ContentEditor` : editor without footnotes support
* `SectionEditor` : editor with footnotes support

# ContentEditor

## Props

### State-related props

`editorState` (ImmutableMap) -> the state of the editor

`assets` (Object) -> map of the assets data to be potentially used by the connector

### Method props

`onEditorChange(editor)`

`onNoteAdd()`

`onAssetRequest(selection)` -> triggers when an asset insertion is requested from the editor's ui

`onAssetChange(assetProp, id, newObject)` -> when mods are applied from editor on an asset

`onAssetClick(assetId, assetData, event)` 

`onAssetMouseOver(assetId, assetData, event)` 

`onAssetMouseOut(assetId, assetData, event)` 

`onDrop(payload, selection)` 

### Parametrization props

`inlineAssetsComponents` (Object) -> a map for displaying the inline assets components in the editor

`blockAssetsComponents` (Object) -> a map for displaying the block assets components in the editor

`editorClass` (string) -> the class name to use

`editorStyle` (Object) -> a style object

`allowNotesInsertion` (Boolean)

`allowAssets` (Object) => {inline: Boolean, block: Boolean}

# SectionEditor

Higher level editor combining main text and side notes.

## Props

### State-related props

`mainEditor` (ImmutableMap) -> the state of the editor of the main object

`notesMap` (Object) -> map of `editorState` maps representing the editors of each map

`notesOrder` (Array<String>) -> order of the notes in the section editor

`assets` (Object) -> map of the assets data to be potentially used by the editor

### Method props

`onEditorChange(contentType, noteId, editorState)` -> if first argument is 'main' will update main editor state, else related note

`onNoteAdd()`

`onNoteDelete(id)`

`onNotePointerMouseOver(noteId, event)`

`onNotePointerMouseOut(noteId, event)`

`onNotePointerMouseClick(noteId, event)`

`onNotesOrderChange(notesOrder)` -> update the note order 

`onAssetRequest(contentType, noteId, selection)` -> triggers when an asset insertion is requested from the editor's ui

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


