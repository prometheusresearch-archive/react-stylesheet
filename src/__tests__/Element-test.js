/**
 * @flow
 */

const React = require('react');
const renderer = require('react-test-renderer');

import {Element} from '../Element';
import * as TestUtil from '../TestUtil';

// $FlowFixMe: ...
expect.addSnapshotSerializer(TestUtil.snapshotSerializer);

describe('<Element /> inserts styles', function() {
  test('<Element color={...} />', function() {
    const component = renderer.create(<Element color="red" />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element hover={...} />', function() {
    const component = renderer.create(<Element hover={{color: 'red'}} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element color={...} hover={...} />', function() {
    const component = renderer.create(<Element color="black" hover={{color: 'red'}} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element focus={...} hover={...} />', function() {
    const component = renderer.create(
      <Element focus={{color: 'black'}} hover={{color: 'red'}} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element className={...} />', function() {
    const component = renderer.create(<Element className="bootstrap" />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('<Element color="red" className={...} />', function() {
    const component = renderer.create(<Element color="red" className="bootstrap" />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
