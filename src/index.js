/**
 * @copyright 2015 Prometheus Research, LLC
 */

import {isValidStylesheet, createStylesheet} from './DOMStylesheet';
import StyleableDOMComponent from './StyleableDOMComponent';
import getComponentDisplayName from './getComponentDisplayName';

export function style(Component, stylesheet, displayName = null) {
  if (displayName == null) {
    displayName = getComponentDisplayName(Component);
    displayName = `StyleableDOMComponent(${displayName})`;
  }
  if (!isValidStylesheet(stylesheet)) {
    stylesheet = createStylesheet(stylesheet, displayName);
  }
  return class extends StyleableDOMComponent {
    static displayName = displayName;
    static Component = Component;
    static stylesheet = stylesheet;
  };
}

export let create = createStylesheet;
export let isStylesheet = isValidStylesheet;

export {StyleableDOMComponent}
