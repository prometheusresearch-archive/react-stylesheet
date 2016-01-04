/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React from 'react';
import {style, create, isStylesheet} from '../';

describe('index', function() {

  describe('style(...)', function() {

    it('creates a component with a stylesheet attached', function() {
      let Component = 'div';
      let Styled = style(Component, {width: 10});
      assert(Styled.Component === 'div');
      assert(Styled.stylesheet.style.base.width === 10);
      assert(Styled.displayName === 'StyleableDOMComponent(div)');
    });

    it('uses stylesheet as-is if it is passed instead of a spec', function() {
      let Component = 'div';
      let stylesheet = create({width: 10});
      let Styled = style(Component, stylesheet);
      assert(Styled.stylesheet === stylesheet);
    });

    it('allows to override displayName', function() {
      let Component = 'div';
      let Styled = style(Component, {width: 10}, 'CustomDisplayName');
      assert(Styled.displayName === 'CustomDisplayName');
    });

    it('delegates to style() method if component has it', function() {
      class Component extends React.Component {

        render() {
          return <div className={this.props.className} />;
        }

        static style(_stylesheet) {
          return 'span';
        }
      }

      let Styled = style(Component, {width: 10});
      assert(Styled === 'span');
    });

  });

  describe('create(...)', function() {

    it('creates a new stylesheet', function() {
      let stylesheet = create({width: 10});
      assert(isStylesheet(stylesheet));
    });

  });

});
