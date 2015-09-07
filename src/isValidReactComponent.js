/**
 * @copyright 2015 Prometheus Research, LLC
 */

import isString   from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';

/**
 * Loose check if the argument is a valid React component.
 */
export default function isValidReactComponent(Component) {
  return isString(Component) || isFunction(Component);
}
