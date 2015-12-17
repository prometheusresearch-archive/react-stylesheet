/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import assert from 'power-assert';
import {create, style} from '../Stylesheet';

describe('Stylesheet', function() {

  describe('style(Component, stylesheet)', function() {

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

    it('delegates overrides stylesheet', function() {
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

    it('throws if it cannot style component', function() {
      class C extends React.Component {

      }
      assert.throws(() => {
        style(C, {
          A: 'StyledA'
        });
      }, /Invariant Violation: Unable to style component: <C \/>/);
    });

    it('does not know how to style DOM components', function() {
      assert.throws(() => {
        style('div', {});
      }, /Invariant Violation: Unable to style component: <div \/>/);
    });

    it('allows to specify hook to style DOM components', function() {
      let options = {
        styleDOM(Component, stylesheet) {
          return {ok: true, Component, stylesheet};
        }
      };
      let Styled = style('div', 'stylesheet', options);
      assert(Styled.ok);
      assert(Styled.stylesheet === 'stylesheet');
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

});
