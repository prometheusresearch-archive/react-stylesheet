/**
 * @flow
 */

import type {CSSPropertySet} from './CSSType';
import type {Variant} from './Stylesheet';

import React from 'react';

import Stylesheet from './Stylesheet';
import getComponentDisplayName from './getComponentDisplayName';

export type ComponentSpec = {
  displayName?: string;
  [name: string]: CSSPropertySet;
};

export default function style<T: string | ReactClass<*>>(
  ComponentDefault: T,
  spec: ComponentSpec
): T {

  let {
    displayName,
    ...stylesheetSpec
  } = spec;

  if (displayName == null) {
    displayName = getComponentDisplayName(ComponentDefault);
  }

  let stylesheet = new Stylesheet(displayName, stylesheetSpec);

  let StylesheetComponent = class extends React.Component {

    props: {
      variant?: Variant;
      Component?: T;
      className?: string;
    };

    render() {
      let {
        variant,
        className: extraClassName,
        Component = ComponentDefault,
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
      stylesheet.inject();
    }

    componentWillUnmount() {
      stylesheet.dispose();
    }
  };

  return ((StylesheetComponent: any): T);
}
