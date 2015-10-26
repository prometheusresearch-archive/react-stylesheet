/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant from 'invariant';
import getComponentDisplayName from './getComponentDisplayName';
import * as Stylesheet from './Stylesheet';
import StyleableComponent from './StyleableComponent';
import isValidReactComponent from './isValidReactComponent';

export default function defineStylesheet(Component, spec) {
  if (isValidReactComponent(Component)) {
    return defineStylesheetImpl(Component, spec);
  } else if (spec === undefined) {
    let spec = Component;
    return function defineStylesheetDecorator(Component) {
      return defineStylesheetImpl(Component, spec);
    };
  } else {
    invariant(
      false,
      'Styleable(...): can only be used as a decorator or factory function'
    );
  }
}

function defineStylesheetImpl(Component, spec) {
  return class extends StyleableComponent {
    static displayName = `Styleable(${getComponentDisplayName(Component)})`;
    static stylesheet = Stylesheet.createStylesheet(spec);
    static Component = Component;
  };
}
