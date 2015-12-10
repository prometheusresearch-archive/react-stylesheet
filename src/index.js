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
