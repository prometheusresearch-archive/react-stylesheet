/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React from 'react';
import assert from 'power-assert';
import styleComponent from '../styleComponent';

describe('styleComponent', function() {

  it('delegates to static style() if any', function() {
    class C extends React.Component {
      static style(stylesheet) {
        return {stylesheet, ok: true};
      }
    }
    let Styled = styleComponent(C, 'stylesheet');
    assert(Styled.ok);
    assert(Styled.stylesheet === 'stylesheet');
  });

  it('delegates overrides stylesheet', function() {
    class C extends React.Component {
      static stylesheet = {
        Root: 'Root',
        A: 'A',
      }
    }
    let Styled = styleComponent(C, {
      A: 'StyledA'
    });
    assert(Styled.stylesheet.Root === 'Root');
    assert(Styled.stylesheet.A === 'StyledA');
  });

  it('throws if it cannot style component', function() {
    class C extends React.Component {

    }
    assert.throws(() => {
      styleComponent(C, {
        A: 'StyledA'
      });
    }, /Invariant Violation: Unable to style component: <C \/>/);
  });

  it('does not know how to style DOM components', function() {
    assert.throws(() => {
      styleComponent('div', {});
    }, /Invariant Violation: Unable to style component: <div \/>/);
  });

  it('allows to specify hook to style DOM components', function() {
    let options = {
      styleDOM(Component, stylesheet) {
        return {ok: true, Component, stylesheet};
      }
    };
    let Styled = styleComponent('div', 'stylesheet', options);
    assert(Styled.ok);
    assert(Styled.stylesheet === 'stylesheet');
  });

});

