/**
 * @copyright 2015 Prometheus Research, LLC
 */

import {isStylesheet, create} from './DOMStylesheet';
import StyleableDOMComponent from './StyleableDOMComponent';
import getComponentDisplayName from './getComponentDisplayName';

export function style(Component, stylesheet, displayName = null) {
  if (Component.style) {
    return Component.style(stylesheet, displayName);
  }
  if (displayName == null) {
    displayName = getComponentDisplayName(Component);
    displayName = `StyleableDOMComponent(${displayName})`;
  }
  if (!isStylesheet(stylesheet)) {
    stylesheet = create(stylesheet, displayName);
  }
  return class extends StyleableDOMComponent {
    static displayName = displayName;
    static Component = Component;
    static stylesheet = stylesheet;
  };
}

export {StyleableDOMComponent, isStylesheet, create}
