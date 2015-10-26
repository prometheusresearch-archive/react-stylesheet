/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React from 'react';
import assert from 'power-assert';
import {createStylesheet} from '../Stylesheet';

describe('Stylesheet', function() {

  describe('createStylesheet', function() {

    it('produces React components from spec', function() {
      let s = createStylesheet({
        header: {
          width: 10
        }
      });
      let markup = React.renderToString(<s.header />);
      assert(/<div class=\"Style_div\d+\"/.exec(markup));
    });

    it('allows to specify underlying component', function() {
      let s = createStylesheet({
        header: {
          Component: 'h1',
          width: 10
        }
      });
      let markup = React.renderToString(<s.header />);
      assert(/<h1 class=\"Style_h1\d+\"/.exec(markup));
    });

    it('produces components which can alter styles based on state', function() {
      let s = createStylesheet({
        header: {
          Component: 'div',
          width: 10,
          x: {
            width: 20
          }
        }
      });
      let markup = React.renderToString(<s.header />);
      assert(/<div class=\"Style_div\d+\"/.exec(markup));
      let markupWithState = React.renderToString(<s.header state={{x: true}} />);
      assert(/<div class=\"Style_div\d+\ Style_div\d+--x"/.exec(markupWithState));
    });

    it('passes React components as-is', function() {
      class Composite extends React.Component {

      }
      let s = createStylesheet({
        dom: 'dom',
        Composite: Composite,
      });
      assert(s.dom === 'dom')
      assert(s.Composite === Composite)
    });

  });

});
