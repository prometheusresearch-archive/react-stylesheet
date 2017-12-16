/**
 * @flow
 */

import * as React from 'react';
import renderer from 'react-test-renderer';

import Element from '../Element';
import * as TestUtils from '../TestUtils';

// $ExpectError: ...
expect.addSnapshotSerializer(TestUtils.snapshotSerializer);

describe('<Element />', function() {
  test('render color="red"', function() {
    const tree = renderer.create(<Element color="red">Hello</Element>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('render position="fixed"', function() {
    const tree = renderer.create(<Element position="fixed">Hello</Element>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('render colorOnHover="red"', function() {
    const tree = renderer.create(<Element colorOnHover="red">Hello</Element>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
