# JavaSheet

This is an attempt at building a lightweight spreadsheet engine that uses the canvas for the rendering.

this is a **WIP** and things may break or change ay anytime, if this happens feel free to raise an issue.

## Usage

Currently the API is really developed, but you can see the [example.html](./example.html) in your browser to play around

```javascript
import Spreadsheet from "/src/Spreadsheet.js"
const spreadsheet = new Spreadsheet({
  width: 800,
  height: 800
  onClick: (text) => {
    console.log(text)
  }
});
spreadsheet.render(document.getElementById("root"));
```

## Basic features

-  Spreadsheet 
    - [X] Rendering the cells (along with text rendering)
    - Navigating across the cells w/ customizable bindings 
    - Cell editing, handling multiline content
- Engine
  - A way to actually process a spreadsheet, maybe a 2D array
  - A "formula" parser to operate on the said array
-  Handling the toolbar
    - Using toolbar to configure the status
