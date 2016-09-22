/**
 * @copyright 2015-present Prometheus Research, LLC
 * @flow
 */

import type {CSSPropertySet} from './CSSType';
import type {Variant} from './Stylesheet';

import React from 'react';

import createStylesheet, {Stylesheet} from './Stylesheet';
import getComponentDisplayName from './getComponentDisplayName';

export type ComponentSpec = {
  displayName?: string;
  [name: string]: CSSPropertySet;
};

export default function style<T: string | ReactClass<*>>(
  Component: T,
  spec: ComponentSpec
): T {

  let {
    displayName,
    ...stylesheetSpec
  } = spec;

  if (displayName == null) {
    displayName = getComponentDisplayName(Component);
  }

  if (
    typeof Component !== 'string' &&
    Component.defaultProps &&
    Component.defaultProps.stylesheet instanceof Stylesheet
  ) {
    let stylesheet = Component.defaultProps.stylesheet.override(
      stylesheetSpec,
      spec.displayName
    );
    return overrideStylesheet(Component, displayName, stylesheet);
  } else {
    let stylesheet = createStylesheet(displayName, stylesheetSpec);
    return injectStylesheet(Component, displayName, stylesheet);
  }

}

export function overrideStylesheet<T: ReactClass<*>>(
  Component: T,
  displayName: string,
  stylesheet: Stylesheet
): T {
  let defaultProps = Component.defaultProps;
  let C = class extends Component {
    static displayName = displayName;
    static defaultProps = {...defaultProps, stylesheet};
  };
  return ((C: any): T);
}

export function injectStylesheet<T: string | ReactClass<*>>(
  Component: T,
  displayName: string,
  stylesheet: Stylesheet
): T {

  let C = class extends ComponentWithStylesheet {
    static displayName = displayName;
    static defaultProps = {
      variant: {},
      Component: Component,
      stylesheet: stylesheet,
    };
  };

  return ((C: any): T);
}

class ComponentWithStylesheet<DP> extends React.Component<DP, *, *> {

  props: {
    stylesheet: Stylesheet;
    variant: Variant;
    Component: string | ReactClass<*>;
    className?: string;
  };

  static defaultProps: $Abstract<DP>;

  render() {
    let {
      variant,
      className: extraClassName,
      Component,
      stylesheet,
      ...props
    } = this.props;

    let className = stylesheet.toClassName(variant);
    if (extraClassName) {
      className = className + ' ' + extraClassName;
    }
    return (
      <Component
        {...props}
        className={className}
        />
    );
  }

  componentWillMount() {
    this.props.stylesheet.inject();
  }

  componentWillUnmount() {
    this.props.stylesheet.dispose();
  }

  componentWillReceiveProps(nextProps: {stylesheet: Stylesheet}) {
    if (nextProps.stylesheet !== this.props.stylesheet) {
      this.props.stylesheet.dispose();
      nextProps.stylesheet.inject();
    }
  }
}
