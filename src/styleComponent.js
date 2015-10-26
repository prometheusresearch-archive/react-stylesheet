/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant from 'invariant';
import Style from './Style';
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
    if (!Style.is(stylesheet)) {
      stylesheet = Style.create(stylesheet, name || getComponentDisplayName(Component));
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
