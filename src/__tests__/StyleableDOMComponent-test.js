/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React                  from 'react';
import TestUtils              from 'react/lib/ReactTestUtils';
import Sinon                  from 'sinon';
import StyleableDOMComponent  from '../StyleableDOMComponent';

describe('StyleableDOMComponent', function() {

  it('renders provided Component with the provided stylesheet', function() {
    let stylesheet = {
      asClassName: Sinon.stub().returns('class'),
      use: Sinon.spy(),
      dispose: Sinon.spy(),
    };

    class Component extends StyleableDOMComponent {
      static stylesheet = stylesheet;
      static Component = 'span';
    }

    let component = TestUtils.renderIntoDocument(<Component />);
    let element = React.findDOMNode(component);

    assert(element.classList.contains('class'));
    assert(element.tagName === 'SPAN');
  });

  it('uses and disposes stylesheet', function() {
    let stylesheet = {
      asClassName: Sinon.stub().returns('class'),
      use: Sinon.spy(),
      dispose: Sinon.spy(),
    };

    class Component extends StyleableDOMComponent {
      static stylesheet = stylesheet;
      static Component = 'span';
    }
    let component = TestUtils.renderIntoDocument(<Component />);
    let element = React.findDOMNode(component);

    assert(stylesheet.use.calledOnce);
    assert(!stylesheet.dispose.called);

    React.unmountComponentAtNode(element.parentNode);

    assert(stylesheet.use.calledOnce);
    assert(stylesheet.dispose.calledOnce);
  });
});
