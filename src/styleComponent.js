/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant from 'invariant';
import isValidReactComponent from './isValidReactComponent';
import getComponentDisplayName from './getComponentDisplayName';
import {override} from './Stylesheet';
import {isString} from './Utils';

/**
 * Apply a stylesheet to a component.
 */
export default function styleComponent(Component, stylesheet, options = {}) {
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
      static stylesheet = override(Component.stylesheet, stylesheet, options);
    };
  } else if (isString(Component) && options.styleDOM) {
    return options.styleDOM(Component, stylesheet);
  } else {
    invariant(
      false,
      'Unable to style component: <%s />',
      getComponentDisplayName(Component)
    );
  }
}

