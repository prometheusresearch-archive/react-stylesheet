/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React      from 'react';
import assert     from 'power-assert';
import Stylesheet from '../Stylesheet';

describe('Stylesheet', function() {

  it('produces React components from spec', function() {
    let s = Stylesheet({
      header: {
        width: 10
      }
    });
    let markup = React.renderToString(<s.header />);
    assert(/<div class=\"Style_header\d+\"/.exec(markup));
  });

  it('allows to specify underlying component', function() {
    let s = Stylesheet({
      header: {
        Component: 'h1',
        width: 10
      }
    });
    let markup = React.renderToString(<s.header />);
    assert(/<h1 class=\"Style_header\d+\"/.exec(markup));
  });

  it('produces components which can alter styles based on state', function() {
    let s = Stylesheet({
      header: {
        Component: 'div',
        width: 10,
        x: {
          width: 20
        }
      }
    });
    let markup = React.renderToString(<s.header />);
    assert(/<div class=\"Style_header\d+\"/.exec(markup));
    let markupWithState = React.renderToString(<s.header state={{x: true}} />);
    assert(/<div class=\"Style_header\d+\ Style_header\d+--x"/.exec(markupWithState));
  });

  it('passes React components as-is', function() {
    class Composite extends React.Component {

    }
    let s = Stylesheet({
      dom: 'dom',
      Composite: Composite,
    });
    assert(s.dom === 'dom')
    assert(s.Composite === Composite)
  });

});
