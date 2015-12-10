/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert from 'power-assert';
import * as DOMStylesheet from '../DOMStylesheet';

describe('DOMStylesheet', function() {

  it('compiles style representation to CSS', function() {
    let style = DOMStylesheet.createStylesheet({
      width: 10,
      color: 'red',
    }, 'style');
    let [_, css] = style.css[0];
    css = css.split('\n');
    assert(css.length === 1);
    assert(/^.Style_style\d+ { box-sizing:border-box;width:10px;color:red; }$/.exec(css[0]));
  });

  it('compiles arrays into multiple values', function() {
    let style = DOMStylesheet.createStylesheet({
      color: ['red', 'white'],
      width: [1, 10],
    }, 'style');
    let [_, css] = style.css[0];
    css = css.split('\n');
    assert(css.length === 1);
    assert(/^.Style_style\d+ { box-sizing:border-box;color:red;color:white;width:1px;width:10px; }$/.exec(css[0]));
  });

  it('compiles pseudo classes', function() {
    let style = DOMStylesheet.createStylesheet({
      focus: {
        color: 'red',
      }
    }, 'style');
    let [_, css] = style.css[0];
    css = css.split('\n');
    assert(css.length === 2);
    assert(/^.Style_style\d+ { box-sizing:border-box; }$/.exec(css[0]));
    assert(/^.Style_style\d+--focus, .Style_style\d+:focus { color:red; }$/.exec(css[1]));
  });

  it('compiles arbitrary variant classes', function() {
    let style = DOMStylesheet.createStylesheet({
      x: {
        color: 'red',
      }
    }, 'style');
    let [_, css] = style.css[0];
    css = css.split('\n');
    assert(css.length === 2);
    assert(/^.Style_style\d+ { box-sizing:border-box; }$/.exec(css[0]));
    assert(/^.Style_style\d+--x { color:red; }$/.exec(css[1]));
    assert(/^Style_style\d+$/.exec(style.asClassName()));
    assert(/^Style_style\d+ Style_style\d+--x/.exec(style.asClassName({x: true})));
  });

  it('compiles arbitrary variant classes with pseudoclasses', function() {
    let style = DOMStylesheet.createStylesheet({
      x: {
        color: 'red',
        hover: {
          color: 'white'
        }
      }
    }, 'style');
    let [_, css] = style.css[0];
    css = css.split('\n');
    assert(css.length === 3);
    assert(/^.Style_style\d+ { box-sizing:border-box; }$/.exec(css[0]));
    assert(/^.Style_style\d+--x { color:red; }$/.exec(css[1]));
    assert(/^.Style_style\d+--x--hover, .Style_style\d+--x:hover { color:white; }$/.exec(css[2]));
    assert(/^Style_style\d+$/.exec(style.asClassName()));
    assert(/^Style_style\d+ Style_style\d+--x$/.exec(style.asClassName({x: true})));
    assert(/^Style_style\d+ Style_style\d+--x Style_style\d+--x--hover$/.exec(style.asClassName({x: true, hover: true})));
    assert(/^Style_style\d+ Style_style\d+--x Style_style\d+--x--hover$/.exec(style.asClassName({hover: true, x: true})));
  });

  it('can be overriden with style spec', function() {
    let style = DOMStylesheet.createStylesheet({
      background: 'white',
      color: 'black',
      x: {
        color: 'red',
      },
      y: {
        color: 'white',
      }
    }, 'style');

    let styleCSS = style.css[0][1].split('\n');
    assert(styleCSS.length === 3);
    assert(/^.Style_style\d+ { box-sizing:border-box;background:white;color:black; }$/.exec(styleCSS[0]));
    assert(/^.Style_style\d+--x { color:red; }$/.exec(styleCSS[1]));
    assert(/^.Style_style\d+--y { color:white; }$/.exec(styleCSS[2]));

    let overriden = DOMStylesheet.overrideStylesheet(style, {
      color: 'yellow',
      x: {
        color: 'x',
        fontSize: '12pt',
      },
      z: {
        x: 12
      },
    }, 'style');

    let overridenCSS = overriden.css[0][1].split('\n');
    assert(overridenCSS.length === 4);
    assert(/^.Style_style\d+ { box-sizing:border-box;background:white;color:yellow; }$/.exec(overridenCSS[0]));
    assert(/^.Style_style\d+--x { color:x;font-size:12pt; }$/.exec(overridenCSS[1]));
    assert(/^.Style_style\d+--y { color:white; }$/.exec(overridenCSS[2]));
    assert(/^.Style_style\d+--z { x:12px; }$/.exec(overridenCSS[3]));

    assert(overriden.style.base.background === 'white');
    assert(overriden.style.base.color === 'yellow');
    assert(overriden.style.x.base.color === 'x');
    assert(overriden.style.x.base.fontSize === '12pt');
    assert(overriden.style.y.base.color === 'white');
    assert(overriden.style.z.base.x === 12);
  });

});
