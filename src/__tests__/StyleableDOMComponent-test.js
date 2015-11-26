/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React                  from 'react';
import ReactDOM               from 'react-dom';
import TestUtils              from 'react/lib/ReactTestUtils';
import Sinon                  from 'sinon';
import StyleableDOMComponent  from '../StyleableDOMComponent';

describe('StyleableDOMComponent', function() {

  let stylesheet;
  let Component;
  let component;
  let element;

  function mount(props) {
    stylesheet = {
      asClassName: Sinon.stub().returns('class'),
      use: Sinon.spy(),
      dispose: Sinon.spy(),
    };

    Component = class extends StyleableDOMComponent {
      static stylesheet = stylesheet;
      static Component = 'span';
    }

    component = TestUtils.renderIntoDocument(<Component {...props} />);
    element = ReactDOM.findDOMNode(component);
    return element;
  }

  function unmount() {
    if (element.parentNode) {
      ReactDOM.unmountComponentAtNode(element.parentNode);
    }
  }

  it('renders provided Component with the provided stylesheet', function() {
    mount();
    assert(element.classList.contains('class'));
    assert(element.tagName === 'SPAN');
    unmount();
  });

  it('uses and disposes stylesheet', function() {
    mount();
    assert(stylesheet.use.calledOnce);
    assert(!stylesheet.dispose.called);
    unmount();
    assert(stylesheet.use.calledOnce);
    assert(stylesheet.dispose.calledOnce);
    unmount();
  });

  it('allows to override DOM component via props', function() {
    let element = mount({Component: 'div'});
    assert(element.tagName === 'DIV');
    unmount();
  });

  it('allows setting custom className', function() {
    let element = mount({className: 'custom'});
    assert(element.classList.contains('custom'));
    unmount();
  });
});
