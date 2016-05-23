/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {create, style, override} from '../';

describe('Stylesheet', function() {

  describe('style(Component, stylesheet)', function() {

    it('styles class component', function() {
      class C extends React.Component {}
      let Styled = style(C, {A: 'A', B: 'B'});
      assert(Styled.defaultProps);
      assert(Styled.defaultProps.stylesheet);
      assert(Styled.defaultProps.stylesheet.A === 'A');
      assert(Styled.defaultProps.stylesheet.B === 'B');
    });

    it('styles funciton component', function() {
      function C() {}
      let Styled = style(C, {A: 'A', B: 'B'});
      assert(Styled.defaultProps);
      assert(Styled.defaultProps.stylesheet);
      assert(Styled.defaultProps.stylesheet.A === 'A');
      assert(Styled.defaultProps.stylesheet.B === 'B');
    });

    it('styles legacy component', function() {
      let C = React.createClass({render() {}});
      let Styled = style(C, {A: 'A', B: 'B'});
      assert(Styled.defaultProps);
      assert(Styled.defaultProps.stylesheet);
      assert(Styled.defaultProps.stylesheet.A === 'A');
      assert(Styled.defaultProps.stylesheet.B === 'B');
    });

    it('styles class component with predefined stylesheet', function() {
      class C extends React.Component {
        static defaultProps = {
          stylesheet: {A: 'A', B: 'B'}
        };
      }
      let Styled = style(C, {B: 'C'});
      assert(Styled.defaultProps);
      assert(Styled.defaultProps.stylesheet);
      assert(Styled.defaultProps.stylesheet.A === 'A');
      assert(Styled.defaultProps.stylesheet.B === 'C');
    });

    it('styles legacy class component with predefined stylesheet', function() {
      let C = React.createClass({
        getDefaultProps() {
          return {stylesheet: {A: 'A', B: 'B'}}
        },
        render() {}
      });
      let Styled = style(C, {B: 'C'});
      assert(Styled.defaultProps);
      assert(Styled.defaultProps.stylesheet);
      assert(Styled.defaultProps.stylesheet.A === 'A');
      assert(Styled.defaultProps.stylesheet.B === 'C');
    });


    it('re-styles funciton component', function() {
      function C() {}
      C.defaultProps = {
        stylesheet: {A: 'A', B: 'B'}
      };
      let Styled = style(C, {B: 'C'});
      assert(Styled.defaultProps);
      assert(Styled.defaultProps.stylesheet);
      assert(Styled.defaultProps.stylesheet.A === 'A');
      assert(Styled.defaultProps.stylesheet.B === 'C');
    });

    it('re-styles class component', function() {
      class C extends React.Component {}
      let Styled = style(C, {A: 'A', B: 'B'});
      let ReStyled = style(Styled, {B: 'C'});
      assert(ReStyled.defaultProps);
      assert(ReStyled.defaultProps.stylesheet);
      assert(ReStyled.defaultProps.stylesheet.A === 'A');
      assert(ReStyled.defaultProps.stylesheet.B === 'C');
    });

    it('re-styles legacy class component', function() {
      let C = React.createClass({
        render() {}
      });
      let Styled = style(C, {A: 'A', B: 'B'});
      let ReStyled = style(Styled, {B: 'C'});
      assert(ReStyled.defaultProps);
      assert(ReStyled.defaultProps.stylesheet);
      assert(ReStyled.defaultProps.stylesheet.A === 'A');
      assert(ReStyled.defaultProps.stylesheet.B === 'C');
    });

    it('re-styles function component', function() {
      function C() {}
      let Styled = style(C, {A: 'A', B: 'B'});
      let ReStyled = style(Styled, {B: 'C'});
      assert(ReStyled.defaultProps);
      assert(ReStyled.defaultProps.stylesheet);
      assert(ReStyled.defaultProps.stylesheet.A === 'A');
      assert(ReStyled.defaultProps.stylesheet.B === 'C');
    });

    it('delegates to static style() if any', function() {
      class C extends React.Component {
        static style(stylesheet) {
          return {stylesheet, ok: true};
        }
      }
      let Styled = style(C, 'stylesheet');
      assert(Styled.ok);
      assert(Styled.stylesheet === 'stylesheet');
    });

    it('overrides static stylesheet (legacy codepath)', function() {
      class C extends React.Component {
        static stylesheet = {
          Root: 'Root',
          A: 'A',
        }
      }
      let Styled = style(C, {
        A: 'StyledA'
      });
      assert(Styled.stylesheet.Root === 'Root');
      assert(Styled.stylesheet.A === 'StyledA');
    });

    it('does not know how to style DOM components', function() {
      assert.throws(() => {
        style('div', {});
      }, /Invariant Violation: Found host component <div \/> but options.styleHostComponent\(\.\.\) is not provided/);
    });

    it('allows to specify hook to style host components', function() {
      let options = {
        styleHostComponent(Component, stylesheet) {
          return {ok: true, Component, stylesheet};
        }
      };
      let Styled = style('div', 'stylesheet', options);
      assert(Styled.ok);
      assert(Styled.stylesheet === 'stylesheet');
    });

    it('preserves a reference to an original component', function() {
      class Orig extends React.Component {
        static stylesheet = {
          A: 'A',
        }
      }
      let Styled = style(Orig, {
        A: 'StyledA'
      });
      assert(Styled.Component === Orig);
      let Styled2 = style(Styled, {
        A: 'StyledA2'
      });
      assert(Styled2.Component === Orig);
    });

    it('preserves displayName', function() {
      class NamedComponent extends React.Component {
        static stylesheet = {
          A: 'A',
        }
      }
      let Styled = style(NamedComponent, {
        A: 'StyledA'
      });
      assert(Styled.displayName === 'NamedComponent');
    });
  });

  describe('create(stylesheetSpec)', function() {

    it('produces React components from spec', function() {
      class Component extends React.Component {
        static stylesheet = {
          Header: 'h1'
        };
      }
      let s = create({
        Component: {
          Component: Component,
          Header: 'h2'
        }
      });
      assert(s.Component.stylesheet.Header === 'h2');
    });

    it('by default sets component to <div />', function() {
      assert.throws(function() {
        create({
          Component: {
            width: 10
          }
        });
      }, 'Invariant Violation: Unable to style component: <div />');
    });

    it('allows to set custom style function', function() {
      let Component;
      let stylesheet;
      let options;
      function style(_Component, _stylesheet, _options) {
        Component = _Component;
        stylesheet = _stylesheet;
        options = _options;
        return 'div2';
      }
      let s = create({
        Component: {
          width: 10
        }
      }, {style});
      assert(Component === 'div');
      assert(stylesheet.width === 10);
      assert(options.style === style);
      assert(s.Component === 'div2');
    });

    it('passes React components as-is', function() {
      class Composite extends React.Component {

        render() {
          return null;
        }
      }
      let s = create({
        dom: 'dom',
        Composite: Composite,
      });
      assert(s.dom === 'dom')
      assert(s.Composite === Composite)
    });

  });

  describe('override(stylesheet, override)', function() {

    it('overrides stylesheet with a spec override', function() {
      class Caption extends React.Component {
        static stylesheet = {
          Header: 'h1'
        };
      }
      let stylesheet = {
        Root: 'div',
        Field: 'span',
        Caption: Caption,
      };
      let overridden = override(stylesheet, {
        Field: 'h1',
        Caption: {
          Header: 'h2',
        }
      });
      assert(overridden.Root === 'div');
      assert(overridden.Field === 'h1');
      assert(overridden.Caption.stylesheet.Header === 'h2');
    });

    it('overrides stylesheet with a stylesheet override', function() {
      class Caption extends React.Component {
        static stylesheet = {
          Header: 'h1'
        };
      }
      let stylesheet = {
        Root: 'div',
        Field: 'span',
        Caption: Caption,
      };
      let overridden = override(stylesheet, create({
        Field: 'h1',
        Caption: {
          Component: Caption,
          Header: 'h2',
        }
      }));
      assert(overridden.Root === 'div');
      assert(overridden.Field === 'h1');
      assert(overridden.Caption.stylesheet.Header === 'h2');
    });

  });

});
