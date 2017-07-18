import React from 'react';
import renderer from 'react-test-renderer';

import * as TestUtils from '../TestUtils';
import style from '../style';

expect.addSnapshotSerializer(TestUtils.snapshotSerializer);

test('render', function() {
  let SC = style('div', {
    base: {color: 'red'},
  });
  const tree = renderer.create(<SC>Hello</SC>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('render w/ variant (inactive)', function() {
  let SC = style('div', {
    base: {color: 'red'},
    em: {fontWeight: 'bold'},
  });
  const tree = renderer.create(<SC>Hello</SC>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('render w/ variant (active)', function() {
  let SC = style('div', {
    base: {color: 'red'},
    em: {fontWeight: 'bold'},
  });
  const tree = renderer.create(<SC variant={{em: true}}>Hello</SC>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('styles host component with a stylesheet', function() {
  let SC = style('div', {base: {color: 'something'}});
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  expect(SC.defaultProps.stylesheet.name).toBe('div');
  expect(SC.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something',
    },
  });
});

test('sets the displayName', function() {
  let SC = style('div', {
    displayName: 'custom',
    base: {
      color: 'something',
    },
  });
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  expect(SC.defaultProps.stylesheet.name).toBe('custom');
  expect(SC.displayName).toBe('custom');
  expect(SC.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something',
    },
  });
});

test('styles composite component with a stylesheet', function() {
  function C(props) {
    return <div />;
  }
  let SC = style(C, {base: {color: 'something'}});
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  expect(SC.defaultProps.stylesheet.name).toBe('C');
  expect(SC.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something',
    },
  });
});

test('overrides stylesheet of an already styled component', function() {
  let SC = style('div', {base: {color: 'something'}});
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  expect(SC.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something',
    },
  });
  let SC2 = style('div', {
    displayName: 'custom',
    base: {
      color: 'something',
      hover: {
        color: 'red',
      },
    },
  });
  expect(SC2.displayName).toBe('custom');
  expect(SC2.defaultProps.stylesheet.name).toBe('custom');
  expect(SC2.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something',
      hover: {
        color: 'red',
      },
    },
  });
});
