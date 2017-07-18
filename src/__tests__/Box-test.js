/**
 * @flow
 */

import React from 'react';
import renderer from 'react-test-renderer';

import {VBox, HBox} from '../Box';
import * as TestUtils from '../TestUtils';

expect.addSnapshotSerializer(TestUtils.snapshotSerializer);

describe('<HBox />', function() {
  test('render', function() {
    const tree = renderer.create(<HBox>Hello</HBox>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('<BBox />', function() {
  test('render', function() {
    const tree = renderer.create(<VBox>Hello</VBox>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
