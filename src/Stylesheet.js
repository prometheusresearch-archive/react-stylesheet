/**
 * @copyright 2015-present Prometheus Research, LLC
 * @flow
 */

import type {CSSPropertySet} from './CSSType';
import type {CompileResult, ClassNameMapping} from './compile';

import injectStylesheet from 'style-loader/addStyles';

import compile, {PSEUDO_CLASS} from './compile';

export type Variant = {
  [variantName: string]: boolean;
};

export type StylesheetSpec = {
  [name: string]: CSSPropertySet;
};

export class Stylesheet {

  name: string;
  spec: StylesheetSpec;
  _stylesheet: CompileResult;
  _refs: number;
  _remove: ?(() => void);
  _disposeTimer: ?number;

  constructor(name: string, spec: StylesheetSpec) {
    this.name = name;
    this.spec = spec;
    this._stylesheet = compile(name, spec);
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

  override(spec: StylesheetSpec, name?: string) {
    if (name == null) {
      name = this.name;
    }
    return new Stylesheet(name, override(this.spec, spec));
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

export function classNameFor(mapping: ClassNameMapping, variant: Variant): string {
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

export function override(
  spec: StylesheetSpec,
  override: StylesheetSpec
): StylesheetSpec {
  let result = {...spec};
  for (let k in override) {
    if (override.hasOwnProperty(k)) {
      result[k] = overrideCSSPropertySet(result[k], override[k]);
    }
  }
  return result;
}

function overrideCSSPropertySet(
  propSet: ?CSSPropertySet,
  override: CSSPropertySet
): CSSPropertySet {
  if (propSet == null) {
    return override;
  }
  let result: CSSPropertySet = ({...propSet}: any);
  for (let k in override) {
    if (override.hasOwnProperty(k)) {
      if (PSEUDO_CLASS.hasOwnProperty(k) && PSEUDO_CLASS[k]) {
        result[k] = overrideCSSPropertySet(result[k], override[k]);
      } else {
        result[k] = override[k];
      }
    }
  }
  return result;
}

export default function stylesheet(name: string, spec: StylesheetSpec): Stylesheet {
  return new Stylesheet(name, spec);
}
