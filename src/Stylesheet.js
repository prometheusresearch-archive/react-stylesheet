/**
 * @flow
 */

import type {CSSPropertySet} from './CSSType';
import type {CompileResult, ClassNameMapping} from './compile';

import injectStylesheet from 'style-loader/addStyles';
import React from 'react';

import getComponentDisplayName from './getComponentDisplayName';
import compile from './compile';

export type CSSValue = {
  toCSS(): string
};

export type ComponentSpec = {
  displayName?: string;
  [name: string]: CSSPropertySet;
};

export type Variant = {
  [variantName: string]: boolean;
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

  name: string;
  _stylesheet: CompileResult;
  _refs: number;
  _remove: ?(() => void);
  _disposeTimer: ?number;

  constructor(name: string, stylesheet: Stylesheet) {
    this.name = name;
    this._stylesheet = compile(name, stylesheet);
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
      this._remove = injectStylesheet([[this._stylesheet.id, this._stylesheet.css]]);
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

  toClassName(variant?: Variant = {}): string {
    return classNameFor(this._stylesheet.mapping, variant);
  }

  _disposePerform() {
    if (this._remove && this._refs < 1) {
      this._remove();
      this._remove = null;
    }
  }
}

function classNameFor(mapping: ClassNameMapping, variant: Variant): string {
  let className = mapping.className != null ? mapping.className : '';
  for (let variantName in variant) {
    if (
      mapping.then &&
      variant.hasOwnProperty(variantName) &&
      variant[variantName] &&
      mapping.then[variantName]
    ) {
      className = className + ' ' + classNameFor(mapping.then[variantName], variant);
    }
  }
  return className;
}

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


  let manager = new StylesheetManager(displayName, stylesheet);

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
