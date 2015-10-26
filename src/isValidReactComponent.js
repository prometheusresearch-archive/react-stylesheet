/**
 * @copyright 2015 Prometheus Research, LLC
 */

import {isString, isFunction} from './Utils';

/**
 * Loose check if the argument is a valid React component.
 */
export default function isValidReactComponent(Component) {
  return isString(Component) || isFunction(Component);
}
