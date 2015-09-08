React Stylesheet
================

React Stylesheet is a methodology for styling React components.

The main principle of React Stylesheet is that all styling should be done with
React components alone. Why? Because it's easier! You'll see.

Let's see how we can define a `<Button />` component:

    import React from 'react'
    import ReactStylesheet from 'react-stylesheet'
    import Icon from 'react-fa'

    @ReactStylesheet.Styleable
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

Three things to note here:

* We applied `ReactStylesheet.Styleable` [higher order component][] on our
  component.

* We defined component's stylesheet to be composed of `Root` being a React DOM
  `<button />` component by default and `Icon` being an `<Icon />` component
  from [react-fa][] package.

* We used components from stylesheet in `render()` method.

Now we can produce a version `<Button />` with different styles by overriding
its stylesheet:

    function SuccessIcon() {
      return <Icon name="ok" />
    }

    let SuccessButton = Button.style({
      Root: {
        color: 'white',
        backgroundColod: 'green'
      },
      Icon: SuccessIcon
    })

[higher order component]: https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775
[react-fa]: https://github.com/andreypopp/react-fa
