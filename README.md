React Stylesheet
================

[![Travis build status](https://img.shields.io/travis/prometheusresearch/react-stylesheet/master.svg)](https://travis-ci.org/prometheusresearch/react-stylesheet)

React Stylesheet is a way to style React components with... React components!

## Motivation

Define a convention for styling composite React components which is agnostic to
underlying DOM element styling mechanism (CSS classes or inline styles, CSS in
JS or traditional stylesheets).

Provide a minimal set of API primitives which adhere to the convention.

## Installation

```
% npm install react-stylesheet
```

## Usage

The convention is that a composite React component should define a stylesheet (a
mapping from names to React compoennts) as a class property:

```javascript
import React from 'react'

class Button extends React.Component {

  static stylesheet = {
    Root: 'button',
    Caption: 'div',
  }

  render() {
    let {caption} = this.props
    let {Root, Icon} = this.constructor.stylesheet
    return (
      <Root>
        <Caption>{caption}</Caption>
      </Root>
    )
  }
}
```

Instead of using concrete DOM components `render()` is defined in terms
of components from `this.constructor.stylesheet`.

That allows to derive a new composite component with existing behaviour but with
different stylesheet easily.

React Stylesheet provides an API for that, a `style(Component,
stylesheetOverride)` function:

```javascript
import {style} from 'react-stylesheet'

let SuccessButton = style(Button, {
  Root(props) {
    return <button {...props} className="ui-Button" />
  },
  Caption(props) {
    return <div {...props} className="ui-Button__caption" />
  }
})
```

As you can see we defined an override for original stylesheet which replaces
`<button />` and `<div />` with versions of component which attach some CSS
class names.

Similarly we can define stylesheet which styles DOM component with inline
styles:

```javascript
import {style} from 'react-stylesheet'

let SuccessButton = style(Button, {
  Root(props) {
    return <button {...props} style={{background: 'red'}} />
  },
  Caption(props) {
    return <div {...props} style={{color: 'white'}} />
  }
})
```

React Stylesheet is completely agnostic to the way you want to style DOM
components.

## Credits

React Stylesheet is free software created by [Prometheus Research][] and is
released under the MIT license.

[Prometheus Research]: http://prometheusresearch.com
[higher order component]: https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775
[react-fa]: https://github.com/andreypopp/react-fa
