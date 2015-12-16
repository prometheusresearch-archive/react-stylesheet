React Stylesheet
================

[![Travis build status](https://img.shields.io/travis/prometheusresearch/react-stylesheet/master.svg)](https://travis-ci.org/prometheusresearch/react-stylesheet)

React Stylesheet is a way to style React components with... React components!

## Installation

```
% npm install react-stylesheet
```

## Usage

The idea is that component should define a stylesheet to render its UI.

A stylesheet is just a collection of React components:

```javascript
import React from 'react'

class Button extends React.Component {

  static stylesheet = {
    Root: 'button',
    Caption: 'div',
  }

  render() {
    let {caption} = this.props
    let {Root, Icon} = stylesheet
    return (
      <Root>
        <Caption>{caption}</Caption>
      </Root>
    )
  }
}
```

You ask what React Stylesheet does for you then? It mostly just defines a
convention which is useful for interop.

Aside from that, there are some utilities to redefine styling of components.

The `style(Component, stylesheetOverride)` creates a new component which has a
new stylesheet:

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
