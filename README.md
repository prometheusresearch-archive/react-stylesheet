# React Stylesheet

Style your application with components.

## Motivation

This library implements an approach for styling React applications.

To re-iterate on CSS-in-JS advantages:

* Single language to define UI and to style it—JavaScript.

* Existing tooling for JavaScript can be reused for stylesheets: linters, type
  checkers, formatters, ...

* A lot of features CSS is missing are present in JavaScript: modules,
  functions, variables, ...

For more info on CSS-in-JS and its advantages see [the excellent
talk](css-in-js) by Vjeux.

What makes React Stylesheet special:

* React centric approach: there's no separate abstractions for styles, React
  Stylesheet produces React components directly. You don't need to pass
  `className` or `style` props around. The units of reusability are React
  components.

* Type safety: React Stylesheet is full typesafe. That can help you catch typos
  and invalid style values.

* React Stylesheet compiles to CSS classes under the hood: that means `hover`,
  `focus` states are supported.

[css-in-js]: http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html

## Installation

```
% npm install react-stylesheet
```

## Usage

Basic usage:

```
import {style} from 'react-stylesheet'

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
import * as css from 'react-stylesheet/css'

let Label = style('span', {
  base: {
    border: css.border(1, css.rgb(167)),
  }
})
```
