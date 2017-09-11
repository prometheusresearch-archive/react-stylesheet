/**
 * @flow
 */

import './CSSVariableElement.css';

const React = require('react');

import * as ReactStylesheet from '../index';
import * as CSS from '../CSS';
import * as Compiler from '../Compiler';
import CSSPropertySet from '../CSSPropertySet';
import defaultBoxStyle from '../DefaultBoxStyle';

const {compileName, compileValue} = Compiler;

const CSSPseudoClassSet = {
  focus: true,
  hover: true,
  active: true,
  disabled: true,
  firstChild: true,
  lastChild: true,
};

/**
 * Visit entire CSS properties domain and call `f` function with each of the
 * properties.
 */
export function visitCSSPropertyDomain(f: (string, string, string) => void) {
  // visit base
  for (const prop in CSSPropertySet) {
    const name = variableName(prop, 'base');
    f(prop, 'base', name);
  }
  // visit scopes
  for (const scope in CSSPseudoClassSet) {
    for (const prop in CSSPropertySet) {
      const name = variableName(prop, scope);
      f(prop, scope, name);
    }
  }
}

export function variableName(name: string, scope: string) {
  name = compileName(name);
  return `--${scope}-${name}`;
}

const scopesLookup = {base: {}};

visitCSSPropertyDomain((prop, scope, variableName) => {
  if (scope === 'base') {
    scopesLookup.base[prop] = variableName;
  } else {
    scopesLookup.base[scope] = scopesLookup.base[scope] || {};
    scopesLookup.base[scope][prop] = variableName;
  }
});

function prepareProps(props: any) {
  const restProps = {style: props.style || {}};
  for (const key in props) {
    if (CSSPropertySet[key] === true) {
      const varName = scopesLookup.base[key];
      restProps.style[varName] = compileValue(key, props[key]);
    } else if (CSSPseudoClassSet[key] === true) {
      const scope = key;
      const scopeProps = props[key];
      for (const key in scopeProps) {
        if (CSSPropertySet[key] === true) {
          const varName = scopesLookup.base[scope][key];
          restProps.style[varName] = compileValue(key, scopeProps[key]);
        }
      }
    } else {
      restProps[key] = props[key];
    }
  }
  return restProps;
}

export const ElementBaseClassName = 'RS-ElementBase';
export const VBoxBaseClassName = 'RS-VBoxBase';
export const HBoxBaseClassName = 'RS-HBoxBase';

export type ElementProps = CSS.CSSPropertySet & {};

export function Element(props: ElementProps) {
  props = prepareProps(props);
  const className = ElementBaseClassName;
  return <div {...props} className={className} />;
}

export function VBox(props: ElementProps) {
  props = prepareProps(props);
  const className = `${ElementBaseClassName} ${VBoxBaseClassName}`;
  return <div {...props} className={className} />;
}

export function HBox(props: ElementProps) {
  props = prepareProps(props);
  const className = `${ElementBaseClassName} ${HBoxBaseClassName}`;
  return <div {...props} className={className} />;
}
