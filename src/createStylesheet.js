/**
 * @copyright 2015 Prometheus Research, LLC
 */

import isValidReactComponent  from './isValidReactComponent';
import Style                  from './Style';
import styleComponent         from './styleComponent';

/**
 * Create styled components from specs.
 */
export default function createStylesheet(specs, name = null) {
  let stylesheet = {};

  for (let key in specs) {
    if (!specs.hasOwnProperty(key)) {
      continue;
    }
    let spec = specs[key];

    // 'default' key has styles for every component in the spec, skip it
    if (key === 'default') {
      continue;
    }

    // if `spec` is already a valid React component then we just return it as is
    if (isValidReactComponent(spec)) {
      stylesheet[key] = spec;
    } else {
      let {Component = 'div', ...style} = spec;
      if (typeof Component.style === 'function') {
        Component = Component.style(style);
      } else {
        if (!Style.is(style)) {
          style = Style.create(style, name ? `${name}__${key}` : key);
        }
        Component = styleComponent(Component, style, key);
      }
      stylesheet[key] = Component;
    }
  }

  return stylesheet;
}
