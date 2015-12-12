/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert from 'power-assert';
import * as DOMStylesheet from '../DOMStylesheet';

function assertCSS(css, ...expectations) {
  assert(css.length === expectations.length);
  expectations.forEach((expectation, idx) => {
    let pattern = new RegExp(`^${expectation.replace(/UNIQ/g, '\\d+')}$`);
    assert(pattern.exec(css[idx]));
  });
}

function assertClassName(className, ...expectations) {
  expectations = expectations.map(expectation =>
    expectation.replace(/UNIQ/g, '\\d+'));
  let pattern = new RegExp(`^${expectations.join(' ')}$`);
  assert(pattern.exec(className));
}

describe('DOMStylesheet', function() {

  it('compiles style representation to CSS', function() {
    let style = DOMStylesheet.createStylesheet({
      width: 10,
      color: 'red',
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;width:10px;color:red; }'
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
  });

  it('compiles arrays into multiple values', function() {
    let style = DOMStylesheet.createStylesheet({
      color: ['red', 'white'],
      width: [1, 10],
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;color:red;color:white;width:1px;width:10px; }'
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({}),
      'Style_styleUNIQ'
    );
  });

  it('compiles pseudo classes', function() {
    let style = DOMStylesheet.createStylesheet({
      focus: {
        color: 'red',
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box; }',
      '.Style_styleUNIQ--focus, .Style_styleUNIQ:focus { color:red; }'
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({focus: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--focus'
    );
    assertClassName(style.asClassName({focus: false}),
      'Style_styleUNIQ'
    );
  });

  it('compiles arbitrary variant classes', function() {
    let style = DOMStylesheet.createStylesheet({
      x: {
        color: 'red',
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:red; }',
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ',
    );
    assertClassName(style.asClassName({x: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
    );
  });

  it('compiles arbitrary variant classes with nested variants', function() {
    let style = DOMStylesheet.createStylesheet({
      x: {
        color: 'red',
        y: {
          color: 'white'
        }
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:red; }',
      '.Style_styleUNIQ--x--y { color:white; }',
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({x: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
    );
    assertClassName(style.asClassName({x: true, y: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
      'Style_styleUNIQ--x--y',
    );
    assertClassName(style.asClassName({y: true}),
      'Style_styleUNIQ',
    );
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
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:red; }',
      '.Style_styleUNIQ--x--hover, .Style_styleUNIQ--x:hover { color:white; }',
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({x: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
    );
    assertClassName(style.asClassName({x: true, hover: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
      'Style_styleUNIQ--x--hover',
    );
    assertClassName(style.asClassName({hover: true}),
      'Style_styleUNIQ',
    );
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

    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;background:white;color:black; }',
      '.Style_styleUNIQ--x { color:red; }',
      '.Style_styleUNIQ--y { color:white; }',
    );

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

    assertCSS(overriden.css,
      '.Style_styleUNIQ { box-sizing:border-box;background:white;color:yellow; }',
      '.Style_styleUNIQ--x { color:x;font-size:12pt; }',
      '.Style_styleUNIQ--y { color:white; }',
      '.Style_styleUNIQ--z { x:12px; }',
    );
  });

});
