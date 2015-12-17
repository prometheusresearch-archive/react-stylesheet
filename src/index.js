/**
 * @copyright 2015, Prometheus Research, LLC
 */

import invariant from 'invariant';
import {
  isNativeComponent,
  isComponent,
  getComponentDisplayName
} from './utilities';

/**
 * Create stylesheet from stylesheet spec.
 */
export function create(spec, options = {}) {
  let styleComponent = options.style || style;
  let stylesheet = {};
  for (let key in spec) {
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    let item = spec[key];
    if (isComponent(item)) {
      stylesheet[key] = item;
    } else {
      let {Component = 'div', ...componentStylesheet} = item;
      Component = styleComponent(Component, componentStylesheet, options);
      stylesheet[key] = Component;
    }
  }
  return stylesheet;
}

/**
 * Produce a new stylesheet by overriding keys from the original stylesheet with
 * values from spec.
 *
 * Note that as stylesheet is also a valid spec then this function can be used
 * to override one stylesheet with another.
 */
export function override(stylesheet, spec, options = {}) {
  let styleComponent = options.style || style;
  stylesheet = {...stylesheet};
  for (let key in spec) {
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    invariant(
      stylesheet[key] !== undefined,
      'override(...): invalid override, stylesheet does not have key "%s"',
      key
    );
    let item = spec[key];
    if (isComponent(item)) {
      stylesheet[key] = item;
    } else {
      let {Component = stylesheet[key], ...componentStylesheet} = spec[key];
      stylesheet[key] = styleComponent(Component, componentStylesheet, options);
    }
  }
  return stylesheet;
}

/**
 * Apply a stylesheet to a component.
 */
export function style(Component, stylesheet, options = {}) {
  invariant(
    isComponent(Component),
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
  } else if (isNativeComponent(Component) && options.styleDOM) {
    return options.styleDOM(Component, stylesheet);
  } else {
    invariant(
      false,
      'Unable to style component: <%s />',
      getComponentDisplayName(Component)
    );
  }
}
