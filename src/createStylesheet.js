/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React, {PropTypes}     from 'react';
import map                    from 'lodash/collection/map';
import zipObject              from 'lodash/array/zipObject';
import isValidReactComponent  from './isValidReactComponent';
import Style                  from './Style';
import styleComponent         from './styleComponent';

/**
 * Create styled components from specs.
 */
export default function createStylesheet(specs, name = null) {
  let components = map(specs, (spec, key) => {
    // 'default' key has styles for every component in the spec, skip it
    if (key === 'default') {
      return null;
    }
    // if `spec` is already a valid React component then we just return it as is
    if (isValidReactComponent(spec)) {
      return [key, spec];
    }
    let {Component = 'div', ...style} = spec;
    if (!Style.is(style)) {
      style = Style.create(style, name ? `${name}__${key}` : key);
    }
    return [key, styleComponent(Component, style, key)];
  });
  return zipObject(components.filter(Boolean));
}
