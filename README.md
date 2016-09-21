# React DOM Stylesheet

A simple yet powerful way to define styled React DOM components.

## Installation

```
% npm install react-dom-stylesheet
```

## Usage

Basic usage:

```
import {style} from 'react-dom-stylesheet'

let Label = style('span', {
  base: {
    fontWeight: 'bold',
    fontSize: '12pt',
  }
})
```

Now `Label` is a regular React component styled with `fontWeight` and
`fontSize`. You can render into DOM and use as a part of React element tree:

```
<Label />
```

### Pseudoclasses

Pseudoclasses are supported:

```
let Label = style('span', {
  base: {
    fontWeight: 'bold',
    fontSize: '12pt',
    hover: {
      textDecoration: 'underline'
    }
  }
})
```

Now on hover you can see the underline appears.

### Variants

Sometimes you want a set of style variants and toggle them via JS:

```
let Label = style('span', {
  base: {
    fontWeight: 'bold',
    fontSize: '12pt',
  },
  emphasis: {
    textDecoration: 'underline'
  },
})
```

Now to toggle any particular variant you need to pass a component a specially
constructed `variant` prop:

```
<Label variant={{emphasis: true}} />
```

### Type safety

React DOM Stylesheet comes with Flow typings which precisely describe available
API.

Some examples of the type errors you can get:

```
style('span', {
  display: 'oops' // display can only be "none" | "block" | ...
})

style('span', {
  isplay: 'block' // unknown property "isplay"
})
```

## CSS helpers

There's helpers for producing CSS values:

```
import * as css from 'react-dom-stylesheet/css'

let Label = style('span', {
  base: {
    border: css.border(1, css.rgb(167)),
  }
})
```
