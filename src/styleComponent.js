/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant                from 'invariant';
import Style                    from './Style';
import StyleableComponent       from './StyleableComponent';
import isValidReactComponent    from './isValidReactComponent';
import getComponentDisplayName  from './getComponentDisplayName';

/**
 * Create a styled component for a provided component.
 *
 * StyleableComponent component injects styles as a CSS blob and injects `className` prop
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
  return class extends StyleableComponent{
    static displayName = `StyleableComponent(${displayName})`;
    static Component = Component;
    static _style = style;
    static style(style) {
      return styleComponent(Component, style);
    }
  };
}
