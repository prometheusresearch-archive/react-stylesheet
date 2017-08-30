/**
 * @flow
 */

const React = require('react');

import * as Stylesheet from './Stylesheet';

export type StyledComponentProps = {
  Component?: string | React.ComponentType<*>,
  stylesheet?: Stylesheet.Stylesheet,
  variant?: Object,
  className?: string,
};

export type StyledComponentContext = Stylesheet.StylesheetContext;

export default function styleComponent<P: {}>(
  Component: string | React.ComponentType<P>,
  spec: Stylesheet.StylesheetSpec,
): React.ComponentType<P & StyledComponentProps> {
  const stylesheet = Stylesheet.createStylesheet(spec);
  Stylesheet.injectStylesheet(stylesheet);
  const defaultProps = getDefaultProps(Component);
  const StyledComponent = class extends StyledComponentImpl<P> {
    static defaultProps = {
      ...defaultProps,
      Component,
      stylesheet,
      variant: {},
    };
  };
  // Do downcast as Flow can't unify StyledComponentProps with
  // StyledComponentPrivateProps, not a big deal though.
  return (StyledComponent: any);
}

function getDefaultProps<P: {}>(Component: string | React.ComponentType<P>): ?P {
  const defaultProps =
    typeof Component === 'function' && typeof Component.defaultProps === 'object'
      ? Component.defaultProps
      : null;
  return (defaultProps: any);
}

type StyledComponentImplProps = {
  Component: string | React.ComponentType<*>,
  stylesheet: Stylesheet.Stylesheet,
  variant: Object,
  className?: string,
};

class StyledComponentImpl<P: {}> extends React.Component<P & StyledComponentImplProps> {
  context: StyledComponentContext;

  render() {
    const {
      Component,
      stylesheet,
      variant,
      className: extraClassName,
      ...props
    } = this.props;
    let className = Stylesheet.toClassName(stylesheet, variant, {
      rightToLeft: this.context.rightToLeft,
      className: extraClassName,
    });
    return <Component {...props} className={className} />;
  }
}
