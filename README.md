WIP
===

Initially inspired by https://github.com/AlastairTaft/draft-js-editor

# Specification

The peritext draft editor must provide the following specific functionalities :

* in addition to classical text editing features, it must allow to **include *contextualizations* within the editor** - the way these contextualizations are displayed must be handled upstream and the way they are inserted must be handled in two phases (request contextualization -> (upstream operations- choose a resource, choose how to contextualize it) -> add contextualization in the draft's content as an entity and related annotations) - contextualizations target is represented as draft-js *entity* annotations
* provide a **side notes editing interface** and relative representation in upstream state, including side notes order handling in function of main text, and inline contextualizations within the side notes (no block or side notes calls within side notes)


State of the editor (must be provided upstream through props) :

```
{
    mainEditor : {}, // Immutable EditorState instance
    notesMap: {
        uuid: {}, // Immutable EditorState instance
    }
    notesOrder: [uuid, uuid],
    contextualizations: {},
    resources: {},
    contextualizers: {},
    InlineContextualizationComponents: {
        contextualizationType: {} // React component
    },
    BlockContextualizationComponents: {
        contextualizationType: {} // React component
    }
}
```

# ContentEditor

The nano editor is exposed by the library.

It must be used within the principal editor for displaying the main editor and the side notes editors

## Props

### State-related props

`editorState` (ImmutableMap) -> the state of the editor

`contextualizations` (Object) -> map of the contextualizations data to be potentially used by the connector

`resources` (Object) -> map of the resources data to be potentially used by the connector

`contextualizers` (Object) -> map of the contextualizers data to be potentially used by the connector

`lastInsertionType` (String) -> whether the last insertion was inline or block

### Method props

`onEditorChange(editor)`

`onContextualizationRequest()`

`onNoteAdd()`

`onDataChange(dataProp, id, newObject)` 

`onContextualizationClick(contextualizationId, contextualizationData, event)` 

`onContextualizationMouseOver(contextualizationId, contextualizationData, event)` 

`onContextualizationMouseOut(contextualizationId, contextualizationData, event)` 

`onDataChange(dataProp, key, newItem)` -> when mods are applied from editor on contextualizations, contextualizers, or resources

### Parametrization props

`inlineContextualizationComponents` (Object) -> a map for displaying the inline contextualizations in the editor

`blockContextualizationComponents` (Object) -> a map for displaying the block contextualizations in the editor

`editorClass` (string) -> the class name to use

`editorStyles` (Object) -> a style object

`allowNotesInsertion` (Boolean)

`allowContextualizations` (Object) => {inline: Boolean, block: Boolean}

# SectionEditor

Higher level editor combining main text and side notes.

## Structure of SectionEditor

```
-Wrapper
    -NotesWrapper
        - NoteEditorWrapper(loop) // for each note
            -ContentEditor
    -ContentEditor // main content editor
```

## Props

### State-related props

`mainEditor` (ImmutableMap) -> the state of the editor of the main object

`notesMap` (Object) -> map of `editorState` maps representing the editors of each map

`notesOrder` (Array<String>) -> order of the notes in the section editor

`contextualizations` (Object) -> map of the contextualizations data to be potentially used by the connector

`resources` (Object) -> map of the resources data to be potentially used by the connector

`contextualizers` (Object) -> map of the contextualizers data to be potentially used by the connector

`InlineContextualizationComponents` (Object) -> a map for displaying the inline contextualizations in the editor

`BlockContextualizationComponents` (Object) -> a map for displaying the block contextualizations in the editor

### Method props

`onEditorChange(editorState)` 

`onNoteChange(noteId, editorState)` 

`onNotesOrderChange(notesOrder)` -> update the note order 

`onContextualizationRequest(noteIdOrMainContent, relatedEditorState)` 

`onAddNote()`

`onContextualizationClick(contextualizationId, contextualizationData, event)` 

`onContextualizationMouseOver(contextualizationId, contextualizationData, event)` 

`onContextualizationMouseOut(contextualizationId, contextualizationData, event)` 

### Parametrization props

`mainEditorClass` (string) -> the class name to use

`noteEditorClass` (string) -> the class name to use

`mainEditorStyles` (Object) -> a style object

`noteEditorStyles` (Object) -> a style object


