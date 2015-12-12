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
  fontWeight: 'bold',
  fontSize: '12pt',
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
  fontWeight: 'bold',
  fontSize: '12pt',
  hover: {
    textDecoration: 'underline'
  }
})
```

Now on hover you can see the underline appears.

But you always force any pseudoclass to appear from JS by passing `variant`
prop:

```
<Label variant={{hover: true}} />
```

### Variants

Sometimes you want a set of style variants and toggle them via JS:

```
let Label = style('span', {
  fontWeight: 'bold',
  fontSize: '12pt',
  important: {
    textDecoration: 'underline'
  }
})
```

Now to toggle any particular variant you need to pass a component `variant`
prop:

```
<Label variant={{important: true}} />
```

This is very similar to pseudoclass example above and in fact pseudoclasses are
also variants.
