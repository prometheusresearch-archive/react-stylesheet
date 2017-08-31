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
  Stylesheet.stylesheetEnvironment.disposeAll();
});

afterEach(function() {
  Stylesheet.stylesheetEnvironment.disposeAll();
});

test('styleComponent() inserts a stylesheet into DOM', function() {
  const FancyDiv = styleComponent('div', {
    base: {
      color: 'red',
    },
  });
  // $FlowFixMe: ...
  expect(Stylesheet.stylesheetEnvironment.staticRecord.manager.rules.length).toBe(1);
});
