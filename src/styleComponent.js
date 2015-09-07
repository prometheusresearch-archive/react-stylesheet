/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant              from 'invariant';
import Style                  from './Style';
import StyledComponent        from './StyledComponent';
import isValidReactComponent  from './isValidReactComponent';

/**
 * Create a styled component for a provided component.
 *
 * Styled component injects styles as a CSS blob and injects `className` prop
 * into underlying component.
 *
 * That means that underlying component must be either a DOM component or a
 * composite component which accepts className prop.
 */
export default function styleComponent(Component, style, styleKey = null) {
  invariant(
    isValidReactComponent(Component),
    'Expected a valid React component, got: %s',
    typeof Component
  );
  if (typeof Component.style === 'function') {
    return Component.style(style);
  }
  let displayName = getComponentDisplayName(Component);
  if (!Style.is(style)) {
    style = Style.create(style, styleKey || displayName);
  }
  return class extends StyledComponent {
    static displayName = `Styled(${displayName})`;
    static Component = Component;
    static style = style;
  };
}

function getComponentDisplayName(Component) {
  return typeof Component === 'string' ?
    Component :
    Component.displayName || Component.name;
}
