/**
 * @flow
 */

import React from 'react';
import createHash from 'murmurhash-js/murmurhash3_gc';
import injectStylesheet from 'style-loader/addStyles';

import {compileStyle, expand} from './compiler';

type Style = Object;
type StyleState = 'normal' | 'hover' | 'focus' | 'active' | 'disabled';
type StyleApplyStrategy = 'static' | 'dynamic' | 'dynamic-inline';

type StylePropSpec = {
  [propName: string]: PropSpec;
};

class PropSpec {
  name: string;
  state: StyleState;
  applyStrategy: StyleApplyStrategy;

  constructor(name, state, applyStrategy) {
    this.name = name;
    this.state = state;
    this.applyStrategy = applyStrategy;
  }
}

const STYLE_STATIC_VALUE_SET = {
  'display':        ['none', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'table'],
  'position':       ['absolute', 'relative', 'static', 'fixed', 'sticky'],
  'overflow':       ['visible', 'hidden', 'scroll', 'auto'],
  'overflowX':      ['visible', 'hidden', 'scroll', 'auto'],
  'overflowY':      ['visible', 'hidden', 'scroll', 'auto'],
  'flexDirection':  ['row', 'row-reverse', 'column', 'column-reverse'],
  'flexWrap':       ['nowrap', 'wrap', 'wrap-reverse'],
  'alignContent':   ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'],
  'alignItems':     ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
  'alignSelf':      ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
  'float':          ['left', 'right', 'none', 'inline-start', 'inline-end'],
  'textAlign':      ['start', 'end', 'left', 'right', 'center', 'justify', 'match-parent'],
  'justifyContent': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
  'whiteSpace':     ['normal', 'pre', 'nowrap', 'pre-wrap', 'pre-line'],
  'visibility':     ['visible', 'hidden', 'collapse'],
  'textTransform':  ['none', 'capitalize', 'uppercase', 'lowercase', 'full-width'],
};

const STYLE_PROP_SPEC: StylePropSpec = {};

function defineDynamicStyleProp(spec, name) {
  let nameOnHover = `${name}OnHover`;
  let nameOnFocus = `${name}OnFocus`;
  let nameOnActive = `${name}OnActive`;
  let nameOnDisabled= `${name}OnDisabled`;
  Object.assign(spec, {
    [name]: new PropSpec(name, 'normal', 'dynamic-inline'),
    [nameOnHover]: new PropSpec(name, 'hover', 'dynamic'),
    [nameOnFocus]: new PropSpec(name, 'focus', 'dynamic'),
    [nameOnActive]: new PropSpec(name, 'active', 'dynamic'),
    [nameOnDisabled]: new PropSpec(name, 'disabled', 'dynamic'),
  });
}

function defineStaticStyleProp(spec, name) {
  let nameOnHover = `${name}OnHover`;
  let nameOnFocus = `${name}OnFocus`;
  let nameOnActive = `${name}OnActive`;
  let nameOnDisabled= `${name}OnDisabled`;
  Object.assign(spec, {
    [name]:         new PropSpec(name, 'normal', 'static'),
    [nameOnHover]:  new PropSpec(name, 'hover', 'static'),
    [nameOnFocus]:  new PropSpec(name, 'focus', 'static'),
    [nameOnActive]: new PropSpec(name, 'active', 'static'),
    [nameOnDisabled]: new PropSpec(name, 'disabled', 'dynamic'),
  });
}

defineDynamicStyleProp(STYLE_PROP_SPEC, 'margin');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'marginTop');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'marginRight');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'marginBottom');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'marginLeft');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'padding');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'paddingH');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'paddingTop');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'paddingRight');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'paddingBottom');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'paddingLeft');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'border');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'borderTop');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'borderRight');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'borderBottom');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'borderLeft');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'color');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'background');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'width');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'minWidth');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'maxWidth');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'height');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'minHeight');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'maxHeight');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'top');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'right');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'bottom');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'left');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'fontSize');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'fontWeight');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'fontFamily');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'fontStyle');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'opacity');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'flexShrink');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'flexGrow');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'flexBasis');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'flexFlow');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'order');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'boxShadow');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'textShadow');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'transition');
defineDynamicStyleProp(STYLE_PROP_SPEC, 'outline');

defineStaticStyleProp(STYLE_PROP_SPEC, 'display');
defineStaticStyleProp(STYLE_PROP_SPEC, 'position');
defineStaticStyleProp(STYLE_PROP_SPEC, 'textAlign');
defineStaticStyleProp(STYLE_PROP_SPEC, 'overflow');
defineStaticStyleProp(STYLE_PROP_SPEC, 'overflowX');
defineStaticStyleProp(STYLE_PROP_SPEC, 'overflowY');
defineStaticStyleProp(STYLE_PROP_SPEC, 'float');
defineStaticStyleProp(STYLE_PROP_SPEC, 'flexDirection');
defineStaticStyleProp(STYLE_PROP_SPEC, 'flexWrap');
defineStaticStyleProp(STYLE_PROP_SPEC, 'justifyContent');
defineStaticStyleProp(STYLE_PROP_SPEC, 'alignContent');
defineStaticStyleProp(STYLE_PROP_SPEC, 'alignItems');
defineStaticStyleProp(STYLE_PROP_SPEC, 'alignSelf');
defineStaticStyleProp(STYLE_PROP_SPEC, 'whiteSpace');
defineStaticStyleProp(STYLE_PROP_SPEC, 'visibility');
defineStaticStyleProp(STYLE_PROP_SPEC, 'textTransform');

const STYLE_INDEX = {};
let index = 0;
for (let k in STYLE_PROP_SPEC) {
  if (!STYLE_PROP_SPEC.hasOwnProperty(k)) {
    continue;
  }
  STYLE_INDEX[k] = index++;
}

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

      let spec = STYLE_PROP_SPEC[k];
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
          dynamicStyleKey[STYLE_INDEX[k]] = v;
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
        style={expand(style)}
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
    for (let k in STYLE_PROP_SPEC) {
      if (!STYLE_PROP_SPEC.hasOwnProperty(k)) {
        continue;
      }
      let spec = STYLE_PROP_SPEC[k];
      let valueSet = STYLE_STATIC_VALUE_SET[spec.name];
      if (valueSet != null) {
        this._generateRuleSet(cssList, spec.name, spec.state, valueSet);
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
