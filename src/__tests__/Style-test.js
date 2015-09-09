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

  it('can be overriden with style spec', function() {
    let style = Style.create({
      background: 'white',
      color: 'black',
      x: {
        color: 'red',
      },
      y: {
        color: 'white',
      }
    });
    let overriden = style.override({
      color: 'yellow',
      x: {
        color: 'x',
        fontSize: '12pt',
      },
      z: {
        x: 12
      }
    });
    assert(overriden.style.self.background === 'white');
    assert(overriden.style.self.color === 'yellow');
    assert(overriden.style.x.color === 'x');
    assert(overriden.style.x.fontSize === '12pt');
    assert(overriden.style.y.color === 'white');
    assert(overriden.style.z.x === 12);
  });

});
