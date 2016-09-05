/**
 * @copyright 2015 Prometheus Research, LLC
 */

export default function getComponentDisplayName(Component) {
  return typeof Component === 'string' ?
    Component :
    Component.displayName || Component.name || 'Component';
}

