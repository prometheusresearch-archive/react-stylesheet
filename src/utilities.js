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

export function isClassComponent(obj) {
  return (
    isComponent(obj) &&
    obj.prototype &&
    obj.prototype.isReactComponent
  );
}

export function isFunctionComponent(obj) {
  return (
    isComponent(obj) &&
    !isClassComponent(obj) &&
    typeof obj === 'function'
  );
}

/**
 * Get component display name.
 */
export function getComponentDisplayName(Component) {
  if (typeof Component === 'string') {
    return Component;
  } else if (Component) {
    return Component.displayName || Component.name || null;
  } else {
    return null;
  }
}

