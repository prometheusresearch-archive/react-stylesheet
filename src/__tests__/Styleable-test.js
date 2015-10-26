/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React     from 'react';
import assert    from 'power-assert';
import Styleable from '../Styleable';

describe('Styleable', function() {

  it('makes component use a stylesheet', function() {

    @Styleable({Root: 'button'})
    class Button extends React.Component {

      render() {
        let {Root} = this.props.stylesheet;
        return <Root />;
      }
    }

    let markup = React.renderToString(<Button />);
    assert(/<button/.exec(markup));
  });

  it('provides style static method', function() {

    @Styleable({Root: 'button'})
    class Button extends React.Component {

      render() {
        let {Root} = this.props.stylesheet;
        return <Root />;
      }
    }

    let StyleableButton = Button.style({
      Root: {
        color: 'red'
      }
    });
    let markup = React.renderToString(<StyleableButton />);
    assert(/<button class="Style_button\d+"/.exec(markup));
  });

  it('allows styling composite components', function() {

    @Styleable({Root: 'div'})
    class A extends React.Component {

      render() {
        let {Root} = this.props.stylesheet;
        return <Root />;
      }
    }

    @Styleable({Root: A})
    class B extends React.Component {

      render() {
        let {Root} = this.props.stylesheet;
        return <Root />;
      }
    }

    @Styleable({Root: B})
    class C extends React.Component {

      render() {
        let {Root} = this.props.stylesheet;
        return <Root />;
      }
    }

    let markup;

    markup = React.renderToString(<C />);
    assert(/<div/.exec(markup));

    let StyleableC = C.style({
      Root: {
        Root: {
          Root: {
            color: 'red'
          }
        }
      }
    });

    markup = React.renderToString(<StyleableC />);
    assert(/<div class="Style_div\d+"/.exec(markup));
    assert(StyleableC.stylesheet.Root.stylesheet.Root.stylesheet.Root.stylesheet.style.self.color === 'red')
  });
});
