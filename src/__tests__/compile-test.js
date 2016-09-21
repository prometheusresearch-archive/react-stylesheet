import compile from '../compile';

it('compiles base', function() {
  let stylesheet = {
    base: {
      color: 'red'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(917847219);
  expect(mapping).toEqual({
    className: 'name-917847219'
  });
  expect(css).toMatchSnapshot();
});

it('compiles base w/ variant', function() {
  let stylesheet = {
    base: {
      color: 'red'
    },
    em: {
      color: 'green'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(2845490580);
  expect(mapping).toEqual({
    className: 'name-2845490580',
    then: {
      em: {
        className: 'name-em-2845490580'
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles variant', function() {
  let stylesheet = {
    em: {
      color: 'red'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(2439838490);
  expect(mapping).toEqual({
    then: {
      em: {
        className: 'name-em-2439838490'
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles base w/ pseudo', function() {
  let stylesheet = {
    base: {
      color: 'red'
    },
    hover: {
      color: 'white'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(3118789586);
  expect(mapping).toEqual({
    className: 'name-3118789586'
  });
  expect(css).toMatchSnapshot();
});

it('compiles pseudo', function() {
  let stylesheet = {
    hover: {
      color: 'white'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(3193474632);
  expect(mapping).toEqual({
    className: 'name-3193474632'
  });
  expect(css).toMatchSnapshot();
});


it('compiles variant pseudo', function() {
  let stylesheet = {
    em_hover: {
      color: 'white'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(2945197973);
  expect(mapping).toEqual({
    then: {
      em: {
        className: 'name-em-2945197973'
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles variant w/ variant pseudo', function() {
  let stylesheet = {
    em: {
      color: 'red'
    },
    em_hover: {
      color: 'white'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(767874055);
  expect(mapping).toEqual({
    then: {
      em: {
        className: 'name-em-767874055'
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles double variant', function() {
  let stylesheet = {
    em_it: {
      color: 'white'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(88266418);
  expect(mapping).toEqual({
    then: {
      em: {
        then: {
          it: {
            className: 'name-em-it-88266418'
          }
        }
      }
    }
  });
  expect(css).toMatchSnapshot();
});


it('compiles double variant w/ pseudo', function() {
  let stylesheet = {
    em_it_hover: {
      color: 'white'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(88266418);
  expect(mapping).toEqual({
    then: {
      em: {
        then: {
          it: {
            className: 'name-em-it-88266418'
          }
        }
      }
    }
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
      color: 'white'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(id).toEqual(3975713384);
  expect(mapping).toEqual({
    then: {
      em: {
        className: 'name-em-3975713384',
        then: {
          it: {
            className: 'name-em-it-3975713384'
          }
        }
      },
      it: {
        className: 'name-it-3975713384',
      }
    }
  });
  expect(css).toMatchSnapshot();
});
