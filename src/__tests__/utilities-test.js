/**
 * @copyright 2016-present Prometheus Research, LLC
 */

import React from 'react';
import {
  isComponent,
  isClassComponent,
  isLegacyReactClassComponent,
  isFunctionComponent,
  getComponentDisplayName
} from '../utilities';

describe('utilities', function() {

  it('isComponent', function() {
    assert(isComponent('div'));
    assert(isComponent(function X() {}));
    assert(isComponent(class extends React.Component {}));
  });

  it('isClassComponent', function() {
    assert(!isClassComponent('div'));
    assert(!isClassComponent(function X() {}));
    assert(isClassComponent(class extends React.Component {}));
  });

  it('isLegacyReactClassComponent', function() {
    assert(!isLegacyReactClassComponent('div'));
    assert(!isLegacyReactClassComponent(function X() {}));
    assert(!isLegacyReactClassComponent(class extends React.Component {}));
    assert(isLegacyReactClassComponent(React.createClass({render(){}})));
  });

  it('isFunctionComponent', function() {
    assert(!isFunctionComponent('div'));
    assert(isFunctionComponent(function X() {}));
    assert(!isFunctionComponent(class extends React.Component {}));
  });

  it('getComponentDisplayName', function() {
    assert(getComponentDisplayName('div') === 'div');
    assert(getComponentDisplayName(function() {}) === null);
    assert(getComponentDisplayName(null) === null);
    assert(getComponentDisplayName(class X extends React.Component {} ) === 'X');
    assert(getComponentDisplayName(class X extends React.Component {
      static displayName = 'Y';
    } ) === 'Y');
  });

});
