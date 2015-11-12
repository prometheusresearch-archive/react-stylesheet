/**
 * @copyright 2015, Prometheus Research, LLC
 */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
let FUNCTION_STATIC_PROPERTIES = {
  'arguments': true,
  'arity': true,
  'caller': true,
  'length': true,
  'name': true,
  'displayName': true,
  'prototype': true,
};

/**
 * Transfer all static properties and methods from `source` to `target`.
 */
export default function transferStaticProperties(source, target, ignoreKeys = null) {
  let keys = Object.getOwnPropertyNames(source);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (!source.hasOwnProperty(key)) {
      continue;
    }
    if (FUNCTION_STATIC_PROPERTIES[key]) {
      continue;
    }
    if (ignoreKeys && ignoreKeys.indexOf(key) > -1) {
      continue;
    }
    target[key] = source[key];
  }
}
