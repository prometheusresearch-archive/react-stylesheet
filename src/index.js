/**
 * @copyright 2015 Prometheus Research, LLC
 */

import {isStylesheet, create} from './DOMStylesheet';
import StyleableDOMComponent from './StyleableDOMComponent';
import getComponentDisplayName from './getComponentDisplayName';

export function style(Component, stylesheetSpec, options) {
  if (options == null) {
    options = {};
  } else if (typeof options === 'string') {
    options = {displayName: options};
  }

  let {
    displayName: displayNameFromSpec,
    ...stylesheet
  } = stylesheetSpec;

  options = {
    displayName: displayNameFromSpec,
    ...options
  };

  if (Component.style) {
    return Component.style(stylesheet, options.displayName);
  } else {
    return wrapWithStylesheet(Component, stylesheet, options);
  }
}

/**
 * Produce a new component by applying a stylesheet.
 */
export function wrapWithStylesheet(Component, stylesheet, options) {
  if (options == null) {
    options = {};
  } else if (typeof options === 'string') {
    options = {displayName: options};
  }

  if (!isStylesheet(stylesheet)) {
    let id = options.displayName || getComponentDisplayName(Component);
    stylesheet = create(stylesheet, id);
  }
  return class extends StyleableDOMComponent {
    static displayName = getDisplayName(Component, options.displayName);
    static Component = Component;
    static stylesheet = stylesheet;
  };
}

const STYLED_DISPLAY_NAME_RE = /^Styled\(.+\)$/;

function getDisplayName(Component, displayName) {
  if (displayName != null) {
    return displayName;
  }
  displayName = getComponentDisplayName(Component);
  if (STYLED_DISPLAY_NAME_RE.exec(displayName)) {
    return displayName;
  } else {
    return `Styled(${displayName})`;
  }
}

export {StyleableDOMComponent, isStylesheet, create};
