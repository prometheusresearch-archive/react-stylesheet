/**
 * @flow
 */

const React = require('react');
const renderer = require('react-test-renderer');

import * as Stylesheet from '../Stylesheet';
import * as TestUtil from '../TestUtil';

// $FlowFixMe: ...
expect.addSnapshotSerializer(TestUtil.snapshotSerializer);

const stylesheet = Stylesheet.createStylesheet({
  base: {
    color: 'red',
  },
  some: {
    color: 'black',
  },
});

const stylesheetWithRTL = Stylesheet.createStylesheet({
  base: {
    color: 'red',
  },
  rightToLeft: {
    color: 'black',
  },
});

test('toClassName()', function() {
  expect(Stylesheet.toClassName(stylesheet, {})).toMatchSnapshot();
  expect(Stylesheet.toClassName(stylesheet, {base: true})).toMatchSnapshot();
  expect(Stylesheet.toClassName(stylesheet, {base: false})).toMatchSnapshot();
  expect(Stylesheet.toClassName(stylesheet, {some: true})).toMatchSnapshot();
  expect(Stylesheet.toClassName(stylesheet, {some: false})).toMatchSnapshot();
  expect(Stylesheet.toClassName(stylesheet, {}, {rightToLeft: true})).toMatchSnapshot(
    'Component-<HASH> RTL',
  );
  expect(
    Stylesheet.toClassName(stylesheet, {some: true}, {rightToLeft: true}),
  ).toMatchSnapshot();
  expect(Stylesheet.toClassName(stylesheetWithRTL, {})).toMatchSnapshot();
  expect(
    Stylesheet.toClassName(stylesheetWithRTL, {}, {rightToLeft: true}),
  ).toMatchSnapshot();
  expect(
    Stylesheet.toClassName(stylesheetWithRTL, {rightToLeft: true}, {rightToLeft: true}),
  ).toMatchSnapshot();
  expect(
    Stylesheet.toClassName(stylesheetWithRTL, {rightToLeft: true}),
  ).toMatchSnapshot();
});
