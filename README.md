React Stylesheet
================

React Stylesheet is a methodology for styling React components.

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

* We used `ReactStylesheet` [higher order component][] to mark out component as
  being styleable by React Stylesheet.

* We used `stylesheet` static attribute to define the stylsheet of the
  component.

* We used `this.stylesheet` instance attribute to render the component.

Now the only part left is to produce a version of `<Button />` with different
styling. We use `style` static method for that:

    let SuccessButton = Button.style({
      Root: {
        color: 'white',
        backgroundColod: 'green'
      },
      Icon() {
        return <Icon name="ok" />
      }
    })

## Credits

React Selectbox is free software created by [Prometheus Research][] and is
released under the MIT license.

[Prometheus Research, LLC]: http://prometheusresearch.com
[higher order component]: https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775
[react-fa]: https://github.com/andreypopp/react-fa
