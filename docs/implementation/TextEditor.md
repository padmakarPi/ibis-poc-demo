# VTextEditor Component

The VTextEditor component is a customizable text editor built using the Lexical text editor. This component offers various configuration options through its props, allowing you to integrate it seamlessly into your project.

## Features
- **Rich Text Editing** : Provides a robust text editing experience with a variety of formatting options.
- **Emoji Insertion** : Easily insert emojis into your text using the integrated emoji picker.
- **Mentions** : Implement user mentions with customizable suggestions.
- **Speech Recognition** : Use speech-to-text functionality to input text via voice commands.
- **Customizable Toolbars** : Configure toolbars to suit your needs, with support for both desktop and mobile views.
- **Read and Write Modes** : Switch between read-only and write modes to control whether the content is editable or view-only.
- **Background Color Picker**: Customize the background color of your text.
- **Import/Export in HTML or Markdown**: Import content from and export content to HTML or Markdown formats.
- **Table Support**: Create tables within the text editor.

![alt text](../assets/TextEditor.png)
![alt text](../assets/TextEditor1.png)
![alt text](../assets/Codetexteditor.png)

## Installation

- First, install the @vplatform/shared-components package from npm:

```
npm install @vplatform/shared-components
```

## Usage

- Import the VTextEditor component into your project:

```
import VTextEditor from '@vplatform/shared-components';

const TextEditor = () => {
    return (
            <VTextEditor
                mode={mode}
                theme={theme}
                TopToolbar={true} 
                IconHeight = {'24px'}  
                IconWeight = {'24px'}     
                suggestions={suggestions}
                profileColor={profileColor}
                ClearEditor={clearEditor}
                handleHtmlStringChange={handleHtmlStringChange}
                isMobile={isMobile}     
                activeMic={activeMic}
                open = {open}
                setOpen = {setOpen}
                anchorEl = {anchorEl}
                showTextEditorOptions = {showTextEditorOptions}
                isMention = {isMention}
            />
    )
}


```


## Props

- Below is a detailed description of all the props that need to be passed to the VTextEditor component:

### 1. mode (boolean, options)
-  Determines the mode of the editor (e.g., dark or light mode).

![alt text](../assets/DarkmodeToolbar.png)

### 2. TopToolbar (boolean)
- Toolbar in top of the editor.

### 3. theme (any, optional)
- Sets the theme of the editor, allowing for extensive customization of styles.

### 4. IconHeight(string, optional)

- Specifies the height of icons used in the toolbar. For example IconeHeight  = {'24px'}

### 5. IconWeight(string, optional)

- Specifies the height of icons used in the toolbar. For example IconeHeight  = {'24px'}

### 6. suggestions(optional) :- 
- Provides suggestions for mentions 
- Example usage:

```
interface Suggestions {
  id: number | string;
  name: string;
}

const suggestions: Suggestions[] = [
  {
    id: 3976,
    name: "User Name"
  },
  {
    id: "Everyone",
    name: "Everyone"
  }
];

```

### 7. profileColor(any, optional) :- 
- Sets the profile color for user mentions.
- For example :- 
```
backgroundColor: profileColor(option.id).backgroundColor,
color: profileColor(option.id).color,
```
- option.id comes from the suggestions

### 8. open(boolean,optional):- 
- Determines whether the emoji picker is visible

### 9. setOpen(callback, optional) :- 
- A callback function to set the state of the open prop. This function is called to show or hide the emoji picker.

### 10. anchorEl (HTMLElement | null, optional):- 
- The DOM element used as the anchor for the emoji picker.

### 11. ClearEditor(boolean, optional):- 

- It is mechanism to clear the editor content.

### 12. showTextEditorOptions(boolean):- 
- A boolean to control the visibility of additional text editor options.

### 13. isMention(boolean):-
- Indicates if the mention feature is enabled.

### 14. handleHtmlStringChange(function) : -

- A callback function that is called whenever the HTML string representation of the editor content changes. The function should accept a single argument which is the new HTML string.

### 15. isMobile (boolean,optional): 
- Indicates if the editor is being used on a mobile device. This can be used to conditionally render mobile-specific features.
- If isMobile is true then the footer won't be show in text editor. Footer functionality will be handle by props. 

### 16. activeMic(boolean,optional) :- 
-  Indicates if the speech-to-text microphone is active.















