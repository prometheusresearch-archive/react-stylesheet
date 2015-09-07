/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React  from 'react';
import assert from 'power-assert';
import Styled from '../Styled';

describe('Styled', function() {

  it('makes component use a stylesheet', function() {

    @Styled
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

    @Styled
    class Button extends React.Component {

      static stylesheet = {
        Root: 'button'
      };

      render() {
        let {Root} = this.stylesheet;
        return <Root />;
      }
    }

    let StyledButton = Button.style({
      Root: {
        color: 'red'
      }
    });
    let markup = React.renderToString(<StyledButton />);
    assert(/<button class="Style_Root\d+"/.exec(markup));
  });

  it('allows styling composite components', function() {

    @Styled
    class A extends React.Component {

      static stylesheet = {
        Root: 'div'
      };

      render() {
        let {Root} = this.stylesheet;
        return <Root />;
      }
    }

    @Styled
    class B extends React.Component {

      static stylesheet = {
        Root: A
      };

      render() {
        let {Root} = this.stylesheet;
        return <Root />;
      }
    }

    @Styled
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

    let StyledC = C.style({
      Root: {
        Root: {
          Root: {
            color: 'red'
          }
        }
      }
    });

    markup = React.renderToString(<StyledC />);
    assert(/<div class="Style_Root\d+"/.exec(markup));
  });
});
