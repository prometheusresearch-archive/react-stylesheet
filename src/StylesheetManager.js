/**
 * @flow
 */

import type {StyleState} from './ElementPropSpec';

import injectStylesheet from 'style-loader/addStyles';
import createHash from 'murmurhash-js/murmurhash3_gc';

import {Spec} from './ElementPropSpec';
import {compileStyle} from './compiler';
import {CSSClassRepresentation} from './StyleRepresentation';
import * as Environment from './Environment';

type Style = Object;

export class StylesheetManager {
  injectStylesheet(compiledStylesheet: Array<[string, string]>): void {
    if (Environment.canInject) {
      injectStylesheet(compiledStylesheet);
    }
  }
}

export class DynamicStylesheetManager extends StylesheetManager {
  _stylesheetCache: Map<string, string | CSSClassRepresentation> = new Map();

  toClassName(key: mixed, style: Style): CSSClassRepresentation | string {
    key = `rs-${String(createHash(String(key)))}`;
    let className = this._stylesheetCache.get(key);
    if (className == null) {
      let css = compileStyle(key, style, true);
      if (Environment.isTest) {
        className = new CSSClassRepresentation(key, style, 'DynamicallyGeneratedCSS');
      } else {
        className = key;
      }
      this.injectStylesheet([[key, css]]);
      this._stylesheetCache.set(key, className);
    }
    return className;
  }
}

export class StaticStylesheetManager extends StylesheetManager {
  constructor() {
    super();
    this._precompile();
  }

  toClassName(state: StyleState, name: string, value: string): string {
    const className = `rs-${name}-${value}-${state}`;
    if (Environment.isTest) {
      return new CSSClassRepresentation(className, {[name]: value}, 'PrecompiledCSS');
    } else {
      return className;
    }
  }

  _precompile(): void {
    let cssList = [];
    for (let k in Spec) {
      if (!Spec.hasOwnProperty(k)) {
        continue;
      }
      let spec = Spec[k];
      if (spec.applyStrategy === 'static') {
        this._generateRuleSet(cssList, spec.name, spec.state, spec.valueSet);
      }
    }
    this.injectStylesheet([['static', cssList.join('\n')]]);
  }

  _generateRuleSet(
    cssList: Array<string>,
    name: string,
    state: string,
    valueSet: Array<string>,
  ): void {
    for (let i = 0; i < valueSet.length; i++) {
      let value = valueSet[i];
      let className = `rs-${name}-${value}-${state}`;
      let important = true;
      cssList.push(
        compileStyle(
          className,
          state === 'normal' ? {[name]: value} : {[state]: {[name]: value}},
          important,
        ),
      );
    }
  }
}

export const dynamicStylesheetManager = new DynamicStylesheetManager();
export const staticStylesheetManager = new StaticStylesheetManager();
