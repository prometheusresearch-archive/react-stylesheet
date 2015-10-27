/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant from 'invariant';
import getComponentDisplayName from './getComponentDisplayName';
import * as Stylesheet from './Stylesheet';
import StyleableComponent from './StyleableComponent';
import isValidReactComponent from './isValidReactComponent';

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
  return class extends StyleableComponent {
    static displayName = `Styleable(${getComponentDisplayName(Component)})`;
    static stylesheet = Stylesheet.createStylesheet(spec);
    static Component = Component;
  };
}
