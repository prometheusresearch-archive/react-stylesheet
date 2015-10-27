/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React from 'react';
import invariant from 'invariant';
import getComponentDisplayName from './getComponentDisplayName';
import isValidReactComponent from './isValidReactComponent';
import * as Stylesheet from './Stylesheet';

export default function attachStylesheet(Component, spec) {
  if (isValidReactComponent(Component)) {
    return attachStylesheetImpl(Component, spec);
  } else if (spec === undefined) {
    let spec = Component;
    return function attachStylesheetDecorator(Component) {
      return attachStylesheetImpl(Component, spec);
    };
  } else {
    invariant(
      false,
      'Styleable(...): can only be used as a decorator or factory function'
    );
  }
}

function attachStylesheetImpl(Component, spec) {
  return class extends StyleableComponentDecorator {
    static displayName = `Styleable(${getComponentDisplayName(Component)})`;
    static stylesheet = Stylesheet.createStylesheet(spec);
    static Component = Component;
  };
}

class StyleableComponentDecorator extends React.Component {

  static stylesheet = null;

  static Component = null;

  static style(spec) {
    let stylesheet = Stylesheet.overrideStylesheet(this.stylesheet, spec);
    return class extends StyleableComponentDecorator {
      static stylesheet = stylesheet;
      static Component = this.Component;
      static displayName = this.displayName;
    };
  }

  render() {
    let {Component, stylesheet} = this.constructor;
    return <Component stylesheet={stylesheet} {...this.props} />;
  }
}
