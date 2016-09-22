import style from '../style';

test('styles host component with a stylesheet', function() {
  let SC = style('div', {base: {color: 'something'}});
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  expect(SC.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something'
    }
  });
});

test('styles composite component with a stylesheet', function() {
  let C = (props) => <div />;
  let SC = style(C, {base: {color: 'something'}});
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  expect(SC.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something'
    }
  });
});

test('overrides stylesheet of an already styled component', function() {
  let SC = style('div', {base: {color: 'something'}});
  expect(SC.defaultProps.stylesheet).toBeTruthy();
  expect(SC.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something'
    }
  });
  let SC2 = style('div', {base: {color: 'something', hover: {color: 'red'}}});
  expect(SC2.defaultProps.stylesheet.spec).toEqual({
    base: {
      color: 'something',
      hover: {
        color: 'red'
      }
    }
  });
});
