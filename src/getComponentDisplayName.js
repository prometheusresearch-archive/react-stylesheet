/**
 * @copyright 2015-present Prometheus Research, LLC
 * @flow
 */

export default function getComponentDisplayName(Component: Function | string): string {
  return typeof Component === 'string'
    ? Component
    : Component.displayName || Component.name || 'Component';
}
