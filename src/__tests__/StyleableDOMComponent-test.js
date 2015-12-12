/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React                  from 'react';
import ReactDOM               from 'react-dom';
import TestUtils              from 'react/lib/ReactTestUtils';
import Sinon                  from 'sinon';
import StyleableDOMComponent  from '../StyleableDOMComponent';

describe('StyleableDOMComponent', function() {

  let defaultStylesheet;
  let Component;
  let component;
  let element;

  function createStylesheet(className = 'class') {
    return {
      asClassName: Sinon.stub().returns(className),
      use: Sinon.spy(),
      dispose: Sinon.spy(),
    };
  }

  function mount(props) {
    defaultStylesheet = createStylesheet('default');

    Component = class extends StyleableDOMComponent {
      static stylesheet = defaultStylesheet;
      static Component = 'span';
    }

    component = TestUtils.renderIntoDocument(<Component {...props} />);
    element = ReactDOM.findDOMNode(component);
    return element;
  }

  function update(props) {
    ReactDOM.render(<Component {...props} />, element.parentNode);
  }

  function unmount() {
    if (element.parentNode) {
      ReactDOM.unmountComponentAtNode(element.parentNode);
    }
  }

  it('renders provided Component with the provided stylesheet', function() {
    mount();
    assert(element.classList.contains('default'));
    assert(element.tagName === 'SPAN');
    unmount();
  });

  it('uses and disposes stylesheet', function() {
    mount();
    assert(element.classList.contains('default'));
    assert(defaultStylesheet.use.calledOnce);
    assert(!defaultStylesheet.dispose.called);
    unmount();
    assert(defaultStylesheet.use.calledOnce);
    assert(defaultStylesheet.dispose.calledOnce);
    unmount();
  });

  it('allows to override DOM component via props', function() {
    let element = mount({Component: 'div'});
    assert(element.tagName === 'DIV');
    unmount();
  });

  it('allows to override stylesheet via props (mount-custom/unmount-custom)', function() {
    let stylesheet = createStylesheet('stylesheet');
    let element = mount({stylesheet});
    assert(!defaultStylesheet.use.calledOnce);
    assert(stylesheet.use.calledOnce);
    assert(!element.classList.contains('default'));
    assert(element.classList.contains('stylesheet'));
    unmount();
    assert(!defaultStylesheet.dispose.calledOnce);
    assert(stylesheet.dispose.calledOnce);
  });

  it('allows to override stylesheet via props (mount/replace/unmount-custom)', function() {
    let stylesheet = createStylesheet('stylesheet');
    let element = mount();
    assert(element.classList.contains('default'));
    assert(defaultStylesheet.use.calledOnce);
    update({stylesheet});
    assert(element.classList.contains('stylesheet'));
    assert(defaultStylesheet.dispose.calledOnce);
    assert(stylesheet.use.calledOnce);
    unmount();
    assert(defaultStylesheet.dispose.calledOnce);
    assert(stylesheet.dispose.calledOnce);
  });

  it('allows to override stylesheet via props (mount-custom/replace/unmount)', function() {
    let stylesheet = createStylesheet('stylesheet');
    let element = mount({stylesheet});
    assert(!element.classList.contains('default'));
    assert(element.classList.contains('stylesheet'));
    assert(!defaultStylesheet.use.calledOnce);
    assert(stylesheet.use.calledOnce);
    update({stylesheet: undefined});
    assert(element.classList.contains('default'));
    assert(!element.classList.contains('stylesheet'));
    assert(stylesheet.dispose.calledOnce);
    assert(defaultStylesheet.use.calledOnce);
    unmount();
    assert(defaultStylesheet.dispose.calledOnce);
    assert(stylesheet.dispose.calledOnce);
  });

  it('allows to override stylesheet via props (mount-custom/replace-custom/unmount-custom)', function() {
    let stylesheet = createStylesheet('stylesheet');
    let stylesheetX = createStylesheet('stylesheetX');
    let element = mount({stylesheet});
    assert(element.classList.contains('stylesheet'));
    assert(stylesheet.use.calledOnce);
    update({stylesheet: stylesheetX});
    assert(element.classList.contains('stylesheetX'));
    assert(!element.classList.contains('stylesheet'));
    assert(stylesheet.dispose.calledOnce);
    assert(stylesheetX.use.calledOnce);
    unmount();
    assert(stylesheetX.dispose.calledOnce);
    assert(stylesheet.dispose.calledOnce);
  });

  it('allows setting custom className', function() {
    let element = mount({className: 'custom'});
    assert(element.classList.contains('default'));
    assert(element.classList.contains('custom'));
    unmount();
  });

  it('allows variants', function() {
    let variant = {};
    let element = mount({variant});
    assert(defaultStylesheet.asClassName.calledOnce);
    assert(defaultStylesheet.asClassName.firstCall.args.length === 1);
    assert(defaultStylesheet.asClassName.firstCall.args[0] === variant);
    unmount();
  });
});
