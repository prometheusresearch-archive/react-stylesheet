/**
 * @copyright 2015, Prometheus Research, LLC
 */

import invariant from 'invariant';
import isValidReactComponent from './isValidReactComponent';
import styleComponent from './styleComponent';

/**
 * Create stylesheet from stylesheet spec.
 */
export function createStylesheet(spec) {
  let stylesheet = {};
  for (let key in spec) {
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    let item = spec[key];
    if (isValidReactComponent(item)) {
      stylesheet[key] = item;
    } else {
      let {Component = 'div', ...componentStylesheet} = item;
      Component = styleComponent(Component, componentStylesheet);
      stylesheet[key] = Component;
    }
  }
  return stylesheet;
}

/**
 * Check if object is a valid stylesheet.
 *
 * Object is a stylesheet if every value is a valid React component.
 */
export function isValidStylesheet(obj) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    if (!isValidReactComponent(obj[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Produce a new stylesheet by overriding keys from the original stylesheet with
 * values from spec.
 *
 * Note that as stylesheet is also a valid spec then this function can be used
 * to override one stylesheet with another.
 */
export function overrideStylesheet(stylesheet, spec) {
  invariant(
    isValidStylesheet(stylesheet),
    'overrideStylesheet(...): first argument should be a valid stylesheet'
  );
  stylesheet = {...stylesheet};
  for (let key in spec) {
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    invariant(
      stylesheet[key] !== undefined,
      'overrideStylesheet(...): invalid override, stylesheet does not have key "%s"',
      key
    );
    let item = spec[key];
    if (isValidReactComponent(item)) {
      stylesheet[key] = item;
    } else {
      let {Component = stylesheet[key], ...componentStylesheet} = spec[key];
      stylesheet[key] = styleComponent(Component, componentStylesheet);
    }
  }
  return stylesheet;
}
