React Stylesheet
================

React Stylesheet is a methodology (and a library) for styling React components.

The main principle of React Stylesheet is that all styling should be done with
React components alone.

DOM components are styled with CSS and composite components are styled with
stylesheets (which are just sets of other components).

Let's define `<Button />` component which is styled using React Stylesheet.

    import React from 'react'
    import ReactStylesheet from 'react-stylesheet'
    import Icon from 'react-fa'

    @ReactStylesheet
    class Button extends React.Component {

      static stylesheet = {
        Root: 'button',
        Icon: Icon,
      }

      render() {
        let {caption, icon} = this.props
        let {Root, Icon} = this.stylesheet
        return (
          <Root>
            <Icon name={icon} />
            {caption}
          </Root>
        )
      }
    }

What we did here is:

* We use `ReactStylesheet` [higher order component][] to mark out component as
  being styleable.

* We use `stylesheet` static attribute to define the stylsheet of the
  component.

* We reference components via `this.stylesheet` in `render()`.

Now the only part left is to produce a version of `<Button />` with different
styling. We use `style()` static method for that:

    let SuccessButton = Button.style({
      Root: {
        color: 'white',
        backgroundColod: 'green',
        hover: {
          color: 'red'
        }
      },
      Icon() {
        return <Icon name="ok" />
      }
    })

We pass `style()` a stylesheet which is merged into the original one:

* If you pass a component (`Icon` in the example above, it's a function but with
  React >= 0.14 it's a valid component also) it is used instead of the original
  one.

* If you pass an object:

  * If it overrides DOM component in the original stylesheet, then the object is
    treated as a set of CSS styles.  It's compiled to CSS class and a new styled
    DOM component wrapper is generated with the CSS class attached.

  * If it overrides composite styleable component in the original stylesheet, then it's
    passed to that's component `style()` static method.

The last point allows to style component hierarchies with easy:

    let StyledForm = Form.style({
      Root: {
        ...
      },
      SubmitButton: {
        Root: {
          ...
        },
        Icon: {
          ...
        }
      }
    })

## Credits

React Stylesheet is free software created by [Prometheus Research][] and is
released under the MIT license.

[Prometheus Research]: http://prometheusresearch.com
[higher order component]: https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775
[react-fa]: https://github.com/andreypopp/react-fa
