/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant from 'invariant';
import * as DOMStylesheet from './DOMStylesheet';
import StyleableDOMComponent from './StyleableDOMComponent';
import isValidReactComponent from './isValidReactComponent';
import getComponentDisplayName from './getComponentDisplayName';

/**
 * Apply a stylesheet to a component.
 */
export default function styleComponent(Component, stylesheet, name = null) {
  invariant(
    isValidReactComponent(Component),
    'Expected a valid React component, got: %s',
    typeof Component
  );
  if (typeof Component.style === 'function') {
    return Component.style(stylesheet);
  } else {
    if (!DOMStylesheet.isValidStylesheet(stylesheet)) {
      name = name || getComponentDisplayName(Component);
      stylesheet = DOMStylesheet.createStylesheet(stylesheet, name);
    }
    return styleDOMComponent(Component, stylesheet);
  }
}

function styleDOMComponent(Component, spec) {
  return class extends StyleableDOMComponent {
    static displayName = `StyleableDOMComponent(${getComponentDisplayName(Component)})`;
    static Component = Component;
    static stylesheet = spec;
  };
}
