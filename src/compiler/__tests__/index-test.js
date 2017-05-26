import compile from '../index';

it('compiles base', function() {
  let stylesheet = {
    base: {
      color: 'red',
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
  });
  expect(css).toMatchSnapshot();
});

it('compiles to hyphenated name', function() {
  let stylesheet = {
    base: {
      textOverflow: 'ellipsis',
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles to numbers to px', function() {
  let stylesheet = {
    base: {
      width: 10,
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('keeps numbers for unitless properties', function() {
  let stylesheet = {
    base: {
      order: 10,
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('skips empty values', function() {
  let stylesheet = {
    base: {
      color: 'red',
      background: null,
      textAlign: false,
      flex: '',
      flexDirection: undefined,
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('handles arrays', function() {
  let stylesheet = {
    base: {
      color: ['red', 'white'],
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles base w/ variant', function() {
  let stylesheet = {
    base: {
      color: 'red',
    },
    em: {
      color: 'green',
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: 'name-em-2845490580',
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles variant', function() {
  let stylesheet = {
    em: {
      color: 'red',
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`,
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles base w/ pseudo', function() {
  let stylesheet = {
    base: {
      color: 'red',
      hover: {
        color: 'white',
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
  });
  expect(css).toMatchSnapshot();
});

it('compiles base w/ hyphenated pseudo', function() {
  let stylesheet = {
    base: {
      color: 'red',
      firstOfType: {
        color: 'white',
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
  });
  expect(css).toMatchSnapshot();
});

it('compiles pseudo', function() {
  let stylesheet = {
    base: {
      hover: {
        color: 'white',
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
  });
  expect(css).toMatchSnapshot();
});

it('compiles variant pseudo', function() {
  let stylesheet = {
    em: {
      hover: {
        color: 'white',
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`,
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles variant w/ variant pseudo', function() {
  let stylesheet = {
    em: {
      color: 'red',
      hover: {
        color: 'white',
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`,
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles double variant', function() {
  let stylesheet = {
    em_it: {
      color: 'white',
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        then: {
          it: {
            className: `name-em-it-${id}`,
          },
        },
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles double variant w/ pseudo', function() {
  let stylesheet = {
    em_it: {
      hover: {
        color: 'white',
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        then: {
          it: {
            className: `name-em-it-${id}`,
          },
        },
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles double variant w/ separate variants', function() {
  let stylesheet = {
    it: {
      color: 'green',
    },
    em: {
      color: 'red',
    },
    em_it: {
      color: 'white',
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`,
        then: {
          it: {
            className: `name-em-it-${id}`,
          },
        },
      },
      it: {
        className: `name-it-${id}`,
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles double pseudo', function() {
  let stylesheet = {
    base: {
      hover: {
        focus: {
          color: 'red',
        },
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
  });
  expect(css).toMatchSnapshot();
});

it('compiles double pseudo (intermediate)', function() {
  let stylesheet = {
    base: {
      color: 'black',
      hover: {
        color: 'white',
        focus: {
          color: 'red',
        },
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
  });
  expect(css).toMatchSnapshot();
});

it('compiles variant w/ double pseudo (intermediate)', function() {
  let stylesheet = {
    em: {
      color: 'black',
      hover: {
        color: 'white',
        focus: {
          color: 'red',
        },
      },
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`,
      },
    },
  });
  expect(css).toMatchSnapshot();
});

it('compiles padding: {top: 10, left: 20}', function() {
  let stylesheet = {
    base: {
      padding: {top: 10, left: 20},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles padding: {vertical: 10}', function() {
  let stylesheet = {
    base: {
      padding: {vertical: 10},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles padding: {horizontal: 10}', function() {
  let stylesheet = {
    base: {
      padding: {horizontal: 10},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles padding: {vertical: 10, top: 5}', function() {
  let stylesheet = {
    base: {
      padding: {vertical: 10, top: 5},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles margin: {top: 10, left: 20}', function() {
  let stylesheet = {
    base: {
      margin: {top: 10, left: 20},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles border: {width: 1, color: "#aaa"}', function() {
  let stylesheet = {
    base: {
      border: {width: 1, color: '#aaa'},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles borderLeft: {width: 1, color: "#aaa"}', function() {
  let stylesheet = {
    base: {
      borderLeft: {width: 1, color: '#aaa'},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles boxShadow: {x: 10, y: 10, blur: 2}', function() {
  let stylesheet = {
    base: {
      boxShadow: {x: 10, y: 10, blur: 2},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles boxShadow: {inset: true, x: 10, y: 10, blur: 2}', function() {
  let stylesheet = {
    base: {
      boxShadow: {inset: true, x: 10, y: 10, blur: 2},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles boxShadow: [...]', function() {
  let stylesheet = {
    base: {
      boxShadow: [
        {inset: true, x: 10, y: 10, blur: 2},
        {inset: false, x: 10, y: 10, blur: 2},
      ],
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles boxShadow: [string, syntax]', function() {
  let stylesheet = {
    base: {
      boxShadow: [
        'inset 10px 10px 2px 0px #000000',
        {inset: false, x: 10, y: 10, blur: 2},
      ],
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles transition: {property: "margin", duration: 10}', function() {
  let stylesheet = {
    base: {
      transition: {property: 'margin', duration: 10},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles transition: [...]', function() {
  let stylesheet = {
    base: {
      transition: [{property: 'margin', duration: 10}, {property: 'top', duration: 2}],
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles textShadow: {x: 10, y: 10}', function() {
  let stylesheet = {
    base: {
      textShadow: {x: 10, y: 10},
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});
