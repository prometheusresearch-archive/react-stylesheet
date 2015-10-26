/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React     from 'react';
import assert    from 'power-assert';
import Styleable from '../Styleable';

describe('Styleable', function() {

  it('makes component use a stylesheet', function() {

    @Styleable
    class Button extends React.Component {

      static stylesheet = {
        Root: 'button'
      };

      render() {
        let {Root} = this.stylesheet;
        return <Root />;
      }
    }

    let markup = React.renderToString(<Button />);
    assert(/<button/.exec(markup));
  });

  it('provides style static method', function() {

    @Styleable
    class Button extends React.Component {

      static stylesheet = {
        Root: 'button'
      };

      render() {
        let {Root} = this.stylesheet;
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

    @Styleable
    class A extends React.Component {

      static stylesheet = {
        Root: 'div'
      };

      render() {
        let {Root} = this.stylesheet;
        return <Root />;
      }
    }

    @Styleable
    class B extends React.Component {

      static stylesheet = {
        Root: A
      };

      render() {
        let {Root} = this.stylesheet;
        return <Root />;
      }
    }

    @Styleable
    class C extends React.Component {

      static stylesheet = {
        Root: B
      };

      render() {
        let {Root} = this.stylesheet;
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
