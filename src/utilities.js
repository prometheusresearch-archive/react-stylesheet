/**
 * @copyright 2015, Prometheus Research, LLC
 */

/**
 * Loose check if the argument is a valid React component.
 */
export function isComponent(obj) {
  let typeofObj = typeof obj;
  return typeofObj === 'string' || typeofObj === 'function';
}

/**
 * Check if the argument is a host React component.
 */
export function isHostComponent(obj) {
  let typeofObj = typeof obj;
  return typeofObj === 'string';
}

/**
 * Get component display name.
 */
export function getComponentDisplayName(Component) {
  if (typeof Component === 'string') {
    return Component;
  } else if (Component) {
    return Component.displayName || Component.name;
  } else {
    return null;
  }
}

