/**
 * @flow
 */

import type {CSSPropertySet} from './CSSType';

import injectStylesheet from 'style-loader/addStyles';
import React from 'react';

import getComponentDisplayName from './getComponentDisplayName';
import compile from './compile';

export type CSSValue = {
  toCSS(): string
};

type ComponentSpec = {
  displayName?: string;
  [name: string]: CSSPropertySet;
};

export type Stylesheet = {
  [name: string]: CSSPropertySet;
};

class CSSRawValue {

  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toCSS() {
    return this.value;
  }
}

export function css(value: string): CSSValue {
  return new CSSRawValue(value);
}

class StylesheetManager {

  id: string;
  css: string;
  _refs: number;
  _remove: ?(() => void);
  _disposeTimer: ?number;

  constructor(id: string, css: string) {
    this.id = id;
    this.css = css;
    this._refs = 0;
    this._remove = null;
    this._disposeTimer = null;
  }

  inject() {
    this._refs = this._refs + 1;
    if (this._disposeTimer !== null) {
      clearTimeout(this._disposeTimer);
      this._disposeTimer = null;
    }
    if (this._remove === null) {
      this._remove = injectStylesheet([[this.id, this.css]]);
    }
    return this;
  }

  dispose() {
    this._refs = this._refs - 1;
    if (this._disposeTimer === null) {
      this._disposeTimer = setTimeout(this._disposePerform, 0);
    }
    return this;
  }

  _disposePerform() {
    if (this._remove && this._refs < 1) {
      this._remove();
      this._remove = null;
    }
  }
}

export type ClassNameMapping = {
  className?: string;
  then?: {[name: string]: ClassNameMapping};
};

export function style<T: string | ReactClass<*>>(
  ComponentDefault: T,
  spec: ComponentSpec
): T {

  let {
    displayName,
    ...stylesheet
  } = spec;

  if (displayName == null) {
    displayName = getComponentDisplayName(ComponentDefault);
  }


  let {id, css} = compile(displayName, stylesheet);
  let manager = new StylesheetManager(id, css);

  let StylesheetComponent = class extends React.Component {

    props: {
      variant?: Object;
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

      let className = manager.toClassName(variant);
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
      manager.inject();
    }

    componentWillUnmount() {
      manager.dispose();
    }
  };

  return ((StylesheetComponent: any): T);
}

let Header = style('div', {
  displayName: 'Header',
  base: {
    background: 'red',
    color: 'red',
  }
});

function X({x}: {x: number}) {
  return <div>{x}</div>;
}

let XS = style(X, {

  base: {
    background: 'white'
  },

  hover: {
    background: 'red'
  },

  hover_base: {
    color: 'red',
  },

  hover_base_focus: {
    color: 'red',
  }
});

// $ExpectError: ok
<XS x="some" />;

<XS x={42} />;

class Y extends React.Component {

  props: {
    x: number;
  };

  render() {
    return <div>{this.props.x}</div>;
  }
}

let YS = style(Y, {
  base: {
    background: 'x'
  }
});

// $ExpectError: ok
<YS x="some" />;

<YS x={42} />;
