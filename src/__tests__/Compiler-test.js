/**
 * @flow
 */

import * as Compiler from '../compiler';

test('compileValue()', function() {
  expect(Compiler.compileValue('width', 1)).toBe('1px');
  expect(Compiler.compileValue('flex', 1)).toBe('1');
});

test('compileName()', function() {
  expect(Compiler.compileName('width')).toBe('width');
  expect(Compiler.compileName('flex')).toBe('flex');
  expect(Compiler.compileName('borderLeft')).toBe('border-left');
  expect(Compiler.compileName('border-left')).toBe('border-left');
});

test('compile() variants', function() {
  expect(
    Compiler.compile({
      base: {
        color: 'red',
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      something: {
        color: 'red',
      },
    }),
  ).toMatchSnapshot();
});

test('compile() w/ pseudoclasses', function() {
  expect(
    Compiler.compile({
      base: {
        color: 'red',
        hover: {
          color: 'black',
        },
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        color: 'red',
        hover: {
          color: 'black',
          focus: {
            color: 'yellow',
          },
        },
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      something: {
        color: 'red',
        hover: {
          color: 'black',
        },
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        color: 'red',
        firstChild: {
          color: 'black',
        },
      },
    }),
  ).toMatchSnapshot();
});

test('compile() paddingStart/paddingEnd', function() {
  expect(
    Compiler.compile({
      base: {
        paddingStart: 12,
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        paddingEnd: 12,
      },
    }),
  ).toMatchSnapshot();
});

test('compile() paddingVertical/paddingHorizontal', function() {
  expect(
    Compiler.compile({
      base: {
        paddingVertical: 12,
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        paddingHorizontal: 12,
      },
    }),
  ).toMatchSnapshot();
});

test('compile() marginStart/marginEnd', function() {
  expect(
    Compiler.compile({
      base: {
        marginStart: 12,
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        marginEnd: 12,
      },
    }),
  ).toMatchSnapshot();
});

test('compile() marginVertical/marginHorizontal', function() {
  expect(
    Compiler.compile({
      base: {
        marginVertical: 12,
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        marginHorizontal: 12,
      },
    }),
  ).toMatchSnapshot();
});

test('compile() startOffset/endOffset', function() {
  expect(
    Compiler.compile({
      base: {
        startOffset: 12,
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        endOffset: 12,
      },
    }),
  ).toMatchSnapshot();
});

test('compile() empty values', function() {
  expect(
    Compiler.compile({
      base: {
        color: null,
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        color: undefined,
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        color: ('': any),
      },
    }),
  ).toMatchSnapshot();
  expect(
    Compiler.compile({
      base: {
        color: (false: any),
      },
    }),
  ).toMatchSnapshot();
});

test('compile() empty rulesets', function() {
  expect(
    Compiler.compile({
      base: {},
    }),
  ).toMatchSnapshot();
});

test('compile() w/ custom displayName', function() {
  expect(
    Compiler.compile({
      displayName: 'Fancy',
      base: {color: 'red'},
      some: {color: 'yellow'},
    }),
  ).toMatchSnapshot();
});
