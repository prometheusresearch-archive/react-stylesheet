/**
 * @copyright 2015, Prometheus Research, LLC
 */

import invariant from 'invariant';
import {
  isComponent,
  isClassComponent,
  isFunctionComponent,
  isHostComponent,
  getComponentDisplayName
} from './utilities';

/**
 * Create stylesheet from stylesheet spec.
 */
export function create(spec, options = {}) {
  let styleComponent = options.style || style;
  let stylesheet = {};
  for (let key in spec) {
    // istanbul ignore next
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    let item = spec[key];
    if (isComponent(item)) {
      stylesheet[key] = item;
    } else {
      let {Component = 'div', ...componentStylesheet} = item;
      Component = styleComponent(
        Component,
        componentStylesheet,
        {...options, displayName: options.displayName || key}
      );
      stylesheet[key] = Component;
    }
  }
  return stylesheet;
}

/**
 * Produce a new stylesheet by overriding keys from the original stylesheet with
 * values from spec.
 *
 * Note that as stylesheet is also a valid spec then this function can be used
 * to override one stylesheet with another.
 */
export function override(stylesheet, spec, options = {}) {
  if (!stylesheet) {
    return create(spec, options);
  }
  let styleComponent = options.style || style;
  stylesheet = {...stylesheet};
  for (let key in spec) {
    // istanbul ignore next
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    invariant(
      stylesheet[key] !== undefined,
      'override(...): invalid override, stylesheet does not have key "%s"',
      key
    );
    let item = spec[key];
    if (isComponent(item)) {
      stylesheet[key] = item;
    } else {
      let {Component = stylesheet[key], ...componentStylesheet} = spec[key];
      stylesheet[key] = styleComponent(Component, componentStylesheet, options);
    }
  }
  return stylesheet;
}

/**
 * Apply a stylesheet to a component.
 */
export function style(Component, stylesheet, options = {}) {
  invariant(
    isComponent(Component),
    'Expected a valid React component, got: %s',
    typeof Component
  );
  let displayName = getComponentDisplayName(Component);
  if (isHostComponent(Component)) {
    invariant(
      options.styleHostComponent,
      'Found host component <%s /> but options.styleHostComponent(..) is not provided',
      displayName
    );
    return options.styleHostComponent(
      Component,
      stylesheet,
      {displayName: options.displayName || displayName}
    );
  } else if (typeof Component.style === 'function') {
    return Component.style(stylesheet, options.displayName || displayName);
  } else if (isClassComponent(Component)) {
    let nextStylesheet = override(
      Component.stylesheet || Component.defaultProps && Component.defaultProps.stylesheet,
      stylesheet,
      options
    );

    return class extends Component {
      static displayName = options.displayName || displayName;
      static defaultProps = {
        ...Component.defaultProps,
        stylesheet: nextStylesheet,
      };
      static stylesheet = nextStylesheet;
      static Component = Component.Component || Component;
    };
  } else if (isFunctionComponent(Component)) {
    let nextStylesheet = override(
      Component.stylesheet || Component.defaultProps && Component.defaultProps.stylesheet,
      stylesheet,
      options
    );

    let StyledComponent = props => Component(props);
    StyledComponent.displayName = options.displayName || displayName;
    StyledComponent.defaultProps = {
      ...StyledComponent.defaultProps,
      stylesheet: nextStylesheet,
    };
    StyledComponent.stylesheet = nextStylesheet;
    StyledComponent.Component = Component.Component || Component;
    return StyledComponent;
  } else {
    // istanbul ignore next
    invariant(
      false,
      'Unable to style component: <%s />',
      getComponentDisplayName(Component)
    );
  }
}
