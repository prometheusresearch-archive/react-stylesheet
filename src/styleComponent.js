/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant from 'invariant';
import isValidReactComponent from './isValidReactComponent';
import getComponentDisplayName from './getComponentDisplayName';
import * as Stylesheet from './Stylesheet';

/**
 * Apply a stylesheet to a component.
 */
export default function styleComponent(Component, stylesheet, options) {
  invariant(
    isValidReactComponent(Component),
    'Expected a valid React component, got: %s',
    typeof Component
  );
  if (typeof Component.style === 'function') {
    return Component.style(stylesheet);
  } else if (Component.stylesheet) {
    let displayName = options.displayName || getComponentDisplayName(Component);
    return class extends Component {
      static displayName = displayName;
      static stylesheet = Stylesheet.override(Component.stylesheet, stylesheet, options);
    }
  } else {
    invariant(
      false,
      'Unable to style component: <%s />',
      getComponentDisplayName(Component)
    );
  }
}

