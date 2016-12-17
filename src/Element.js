/**
 * @flow
 */

import type {StyleState} from './ElementPropSpec';

import React from 'react';
import createHash from 'murmurhash-js/murmurhash3_gc';
import injectStylesheet from 'style-loader/addStyles';

import {compileStyle, expandStyle} from './compiler';
import {Spec} from './ElementPropSpec';

type Style = Object;

export type ElementProps = {
  Component?: string;
  style?: Object;
};

export default class Element extends React.Component<*, ElementProps, void> {

  static Component = 'div';
  static className: ?string = null;

  render() {
    let Component = this.constructor.Component;
    let className = [];
    let style = this.props.style || {};
    let dynamicStyle = {};
    let dynamicStyleKey = [];
    let props = {};

    if (this.constructor.className != null) {
      className.push(this.constructor.className);
    }

    for (let k in this.props) {
      if (!this.props.hasOwnProperty(k)) {
        continue;
      }
      let v = this.props[k];

      if (k === 'Component') {
        Component = v;
        continue;
      } else if (k === 'className') {
        className.push(v);
        continue;
      } else if (k === 'style') {
        continue;
      }

      let spec = Spec[k];
      if (spec != null) {
        if (v == null) {
          continue;
        }
        if (spec.applyStrategy === 'dynamic-inline') {
          style[spec.name] = v;
        } else if (spec.applyStrategy === 'dynamic') {
          if (spec.state === 'normal') {
            dynamicStyle[spec.name] = v;
          } else {
            dynamicStyle[spec.state] = dynamicStyle[spec.state] || {};
            dynamicStyle[spec.state][spec.name] = v;
          }
          dynamicStyleKey[spec.index] = v;
        } else if (spec.applyStrategy === 'static') {
          className.push(staticStylesheetManager.toClassName(spec.state, spec.name, v));
        }
      } else {
        props[k] = v;
      }
    }

    className.push(dynamicStylesheetManager.toClassName(dynamicStyleKey, dynamicStyle));

    return (
      <Component
        {...props}
        style={expandStyle(style)}
        className={className.join(' ')}
        />
    );
  }
}

class DynamicStylesheetManager {

  _stylesheetCache: Map<string, string> = new Map();

  toClassName(key: mixed, style: Style): string {
    key = `rs-${String(createHash(String(key)))}`;
    let className = this._stylesheetCache.get(key);
    if (className == null) {
      let css = compileStyle(key, style, true);
      className = key;
      injectStylesheet([[key, css]]);
      this._stylesheetCache.set(key, className);
    }
    return className;
  }

}

class StaticStylesheetManager {

  constructor() {
    this._precompile();
  }

  toClassName(state: StyleState, name: string, value: string): string {
    return `rs-${name}-${value}-${state}`;
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
    injectStylesheet([['static', cssList.join('\n')]]);
  }

  _generateRuleSet(
    cssList: Array<string>,
    name: string,
    state: string,
    valueSet: Array<string>
  ): void {
    for (let i = 0; i < valueSet.length; i++) {
      let value = valueSet[i];
      cssList.push(compileStyle(
        `rs-${name}-${value}-${state}`,
          state === 'normal'
          ? {[name]: value}
          : {[state]: {[name]: value}}
      ));
    }
  }
}

export const dynamicStylesheetManager = new DynamicStylesheetManager();
export const staticStylesheetManager = new StaticStylesheetManager();
