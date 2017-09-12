/**
 * @flow
 */

const React = require('react');

import type {ClassName} from './CSSStyleRepr';
import CSSPseudoClassSet from './CSSPseudoClassSet';
import CSSPropertySet from './CSSPropertySet';
import * as CSS from './CSS';
import * as Stylesheet from './Stylesheet';
import defaultBoxStyle from './DefaultBoxStyle';

/**
 * <Element /> API
 */

type ElementProps<P: {}> = {
  Component: string | React.ComponentType<P>,
  className?: ClassName,
};

export class Element<
  P: {},
  Props: CSS.CSSStylesheet & P & ElementProps<P>,
> extends React.Component<Props> {
  context: Stylesheet.StylesheetContext;

  static defaultProps = {
    Component: 'div',
  };

  dispose: null | (() => void);
  stylesheet: Stylesheet.Stylesheet;
  restProps: P;

  constructor(props: Props) {
    super(props);
    const [restProps, stylesheet] = this.createStylesheetFromProps(props);
    this.restProps = restProps;
    this.stylesheet = stylesheet;
    this.dispose = null;
  }

  render() {
    const {Component, className: extraClassName} = this.props;
    const className = Stylesheet.toClassName(
      this.stylesheet,
      {},
      {rightToLeft: this.context.rightToLeft, className: extraClassName},
    );
    return <Component {...this.restProps} className={className} />;
  }

  componentWillMount() {
    this.dispose = Stylesheet.injectDisposableStylesheet(this.stylesheet);
  }

  componentWillReceiveProps(nextProps: Props) {
    const [restProps, stylesheet] = this.createStylesheetFromProps(nextProps);
    if (this.stylesheet == null || stylesheet.id !== this.stylesheet.id) {
      if (this.dispose != null) {
        this.dispose();
      }
      this.stylesheet = stylesheet;
      this.dispose = Stylesheet.injectDisposableStylesheet(this.stylesheet);
    }
    this.restProps = restProps;
  }

  componentWillUnmount() {
    if (this.dispose != null) {
      this.dispose();
    }
  }

  createStylesheetFromProps(props: any): [P, Stylesheet.Stylesheet] {
    const style = {...props.style};
    const restProps: any = {};
    const spec = {base: {}};
    let needStyle = false;
    for (const key in props) {
      if (CSSPropertySet[key]) {
        style[key] = props[key];
        needStyle = true;
      } else if (CSSPseudoClassSet[key]) {
        spec.base[key] = props[key];
      } else if (key !== 'Component') {
        restProps[key] = props[key];
      }
    }
    if (needStyle) {
      restProps.style = style;
    }
    return [restProps, Stylesheet.createStylesheet(spec)];
  }
}

const VBoxStylesheet = Stylesheet.createStylesheet({
  displayName: 'VBoxBase',
  base: {...defaultBoxStyle, flexDirection: 'column'},
});

const HBoxStylesheet = Stylesheet.createStylesheet({
  displayName: 'HBoxBase',
  base: {...defaultBoxStyle, flexDirection: 'row'},
});

Stylesheet.injectStylesheet(VBoxStylesheet);
Stylesheet.injectStylesheet(HBoxStylesheet);

export class VBox<P: {}> extends Element<P, *> {
  static defaultProps = {
    Component: 'div',
    className: Stylesheet.toClassName(VBoxStylesheet, {}),
  };
}

export class HBox<P: {}> extends Element<P, *> {
  static defaultProps = {
    Component: 'div',
    className: Stylesheet.toClassName(HBoxStylesheet, {}),
  };
}
