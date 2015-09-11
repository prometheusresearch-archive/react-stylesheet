/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React                  from 'react';
import TestUtils              from 'react/lib/ReactTestUtils';
import Sinon                  from 'sinon';
import StyleableDOMComponent  from '../StyleableDOMComponent';

describe('StyleableDOMComponent', function() {

  let stylesheet;
  let Component;
  let component;
  let element;

  function mount() {
    stylesheet = {
      asClassName: Sinon.stub().returns('class'),
      use: Sinon.spy(),
      dispose: Sinon.spy(),
    };

    Component = class extends StyleableDOMComponent {
      static stylesheet = stylesheet;
      static Component = 'span';
    }

    component = TestUtils.renderIntoDocument(<Component />);
    element = React.findDOMNode(component);
  }

  function unmount() {
    if (element.parentNode) {
      React.unmountComponentAtNode(element.parentNode);
    }
  }

  beforeEach(mount);
  afterEach(unmount);

  it('renders provided Component with the provided stylesheet', function() {
    assert(element.classList.contains('class'));
    assert(element.tagName === 'SPAN');
  });

  it('uses and disposes stylesheet', function() {
    assert(stylesheet.use.calledOnce);
    assert(!stylesheet.dispose.called);
    unmount();
    assert(stylesheet.use.calledOnce);
    assert(stylesheet.dispose.calledOnce);
  });
});
