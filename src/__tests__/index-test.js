/**
 * @flow
 */

import * as ReactStylesheet from '../index';

const stylesheet = ReactStylesheet.createStylesheet({
  base: {
    color: 'red',
  },
  some: {
    color: 'black',
  },
});

const stylesheetWithRTL = ReactStylesheet.createStylesheet({
  base: {
    color: 'red',
  },
  rightToLeft: {
    color: 'black',
  },
});

test('toClassName()', function() {
  expect(ReactStylesheet.toClassName(stylesheet, {})).toBe('Component-<HASH>');
  expect(ReactStylesheet.toClassName(stylesheet, {base: true})).toBe('Component-<HASH>');
  expect(ReactStylesheet.toClassName(stylesheet, {base: false})).toBe('Component-<HASH>');
  expect(ReactStylesheet.toClassName(stylesheet, {some: true})).toBe(
    'Component-<HASH> Component-some-<HASH>',
  );
  expect(ReactStylesheet.toClassName(stylesheet, {some: false})).toBe('Component-<HASH>');
  expect(ReactStylesheet.toClassName(stylesheet, {}, {rightToLeft: true})).toBe(
    'Component-<HASH> RTL',
  );
  expect(ReactStylesheet.toClassName(stylesheet, {some: true}, {rightToLeft: true})).toBe(
    'Component-<HASH> RTL Component-some-<HASH>',
  );
  expect(ReactStylesheet.toClassName(stylesheetWithRTL, {})).toBe('Component-<HASH>');
  expect(ReactStylesheet.toClassName(stylesheetWithRTL, {}, {rightToLeft: true})).toBe(
    'Component-<HASH> RTL Component-rightToLeft-<HASH>',
  );
  expect(
    ReactStylesheet.toClassName(
      stylesheetWithRTL,
      {rightToLeft: true},
      {rightToLeft: true},
    ),
  ).toBe('Component-<HASH> RTL Component-rightToLeft-<HASH>');
  expect(ReactStylesheet.toClassName(stylesheetWithRTL, {rightToLeft: true})).toBe(
    'Component-<HASH> Component-rightToLeft-<HASH>',
  );
});

beforeEach(function() {
  ReactStylesheet.staticEnvironment.dispose();
});

afterEach(function() {
  ReactStylesheet.staticEnvironment.dispose();
});

test('styleComponent() inserts a stylesheet into DOM', function() {
  const FancyDiv = ReactStylesheet.styleComponent('div', {
    base: {
      color: 'red',
    },
  });
  expect(ReactStylesheet.staticEnvironment.sheet.cssRules.length).toBe(1);
});
