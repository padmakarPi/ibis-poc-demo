## VSearchInput Component

`VSearchInput` is a versatile search input component that allows users to select multiple options from a list with autocomplete functionality. It is designed to work with Material-UI and provides a user-friendly interface for filtering data based on user input.


### Features
- `Multi-Select:` Users can select multiple options from the dropdown list.
- `Dynamic Filtering:` The search input filters available options as the user types.
- `Clear Selection:` Users can clear their selections with a dedicated clear button.
- `Draggable Options:` Supports drag-and-drop functionality to add options to the selection.


## Installation

- First, install the @vplatform/shared-components package from npm:

```
npm install @vplatform/shared-components

// or

npm install @vplatform/shared-components@1.4.0

```

## Usage

Import the VSearchInput component into your project:


```
``
import VSearchInput from '@vplatform/shared-components';

const SearchInput = () => {
    return (
            <VSearchInput
                mode={mode}
                searchData = {searchData}
                setSelectedOptionsGrid = {setSelectedOptionsGrid},
                searchBoxWidth = {searchBoxWidth},
                customTheme = {customTheme}
            />
    )
}
```

## Props

The `VSearchInput` component accepts the following props:

| Prop                    | Type                     | Default     | Required | Description                                                                                   |
|-------------------------|--------------------------|-------------|----------|-----------------------------------------------------------------------------------------------|
| `mode`                  | `boolean`                | `false`     | No       | Determines the color scheme; `true` for dark mode, `false` for light mode.                    |
| `setSelectedOptionsGrid`| `(value: KeyValuePair[]) => void` | `undefined` | No       | Callback function to set the selected options in the parent component.                        |
| `searchData`            | `KeyValuePair[]`         | `undefined` | No       | Array of objects containing the options to be displayed in the autocomplete dropdown.         |
| `searchBoxWidth`        | `string OR number`         | `600`  |No     | Width of the search box.                                                                      |
| `customTheme`           | `customThemeType`        | `undefined` | No       | Custom theme configuration, including `lightTheme` and `darkTheme` for styling components.   |


### KeyValuePair Type

The KeyValuePair type is defined as follows:

```
type KeyValuePair = {
  key: string;
  value: string;
};

// Example

const searchData = [
    { key: "STATUS", value: "Open" },
    { key: "STATUS", value: "Closed" },
    { key: "VESSEL", value: "SS Voyager" },
    { key: "TICKET", value: "Voyager" },
  ];
```

### Custom Theme Structure


`CustomTheme` props will override the theme.


The `customTheme` prop can include the following structure:

```
type customThemeType = {
  darkTheme: any;  // Custom styles for dark mode
  lightTheme: any; // Custom styles for light mode
};

//Example 

const customTheme = {
  lightTheme: {
    typography: {
      fontFamily: "Arial, sans-serif",
      "drp-chips-title": {
        color: "red",
        fontSize: "5px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "24px",
      },
    },
  },
  darkTheme: {
    // Define your dark theme styles here
  },
};

```


