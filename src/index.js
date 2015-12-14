/**
 * @copyright 2015 Prometheus Research, LLC
 */

import * as DOMStylesheet from './DOMStylesheet';
import StyleableDOMComponent from './StyleableDOMComponent';
import getComponentDisplayName from './getComponentDisplayName';

export function style(Component, stylesheet, displayName = null) {
  if (displayName == null) {
    displayName = getComponentDisplayName(Component);
    displayName = `StyleableDOMComponent(${displayName})`;
  }
  if (!DOMStylesheet.isValidStylesheet(stylesheet)) {
    stylesheet = DOMStylesheet.createStylesheet(stylesheet, displayName);
  }
  return class extends StyleableDOMComponent {
    static displayName = displayName;
    static Component = Component;
    static stylesheet = stylesheet;
  };
}

export function create(obj) {
  let stylesheet = {};
  for (let key in obj) {
    if (!obj.hasOwnPropertyName(key)) {
      continue;
    }
    let {Component = 'div', displayName = null, ...style} = obj[key];
    stylesheet[key] = style(Component, style, displayName);
  }
  return stylesheet;
}

export StyleableDOMComponent;
