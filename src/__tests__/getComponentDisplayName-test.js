/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert                   from 'power-assert';
import React                    from 'react';
import getComponentDisplayName  from '../getComponentDisplayName';

describe('getComponentDisplayName', function() {

  it('uses name of the DOM component as a display name', function() {
    assert(getComponentDisplayName('button') === 'button');
  });

  it('displayName for classic React components', function() {
    let MyComponent = React.createClass({
      render() { return null; }
    });
    assert(getComponentDisplayName(MyComponent) === 'MyComponent');
  });

  it('name for ES6 classes', function() {
    class MyComponent extends React.Component {

      render() { return null; }
    }
    assert(getComponentDisplayName(MyComponent) === 'MyComponent');
  });

  it('displayName for ES6 classes', function() {
    class MyComponent extends React.Component {

      static displayName = 'Fancy!';

      render() { return null; }
    }
    assert(getComponentDisplayName(MyComponent) === 'Fancy!');
  });

});
