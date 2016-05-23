React Stylesheet
================

[![Travis build status](https://img.shields.io/travis/prometheusresearch/react-stylesheet/master.svg)](https://travis-ci.org/prometheusresearch/react-stylesheet)

React Stylesheet is a way to style React components with... React components!

## Motivation

Define a convention for styling composite React components which is agnostic to
the underlying DOM element styling mechanism (CSS classes or inline styles, CSS
in JS or traditional stylesheets).

Provide a minimal set of API primitives which adhere to the convention.

## Installation

```
% npm install react-stylesheet
```

## Usage

Components should define their appearance in terms of other components, they do
so by acceping a `stylesheet` prop which is mapping from string keys to
components.

```javascript
import React from 'react'

class Button extends React.Component {

  static defaultProps = {
    stylesheet: {
      Root: 'button',
      Caption: 'div',
    }
  }

  render() {
    let {caption, stylesheet: {Root, Caption}} = this.props
    return (
      <Root>
        <Caption>{caption}</Caption>
      </Root>
    )
  }
}
```

Instead of using concrete DOM components, `render()` is defined in terms of
components from `this.props.stylesheet`.

Now to derive a styled variant of a component React Stylesheet provides a single
function `style(Component, override)`:

```javascript
import {style} from 'react-stylesheet'

let SuccessButton = style(Button, {
  Caption(props) {
    return <div {...props} className="ui-Button__caption" />
  }
})
```

As you can see, we defined an override for the original stylesheet which
replaces `<button />` and `<div />` with versions of the components which attach
some CSS class names.

Another option would be to use inline styles:

```javascript
import {style} from 'react-stylesheet'

let SuccessButton = style(Button, {
  Caption(props) {
    return <div {...props} style={{color: 'white'}} />
  }
})
```

As you can see React Stylesheet is completely agnostic to the way you want to
style DOM components.

## Credits

React Stylesheet is free software created by [Prometheus Research][] and is
released under the MIT license.

[Prometheus Research]: http://prometheusresearch.com
