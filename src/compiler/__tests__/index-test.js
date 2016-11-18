import compile from '../index';

it('compiles base', function() {
  let stylesheet = {
    base: {
      color: 'red'
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`
  });
  expect(css).toMatchSnapshot();
});

it('compiles to hyphenated name', function() {
  let stylesheet = {
    base: {
      textOverflow: 'ellipsis'
    }
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles to numbers to px', function() {
  let stylesheet = {
    base: {
      width: 10
    }
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('keeps numbers for unitless properties', function() {
  let stylesheet = {
    base: {
      order: 10
    }
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
    }
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('handles arrays', function() {
  let stylesheet = {
    base: {
      color: ['red', 'white'],
    }
  };
  let {css} = compile('name', stylesheet);
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
  expect(mapping).toEqual({
    className: `name-${id}`,
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
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles base w/ pseudo', function() {
  let stylesheet = {
    base: {
      color: 'red',
      hover: {
        color: 'white'
      }
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`
  });
  expect(css).toMatchSnapshot();
});

it('compiles base w/ hyphenated pseudo', function() {
  let stylesheet = {
    base: {
      color: 'red',
      firstOfType: {
        color: 'white'
      }
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`
  });
  expect(css).toMatchSnapshot();
});

it('compiles pseudo', function() {
  let stylesheet = {
    base: {
      hover: {
        color: 'white'
      }
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`
  });
  expect(css).toMatchSnapshot();
});


it('compiles variant pseudo', function() {
  let stylesheet = {
    em: {
      hover: {
        color: 'white'
      }
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles variant w/ variant pseudo', function() {
  let stylesheet = {
    em: {
      color: 'red',
      hover: {
        color: 'white'
      }
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`
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
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        then: {
          it: {
            className: `name-em-it-${id}`
          }
        }
      }
    }
  });
  expect(css).toMatchSnapshot();
});


it('compiles double variant w/ pseudo', function() {
  let stylesheet = {
    em_it: {
      hover: {
        color: 'white'
      }
    }
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        then: {
          it: {
            className: `name-em-it-${id}`
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
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`,
        then: {
          it: {
            className: `name-em-it-${id}`
          }
        }
      },
      it: {
        className: `name-it-${id}`,
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles double pseudo', function() {
  let stylesheet = {
    base: {
      hover: {
        focus: {
          color: 'red'
        }
      }
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
          color: 'red'
        }
      }
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
          color: 'red'
        }
      }
    },
  };
  let {id, css, mapping} = compile('name', stylesheet);
  expect(mapping).toEqual({
    className: `name-${id}`,
    then: {
      em: {
        className: `name-em-${id}`,
      }
    }
  });
  expect(css).toMatchSnapshot();
});

it('compiles paddingH', function() {
  let stylesheet = {
    base: {
      paddingH: 10
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles paddingV', function() {
  let stylesheet = {
    base: {
      paddingV: 10
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles marginH', function() {
  let stylesheet = {
    base: {
      marginH: 10
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});

it('compiles marginV', function() {
  let stylesheet = {
    base: {
      marginV: 10
    },
  };
  let {css} = compile('name', stylesheet);
  expect(css).toMatchSnapshot();
});
