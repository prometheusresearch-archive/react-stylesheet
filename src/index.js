/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant from 'invariant';
import isValidReactComponent from './isValidReactComponent';

export attachStylesheet from './attachStylesheet';
export styleComponent from './styleComponent';
export {createStylesheet} from './Stylesheet';

export styleable from './styleable';

/**
 * Apply a stylesheet to a component.
 */
export default function style(Component, stylesheet, styleDOMComponent = null) {
  invariant(
    isValidReactComponent(Component),
    'Expected a valid React component, got: %s',
    typeof Component
  );
  if (typeof Component.style === 'function') {
    return Component.style(stylesheet);
  } else if (styleDOMComponent) {
    return styleDOMComponent(Component, stylesheet);
  } else {
    invariant(
      false,
      'Unable to style component'
    );
  }
}
