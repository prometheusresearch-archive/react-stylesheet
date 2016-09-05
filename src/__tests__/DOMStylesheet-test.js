/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert from 'power-assert';
import * as DOMStylesheet from '../DOMStylesheet';

function assertCSS(css, ...expectations) {
  css = css.split('\n');
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
    let style = DOMStylesheet.create({
      width: 10,
      color: 'red',
    }, 'style');
    assertCSS(style.css,
      '.style--UNIQ { box-sizing:border-box;width:10px;color:red;-moz-box-sizing:border-box; }'
    );
    assertClassName(style.asClassName(),
      'style--UNIQ'
    );
  });

  it('allows custom ids', function() {
    let style = DOMStylesheet.create({
      color: 'red',
    }, 'button');
    assertCSS(style.css,
      '.button--UNIQ { box-sizing:border-box;color:red;-moz-box-sizing:border-box; }'
    );
    assertClassName(style.asClassName(),
      'button--UNIQ'
    );
  });


  it('lift values to CSS with toCSS() method call', function() {
    class Width {
      toCSS() {
        return 42;
      }
    }
    class Color {
      toCSS() {
        return 'white';
      }
    }
    assertCSS(
      DOMStylesheet.create({
        color: ['red', new Color()],
        width: new Width(),
      }, 'style').css,
      '.style--UNIQ { box-sizing:border-box;color:red;color:white;width:42px;-moz-box-sizing:border-box; }'
    );
  });

  it('autoprefixes', function() {
    assertCSS(
      DOMStylesheet.create({
        display: 'flex',
      }, 'style').css,
      '.style--UNIQ { box-sizing:border-box;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-moz-box-sizing:border-box; }'
    );
  });

  it('compiles arrays into multiple values', function() {
    assertCSS(
      DOMStylesheet.create({
        color: ['red', 'white'],
        width: [1, 10],
      }, 'style').css,
      '.style--UNIQ { box-sizing:border-box;color:red;color:white;width:1px;width:10px;-moz-box-sizing:border-box; }'
    );
    assertCSS(
      DOMStylesheet.create({
        color: [],
        width: [1, 10],
      }, 'style').css,
      '.style--UNIQ { box-sizing:border-box;color:;width:1px;width:10px;-moz-box-sizing:border-box; }'
    );
  });

  it('compiles pseudo classes', function() {
    let style = DOMStylesheet.create({
      focus: {
        color: 'red',
      }
    }, 'style');
    assertCSS(style.css,
      '.style--UNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.style--focus--UNIQ, .style--UNIQ:focus { color:red; }'
    );
    assertClassName(style.asClassName(),
      'style--UNIQ',
    );
    assertClassName(style.asClassName({focus: true}),
      'style--UNIQ',
      'style--focus--UNIQ',
    );
    assertClassName(style.asClassName({focus: false}),
      'style--UNIQ',
    );
  });

  it('compiles arbitrary variant classes', function() {
    let style = DOMStylesheet.create({
      x: {
        color: 'red',
      }
    }, 'style');
    assertCSS(style.css,
      '.style--UNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.style--x--UNIQ { color:red; }',
    );
    assertClassName(style.asClassName(),
      'style--UNIQ',
    );
    assertClassName(style.asClassName({x: true}),
      'style--UNIQ',
      'style--x--UNIQ',
    );
  });

  it('compiles arbitrary variant classes with nested variants', function() {
    let style = DOMStylesheet.create({
      x: {
        color: 'red',
        y: {
          color: 'white'
        }
      }
    }, 'style');
    assertCSS(style.css,
      '.style--UNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.style--x--UNIQ { color:red; }',
      '.style--x--y--UNIQ { color:white; }',
    );
    assertClassName(style.asClassName(),
      'style--UNIQ',
    );
    assertClassName(style.asClassName({x: true}),
      'style--UNIQ',
      'style--x--UNIQ',
    );
    assertClassName(style.asClassName({x: true, y: true}),
      'style--UNIQ',
      'style--x--UNIQ',
      'style--x--y--UNIQ',
    );
    assertClassName(style.asClassName({y: true}),
      'style--UNIQ',
    );
  });

  it('compiles nested pseudoclasses variants', function() {
    let style = DOMStylesheet.create({
      firstChild: {
        color: 'red',
        hover: {
          color: 'white'
        }
      }
    }, 'style');
    assertCSS(style.css,
      '.style--UNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.style--firstChild--UNIQ, .style--UNIQ:first-child { color:red; }',
      '.style--firstChild--hover--UNIQ, .style--UNIQ:first-child:hover, .style--firstChild--UNIQ:hover { color:white; }',
    );
    assertClassName(style.asClassName(),
      'style--UNIQ'
    );
    assertClassName(style.asClassName({firstChild: true}),
      'style--UNIQ',
      'style--firstChild--UNIQ',
    );
    assertClassName(style.asClassName({firstChild: true, hover: true}),
      'style--UNIQ',
      'style--firstChild--UNIQ',
      'style--firstChild--hover--UNIQ',
    );
    assertClassName(style.asClassName({y: true}),
      'style--UNIQ',
    );
  });

  it('compiles arbitrary variant classes with pseudoclasses', function() {
    let style = DOMStylesheet.create({
      x: {
        color: 'red',
        hover: {
          color: 'white'
        }
      }
    }, 'style');
    assertCSS(style.css,
      '.style--UNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.style--x--UNIQ { color:red; }',
      '.style--x--hover--UNIQ, .style--x--UNIQ:hover { color:white; }',
    );
    assertClassName(style.asClassName(),
      'style--UNIQ'
    );
    assertClassName(style.asClassName({x: true}),
      'style--UNIQ',
      'style--x--UNIQ',
    );
    assertClassName(style.asClassName({x: true, hover: true}),
      'style--UNIQ',
      'style--x--UNIQ',
      'style--x--hover--UNIQ',
    );
    assertClassName(style.asClassName({hover: true}),
      'style--UNIQ',
    );
  });

  it('can be overriden with style spec', function() {
    let style = DOMStylesheet.create({
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
      '.style--UNIQ { box-sizing:border-box;background:white;color:black;-moz-box-sizing:border-box; }',
      '.style--x--UNIQ { color:red; }',
      '.style--y--UNIQ { color:white; }',
    );

    let overriden = style.override({
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
      '.style--UNIQ { box-sizing:border-box;background:white;color:yellow;-moz-box-sizing:border-box; }',
      '.style--x--UNIQ { color:x;font-size:12pt; }',
      '.style--y--UNIQ { color:white; }',
      '.style--z--UNIQ { x:12px; }',
    );
  });

  it('preserves id when doing an override', function() {
    let style = DOMStylesheet.create({
      background: 'white',
    }, 's');
    assertCSS(style.css,
      '.s--UNIQ { box-sizing:border-box;background:white;-moz-box-sizing:border-box; }',
    );
    let overriden = style.override({
      background: 'red',
    });
    assertCSS(overriden.css,
      '.s--UNIQ { box-sizing:border-box;background:red;-moz-box-sizing:border-box; }',
    );
  });

  it('allows to customize id when doing an override', function() {
    let style = DOMStylesheet.create({
      background: 'white',
    }, 's');
    assertCSS(style.css,
      '.s--UNIQ { box-sizing:border-box;background:white;-moz-box-sizing:border-box; }',
    );
    let overriden = style.override({
      background: 'red',
    }, 'x');
    assertCSS(overriden.css,
      '.x--UNIQ { box-sizing:border-box;background:red;-moz-box-sizing:border-box; }',
    );
  });

});
