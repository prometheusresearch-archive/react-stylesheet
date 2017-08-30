/**
 * @flow
 */

const React = require('react');

import CSSPseudoClassSet from './CSSPseudoClassSet';
import CSSPropertySet from './CSSPropertySet';
import * as CSS from './CSS';
import * as Stylesheet from './Stylesheet';

/**
 * <Element /> API
 */

type ElementProps<P: {}> = {
  Component: string | React.ComponentType<P>,
  className?: string,
};

export default class Element<
  P: {},
  Props: CSS.CSSStylesheet & P & ElementProps<P>,
> extends React.Component<Props> {
  context: Stylesheet.StylesheetContext;

  static defaultProps = {
    Component: 'div',
  };

  manager: Stylesheet.StylesheetManager;
  stylesheet: Stylesheet.Stylesheet;
  restProps: P;

  constructor(props: Props) {
    super(props);
    const [restProps, stylesheet] = this.createStylesheetFromProps(props);
    this.restProps = restProps;
    this.stylesheet = stylesheet;
    this.manager = Stylesheet.createStylesheetManager();
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
    Stylesheet.injectStylesheet(this.stylesheet, this.manager);
  }

  componentWillReceiveProps(nextProps: Props) {
    const [restProps, stylesheet] = this.createStylesheetFromProps(nextProps);
    if (this.stylesheet == null || stylesheet.id !== this.stylesheet.id) {
      this.manager.dispose();
      Stylesheet.injectStylesheet(stylesheet, this.manager);
      this.restProps = restProps;
      this.stylesheet = stylesheet;
    }
  }

  componentWillUnmount() {
    this.manager.dispose();
  }

  createStylesheetFromProps(props: Props): [P, Stylesheet.Stylesheet] {
    const restProps: any = {};
    const spec = {base: {}};
    for (const key in props) {
      if (CSSPseudoClassSet[key] || CSSPropertySet[key]) {
        spec.base[key] = props[key];
      } else {
        restProps[key] = props[key];
      }
    }
    return [restProps, Stylesheet.createStylesheet(spec)];
  }
}
