//@flow

import style from '../style';

test('styles host component with a stylesheet', function() {
  let SC = style('div', {base: {color: 'something'}});
  //$FlowIssue
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  //$FlowIssue
  expect(SC.defaultProps.stylesheet.name).toBe('div');
  //$FlowIssue
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
  //$FlowIssue
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  //$FlowIssue
  expect(SC.defaultProps.stylesheet.name).toBe('custom');
  //$FlowIssue
  expect(SC.displayName).toBe('custom');
  //$FlowIssue
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
  //$FlowIssue
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  //$FlowIssue
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
  //$FlowIssue
  expect(SC2.displayName).toBe('custom');
  //$FlowIssue
  expect(SC2.defaultProps.stylesheet.name).toBe('custom');
  //$FlowIssue
  expect(SC2.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something',
      hover: {
        color: 'red',
      },
    },
  });
});
