/**
 * @copyright 2015 Prometheus Research, LLC
 */

/**
 * Loose check if the argument is a valid React component.
 */
export default function isValidReactComponent(Component) {
  let componentType = typeof Component;
  return (
    componentType === 'string' ||
    componentType === 'function'
  );
}
