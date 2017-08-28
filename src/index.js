/**
 * @flow
 */

import invariant from 'invariant';
import * as React from 'react';

import * as CSS from './css';
import * as Compiler from './compiler';
import * as Environment from './environment';
import CSSPseudoClassSet from './CSSPseudoClassSet';
import CSSPropertySet from './CSSPropertySet';
import {CSSClassJoin, CSSClass} from './StyleRepresentation';

/**
 * This is how you define your stylesheet.
 */
export type StylesheetSpec = {
  displayName?: string,
  [key: string]: CSS.CSSStylesheet,
};

/**
 * This is the opaque type which represents the compiled stylesheet.
 */
export opaque type Stylesheet = Compiler.CompiledStylesheet;

/**
 * The context for stylesheet.
 */
export type StylesheetContext = {
  rightToLeft: boolean,
  className?: string,
};

export const defaultContext = {
  rightToLeft: false,
};

export const staticEnvironment = Environment.create();

/**
 * Produce a stylesheet from a spec.
 */
export function createStylesheet(spec: StylesheetSpec): Stylesheet {
  return Compiler.compile(spec);
}

export function createEnvironment(): Environment.Environment {
  return Environment.create();
}

/**
 * Override a stylesheet with a spec.
 */
export function overrideStylesheet(
  stylesheet: Stylesheet,
  override: StylesheetSpec,
): Stylesheet {
  function overrideVariant(variant, override) {
    const nextVariant = {...variant};
    for (const k in override) {
      if (CSSPseudoClassSet[k]) {
        nextVariant[k] = overrideVariant(nextVariant[k], override[k]);
      } else {
        nextVariant[k] = override[k];
      }
    }
    return nextVariant;
  }

  const nextSpec = {...stylesheet.spec};
  for (const variant in override) {
    nextSpec[variant] = overrideVariant(nextSpec[variant], override[variant]);
  }

  return createStylesheet(nextSpec);
}

export function injectStylesheet(stylesheet: Stylesheet, env = staticEnvironment): void {
  for (const rule of stylesheet.rules) {
    staticEnvironment.insert(rule.cssText);
  }
  return (null: any);
}

export function toClassName(
  stylesheet: Stylesheet,
  variant: Object,
  context?: StylesheetContext = defaultContext,
): null | string | CSSClassJoin {
  const styles = [];
  const addStyle = style => {
    if (style != null) {
      if (Environment.isTest) {
        styles.push(new CSSClass(style.className, style.repr));
      } else {
        styles.push(style.className);
      }
    }
  };

  addStyle(stylesheet.variantToClassName.base);
  if (context.rightToLeft) {
    styles.push(Compiler.RTL_CLASS_NAME);
    addStyle(stylesheet.variantToClassName.rightToLeft);
  }
  for (const key in variant) {
    if (key === 'base') {
      continue;
    }
    if (key === 'rightToLeft' && context.rightToLeft) {
      continue;
    }
    if (variant[key] != null && variant[key] !== false) {
      addStyle(stylesheet.variantToClassName[key]);
    }
  }
  if (context.className != null) {
    styles.push(context.className);
  }
  return styles.length > 0 ? new CSSClassJoin(styles) : null;
}

/**
 * Component factory API.
 */

type StyledComponentProps = {
  Component?: string | React.ComponentType<*>,
  stylesheet?: Stylesheet,
  variant?: Object,
  className?: string,
};

export function styleComponent<P: {}>(
  Component: string | React.ComponentType<P>,
  spec: StylesheetSpec,
): React.ComponentType<P & StyledComponentProps> {
  const stylesheet = createStylesheet(spec);
  injectStylesheet(stylesheet);
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

type StyledComponentContext = {
  rightToLeft: boolean,
};

type StyledComponentImplProps = {
  Component: string | React.ComponentType<*>,
  stylesheet: Stylesheet,
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
    let className = toClassName(stylesheet, variant, {
      rightToLeft: this.context.rightToLeft,
      className: extraClassName,
    });
    return <Component {...props} className={className} />;
  }
}

/**
 * <Element /> API
 */

type ElementProps<P: {}> = {
  Component: string | React.ComponentType<P>,
  className?: string,
};

export class Element<
  P: {},
  Props: CSS.CSSStylesheet & P & ElementProps<P>,
> extends React.Component<Props> {
  context: StyledComponentContext;

  static defaultProps = {
    Component: 'div',
  };

  environment: Environment.Environment = createEnvironment();
  stylesheet: Stylesheet;
  restProps: P;

  constructor(props: Props) {
    super(props);
    const [restProps, stylesheet] = this.createStylesheetFromProps(props);
    this.restProps = restProps;
    this.stylesheet = stylesheet;
    this.environment = Environment.create();
  }

  render() {
    const {Component, className: extraClassName} = this.props;
    const className = toClassName(
      this.stylesheet,
      {},
      {rightToLeft: this.context.rightToLeft, className: extraClassName},
    );
    return <Component {...this.restProps} className={className} />;
  }

  componentWillMount() {
    injectStylesheet(this.stylesheet, this.environment);
  }

  componentWillReceiveProps(nextProps: Props) {
    const [restProps, stylesheet] = this.createStylesheetFromProps(nextProps);
    if (this.stylesheet == null || stylesheet.id !== this.stylesheet.id) {
      this.environment.dispose();
      injectStylesheet(stylesheet, this.environment);
      this.restProps = restProps;
      this.stylesheet = stylesheet;
    }
  }

  componentWillUnmount() {
    this.environment.dispose();
  }

  createStylesheetFromProps(props: Props): [P, Stylesheet] {
    const restProps: any = {};
    const spec = {base: {}};
    for (const key in props) {
      if (CSSPseudoClassSet[key] || CSSPropertySet[key]) {
        spec.base[key] = props[key];
      } else {
        restProps[key] = props[key];
      }
    }
    return [restProps, createStylesheet(spec)];
  }
}

/**
 * <VBox /> & <HBox /> API
 */

/**
 * These are the defaults which were taken from the Facebook's implementation of
 * flexbox in JS/C/Java (now called Yoga).
 */
const defaultBoxStyle = {
  position: 'relative',

  margin: 0,
  padding: 0,

  display: 'flex',
  alignItems: 'stretch',
  flexBasis: 'auto',
  flexShrink: 0,

  minHeight: 0,
  minWidth: 0,
};

export class VBox<P: {}> extends Element<P, *> {
  static defaultProps = {
    Component: 'div',
    ...defaultBoxStyle,
    flexDirection: 'column',
  };
}

export class HBox<P: {}> extends Element<P, *> {
  static defaultProps = {
    Component: 'div',
    ...defaultBoxStyle,
    flexDirection: 'row',
  };
}
