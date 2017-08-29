/**
 * @flow
 */

const React = require('react');
const invariant = require('invariant');

import CSSPseudoClassSet from './CSSPseudoClassSet';
import CSSPropertySet from './CSSPropertySet';
import * as CSS from './CSS';
import * as CSSStyleRepr from './CSSStyleRepr';
import * as Compiler from './Compiler';
import * as Environment from './Environment';

/**
 * This is how you define your stylesheet.
 */
export type StylesheetSpec = {
  displayName?: string,
  [key: string]: CSS.CSSStylesheet,
};

/**
 * Defines a stretegy for how styles are being inserted.
 *
 * Single manager can host multiple styles.
 */
export interface StylesheetManager {
  /**
   * Inject a CSS rule.
   */
  inject(rule: string): void,

  /**
   * Dispose manager along with all injected styles.
   */
  dispose(): void,
}

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

export const staticStyles = Environment.createStylesheetManager();

/**
 * Produce a stylesheet from a spec.
 */
export function createStylesheet(spec: StylesheetSpec): Stylesheet {
  return Compiler.compile(spec);
}

export function createStylesheetManager(): StylesheetManager {
  return Environment.createStylesheetManager();
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

  const nextSpec = {
    ...stylesheet.spec,
    displayName:
      override.displayName != null ? override.displayName : stylesheet.spec.displayName,
  };
  for (const variant in override) {
    if (variant === 'displayName') {
      continue;
    }
    nextSpec[variant] = overrideVariant(nextSpec[variant], override[variant]);
  }

  return createStylesheet(nextSpec);
}

export function injectStylesheet(stylesheet: Stylesheet, manager = staticStyles): void {
  for (const rule of stylesheet.rules) {
    manager.inject(rule.cssText);
  }
}

export function toClassName(
  stylesheet: Stylesheet,
  variant: Object,
  context?: StylesheetContext = defaultContext,
): null | string | CSSStyleRepr.CSSClassJoin {
  const styles = [];
  const addStyle = style => {
    if (style != null) {
      if (typeof style === 'string') {
        styles.push(style);
      } else {
        styles.push(CSSStyleRepr.className(style.className, style.repr));
      }
    }
  };

  addStyle(stylesheet.variantToClassName.base);
  if (context.rightToLeft) {
    addStyle(Compiler.RTL_CLASS_NAME);
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
    addStyle(context.className);
  }
  return styles.length > 0 ? CSSStyleRepr.classNameJoin(styles) : null;
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

  manager: StylesheetManager;
  stylesheet: Stylesheet;
  restProps: P;

  constructor(props: Props) {
    super(props);
    const [restProps, stylesheet] = this.createStylesheetFromProps(props);
    this.restProps = restProps;
    this.stylesheet = stylesheet;
    this.manager = createStylesheetManager();
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
    injectStylesheet(this.stylesheet, this.manager);
  }

  componentWillReceiveProps(nextProps: Props) {
    const [restProps, stylesheet] = this.createStylesheetFromProps(nextProps);
    if (this.stylesheet == null || stylesheet.id !== this.stylesheet.id) {
      this.manager.dispose();
      injectStylesheet(stylesheet, this.manager);
      this.restProps = restProps;
      this.stylesheet = stylesheet;
    }
  }

  componentWillUnmount() {
    this.manager.dispose();
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
