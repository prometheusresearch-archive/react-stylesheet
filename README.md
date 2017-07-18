# React Stylesheet

[![Build Status](https://img.shields.io/travis/prometheusresearch/react-stylesheet.svg)](https://travis-ci.org/prometheusresearch/react-stylesheet)
[![NPM Version](https://img.shields.io/npm/v/react-stylesheet.svg)](https://npmjs.org/packages/react-stylesheet)

Component based styling approach for React applications.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
  - [`<Element />`](#element-)
  - [`<VBox />` and `<HBox />`](#vbox--and-hbox-)
  - [Styled component factories](#styled-component-factories)
    - [Pseudoclasses](#pseudoclasses)
    - [Variants](#variants)
    - [Type safety](#type-safety)
  - [CSS helpers](#css-helpers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

This library implements a components-based approach for styling React
applications. Stying with components means styling with JS code.

To re-iterate on CSS-in-JS advantages:

* Single language to define UI and to style it—JavaScript.

* Existing tooling for JavaScript can be reused for stylesheets: linters, type
  checkers, formatters, ...

* A lot of features CSS is missing are present in JavaScript: modules,
  functions, variables, ...

For more info on CSS-in-JS and its advantages see [the excellent
talk][css-in-js] by Vjeux.

What makes React Stylesheet special:

* React centric approach: there's no separate abstractions for styles, React
  Stylesheet produces React components directly. You don't need to pass
  `className` or `style` props around. The units of reusability are React
  components.

* Type safety: React Stylesheet is fully typesafe. That can help you catch typos
  and invalid style values.

* React Stylesheet compiles to CSS classes under the hood: that means `hover`,
  `focus` states are supported.

[css-in-js]: http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html


## Installation

```
% npm install react-stylesheet
```


## Usage


### `<Element />`

`<Element />` component is a basic building block for styling:

```
import {Element} from 'react-stylesheet'

<Element
  background="red"
  color="yellow"
  padding={10}>
  I'm styled!
</Element>
```

#### Styling based on state (hover, focus, ...)

For each prop like `color`, `background`, ... there are versions with suffixes
`*OnHover`, `*onActive`, `*onActive`, and `*onDisabled` which activate its style
values when the corresponding state is being active.

For example there's an `<Element />` which changes its background and text color
on hover:

```
import {Element} from 'react-stylesheet'

<Element
  background="red"
  backgroundOnHover="yellow"
  color="yellow"
  colorOnHover="red"
  padding={10}>
  I'm styled!
</Element>
```

#### Overriding component

By default `<Element />` renders into `<div />` DOM component but you can
override this with `Component` prop:

```
<Element
  Component="button"
  padding={10}>
  click me!
</Element>
```

It can be a composite component but the requirement is that it takes `style` and
`className` props.

### `<VBox />` and `<HBox />`

`<VBox />` and `<HBox />` are thin wrappers on top of `<Element />` which
implement [flexbox][] layout mechanism.

`<VBox />` corresponds to a flex container with `flex-direction: column` and
`<HBox />` — `flex-direction: row`.

All properties which are supported by `<Element />` are also supported by `<VBox />`
and `<HBox />`.

```
import {VBox, HBox} from 'react-stylesheet'

<VBox justifyContent="space-around">
  <HBox flexGrow={1}>Block 1</HBox>
  <HBox>Block 2</HBox>
</VBox>
```

Note that the following defaults are applied:

```
HBox, VBox {
  position: relative;

  overflow: hidden;

  margin: 0;
  padding: 0;

  display: flex;
  align-items: stretch;
  flex-basis: auto;
  flex-shrink: 0;

  min-height: 0;
  min-width: 0;
}
```

[flexbox]: https://css-tricks.com/snippets/css/a-guide-to-flexbox/


### Styled component factories

There's a way to produce styled components out of common components using
`style(Component, stylesheet)` function:

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

#### Styling based on state (hover, focus, ...)

You can specify styling for states (hover, focus, ...):

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

#### Variants

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

#### Type safety

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

### CSS helpers

There's helpers for producing CSS values:

```
import {css} from 'react-stylesheet'

let Label = style('span', {
  base: {
    border: css.border(1, css.rgb(167)),
  }
})
```

### Test utilities

React Stylesheet comes with snapshot serializers for [Jest][] test framework.

The example test setup looks like this:

    import React from 'react';
    import renderer from 'react-test-renderer';

    import {Element} from 'react-stylesheet';
    import * as TestUtils from 'react-stylesheet/testutils';

    expect.addSnapshotSerializer(TestUtils.snapshotSerializer);

    function Hello() {
      return <Element color="red" colorOnHover="black">HEllo!</Element>
    }

    test('rendering <Hello />', function() {
      const tree = renderer.create(<Hello />).toJSON();
      expect(tree).toMatchSnapshot();
    });

Which produces the following snapshot:

    <div
      className={
        StyleJoin [
          PrecompiledCSS {
            "boxSizing": "border-box",
          },
          DynamicallyGeneratedCSS {
            "hover": Object {
              "color": "black",
            },
          },
        ]
      }
      style={Object {
        "hover": "red",
      }}
    >
      Hello
    </div>

[Jest]: https://facebook.github.io/jest/
