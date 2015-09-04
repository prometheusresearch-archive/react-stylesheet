React Stylesheet
================

React Stylesheet provides a way to produce React components which have
predefined styles applied:

    import Stylesheet from 'react-stylesheet'

    let styled = Stylesheet({

      header: {
        boxSizing: 'border-box',
        height: 50

        focus: {
          backgroundColor: 'red'
        }
      },

      content: {
        fontSize: '12pt'
      },

      footer: {
        boxSizing: 'border-box'
      }

    })

Then you can use components from `styled` as regular React components:

    class Widget extends React.Component {

      render() {
        return (
          <div>
            <styled.header>
              Hello!
            </styled.header>
            <styled.content>
              ...
            </styled.content>
            <styled.footer>
              Bye!
            </styled.footer>
          </div>
        )
      }
    }

Specify DOM component
---------------------

When defining styled components you can specify which DOM component to use as an
underlying component:

    let styled = Stylesheet({

      header: {
        Component: 'h1',
        boxSizing: 'border-box',
        height: 50
      }
    })

So that `<styled.header />` will render into `<h1 />`.

Theming
-------

Objects produced by `Stylesheet` function are plain JavaScript objects and they
can be passed around like every other thing in JavaScript.

That means that you can parametrize your components with a prop which accepts
different stylesheets:

    class Widget extends React.Component {

      render() {
        let {theme} = this.props
        return (
          <div>
            <theme.header>
              Hello!
            </theme.header>
            <theme.content>
              ...
            </theme.content>
            <theme.footer>
              Bye!
            </theme.footer>
          </div>
        )
      }
    }

Later you can define several different themes:

    let bootstrapTheme = Stylesheet({
      ...
    })

    let materialTheme = Stylesheet({
      ...
    })

Then render your `<Widget />` with one or another:

    <Widget theme={bootstrapTheme} />
    <Widget theme={materialTheme} />

Because `Stylesheet` returns regular React components you can define themes
which override some parts of the component not only with different styles but
also with different behaviour:

    class MyFancyHeader extends React.Component {
      ...
    }

    let customTheme = Stylesheet({
      header: MyFancyHeader
    })
