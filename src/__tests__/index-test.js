/**
 * @flow
 */

const React = require('react');
const renderer = require('react-test-renderer');

import * as ReactStylesheet from '../index';
import * as TestUtil from '../TestUtil';

// $FlowFixMe: ...
expect.addSnapshotSerializer(TestUtil.snapshotSerializer);

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
  expect(ReactStylesheet.toClassName(stylesheet, {})).toMatchSnapshot();
  expect(ReactStylesheet.toClassName(stylesheet, {base: true})).toMatchSnapshot();
  expect(ReactStylesheet.toClassName(stylesheet, {base: false})).toMatchSnapshot();
  expect(ReactStylesheet.toClassName(stylesheet, {some: true})).toMatchSnapshot();
  expect(ReactStylesheet.toClassName(stylesheet, {some: false})).toMatchSnapshot();
  expect(
    ReactStylesheet.toClassName(stylesheet, {}, {rightToLeft: true}),
  ).toMatchSnapshot('Component-<HASH> RTL');
  expect(
    ReactStylesheet.toClassName(stylesheet, {some: true}, {rightToLeft: true}),
  ).toMatchSnapshot();
  expect(ReactStylesheet.toClassName(stylesheetWithRTL, {})).toMatchSnapshot();
  expect(
    ReactStylesheet.toClassName(stylesheetWithRTL, {}, {rightToLeft: true}),
  ).toMatchSnapshot();
  expect(
    ReactStylesheet.toClassName(
      stylesheetWithRTL,
      {rightToLeft: true},
      {rightToLeft: true},
    ),
  ).toMatchSnapshot();
  expect(
    ReactStylesheet.toClassName(stylesheetWithRTL, {rightToLeft: true}),
  ).toMatchSnapshot();
});

beforeEach(function() {
  ReactStylesheet.staticStyles.dispose();
});

afterEach(function() {
  ReactStylesheet.staticStyles.dispose();
});

test('styleComponent() inserts a stylesheet into DOM', function() {
  const FancyDiv = ReactStylesheet.styleComponent('div', {
    base: {
      color: 'red',
    },
  });
  expect(ReactStylesheet.staticStyles.rules.length).toBe(1);
});

describe('<Element /> inserts styles', function() {
  test('<Element color={...} />', function() {
    const component = renderer.create(<ReactStylesheet.Element color="red" />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element hover={...} />', function() {
    const component = renderer.create(<ReactStylesheet.Element hover={{color: 'red'}} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element color={...} hover={...} />', function() {
    const component = renderer.create(
      <ReactStylesheet.Element color="black" hover={{color: 'red'}} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element focus={...} hover={...} />', function() {
    const component = renderer.create(
      <ReactStylesheet.Element focus={{color: 'black'}} hover={{color: 'red'}} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element className={...} />', function() {
    const component = renderer.create(<ReactStylesheet.Element className="bootstrap" />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element color="red" className={...} />', function() {
    const component = renderer.create(
      <ReactStylesheet.Element color="red" className="bootstrap" />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
