/**
 * @flow
 */

const React = require('react');
const renderer = require('react-test-renderer');

import * as Stylesheet from '../Stylesheet';
import styleComponent from '../styleComponent';
import * as TestUtil from '../TestUtil';

// $FlowFixMe: ...
expect.addSnapshotSerializer(TestUtil.snapshotSerializer);

beforeEach(function() {
  Stylesheet.staticStyles.dispose();
});

afterEach(function() {
  Stylesheet.staticStyles.dispose();
});

test('styleComponent() inserts a stylesheet into DOM', function() {
  const FancyDiv = styleComponent('div', {
    base: {
      color: 'red',
    },
  });
  expect(Stylesheet.staticStyles.rules.length).toBe(1);
});
