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
});
