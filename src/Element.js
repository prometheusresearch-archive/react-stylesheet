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

  dispose: null | (() => void) = null;
  stylesheet: ?Stylesheet.Stylesheet = null;

  render() {
    const {Component, className: extraClassName, ...props} = this.props;
    const {props: restProps, stylesheet} = createElementProps(props, this.context);
    if (this.stylesheet == null || stylesheet.id !== this.stylesheet.id) {
      if (this.dispose != null) {
        this.dispose();
      }
      this.stylesheet = stylesheet;
      this.dispose = Stylesheet.injectDisposableStylesheet(this.stylesheet);
    }
    const className = Stylesheet.toClassName(
      this.stylesheet,
      {},
      {rightToLeft: this.context.rightToLeft, className: extraClassName},
    );
    return <Component {...restProps} className={className} />;
  }

  componentWillUnmount() {
    if (this.dispose != null) {
      this.dispose();
    }
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

function createElementProps(props: any, context) {
  const style = {...props.style};
  const restProps: any = {};
  const spec = {displayName: 'Element', base: {}};

  let needStyle = false;
  for (const key in props) {
    if (CSSPropertySet[key]) {
      createStyleProp(style, key, props[key], context);
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

  return {props: restProps, stylesheet: Stylesheet.createStylesheet(spec)};
}

function createStyleProp(style, name, value, context) {
  switch (name) {
    case 'paddingStart': {
      if (context.rightToLeft) {
        style.paddingRight = value;
      } else {
        style.paddingLeft = value;
      }
      break;
    }
    case 'paddingEnd': {
      if (context.rightToLeft) {
        style.paddingLeft = value;
      } else {
        style.paddingRight = value;
      }
      break;
    }
    case 'paddingVertical': {
      style.paddingTop = value;
      style.paddingBottom = value;
      break;
    }
    case 'paddingHorizontal': {
      style.paddingLeft = value;
      style.paddingRight = value;
      break;
    }
    case 'marginStart': {
      if (context.rightToLeft) {
        style.marginRight = value;
      } else {
        style.marginLeft = value;
      }
      break;
    }
    case 'marginEnd': {
      if (context.rightToLeft) {
        style.marginLeft = value;
      } else {
        style.marginRight = value;
      }
      break;
    }
    case 'marginVertical': {
      style.marginTop = value;
      style.marginBottom = value;
      break;
    }
    case 'marginHorizontal': {
      style.marginLeft = value;
      style.marginRight = value;
      break;
    }
    case 'startOffset': {
      if (context.rightToLeft) {
        style.right = value;
      } else {
        style.left = value;
      }
      break;
    }
    case 'endOffset': {
      if (context.rightToLeft) {
        style.left = value;
      } else {
        style.right = value;
      }
      break;
    }
    default:
      style[name] = value;
  }
}
