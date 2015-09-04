/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert from 'power-assert';
import Style  from '../Style';

describe('Style', function() {

  it('compiles style representation to CSS', function() {
    let style = Style.create({
      width: 10,
      color: 'red',
    }, 'style');
    let [_, css] = style.css[0];
    assert(css);
    assert(css.indexOf('width:10px') > -1);
    assert(css.indexOf('color:red') > -1);
    assert(/Style_style/.exec(style.asClassName()));
  });

  it('compiles pseudo classes', function() {
    let style = Style.create({
      focus: {
        color: 'red',
      }
    }, 'style');
    let [_, css] = style.css[0];
    assert(css);
    assert(css.indexOf(':focus') > -1);
    assert(/Style_style/.exec(style.asClassName()));
  });

  it('compiles arbitrary state classes', function() {
    let style = Style.create({
      x: {
        color: 'red',
      }
    }, 'style');
    let [_, css] = style.css[0];
    assert(css);
    assert(css.indexOf('--x') > -1);
    assert(/Style_style/.exec(style.asClassName()));
    assert(/Style_style/.exec(style.asClassName({x: true})));
    assert(/Style_style\d+--x/.exec(style.asClassName({x: true})));
  });

});
