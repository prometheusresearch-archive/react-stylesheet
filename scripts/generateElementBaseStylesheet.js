/**
 * @flow
 */

import * as ReactStylesheet from '../src/index';
import * as Compiler from '../src/Compiler';
import defaultBoxStyle from '../src/DefaultBoxStyle';
import {
  ElementBaseClassName,
  VBoxBaseClassName,
  HBoxBaseClassName,
  visitCSSPropertyDomain,
  variableName,
} from '../src/CSSVariableElement';

const CSSPropertyMask = {
  flex: true,
  border: true,
  padding: true,
  paddingHorizontal: true,
  paddingVertical: true,
  paddingStart: true,
  paddingEnd: true,
  margin: true,
  marginHorizontal: true,
  marginVertical: true,
  marginStart: true,
  marginEnd: true,
  startOffset: true,
  endOffset: true,
};

const CSSPropertyFallback = {
  display: [[], 'block'],
  paddingLeft: [['paddingHorizontal', 'padding'], 0],
  paddingRight: [['paddingHorizontal', 'padding'], 0],
  paddingTop: [['paddingVertical', 'padding'], 0],
  paddingBottom: [['paddingVertical', 'padding'], 0],
  marginLeft: [['marginHorizontal', 'margin'], 0],
  marginRight: [['marginHorizontal', 'margin'], 0],
  marginTop: [['marginVertical', 'margin'], 0],
  marginBottom: [['marginVertical', 'margin'], 0],
  borderLeft: [['border'], 0],
  borderRight: [['border'], 0],
  borderTop: [['border'], 0],
  borderBottom: [['border'], 0],
};

function variable(prop, scope) {
  let fallback = CSSPropertyFallback[prop];
  if (fallback == null) {
    fallback = [[], 'initial'];
  }
  const [vars, val] = fallback;
  if (scope === 'base') {
    fallback = val;
    fallback = vars.reduceRight(
      (fallback, v) => `var(${variableName(v, 'default')}, ${fallback})`,
      fallback,
    );
    fallback = `var(${variableName(prop, 'default')}, ${fallback})`;
    fallback = vars.reduceRight(
      (fallback, v) => `var(${variableName(v, scope)}, ${fallback})`,
      fallback,
    );
  } else {
    fallback = val;
    fallback = vars.reduceRight(
      (fallback, v) => `var(${variableName(v, 'default')}, ${fallback})`,
      fallback,
    );
    fallback = `var(${variableName(prop, 'default')}, ${fallback})`;
    fallback = vars.reduceRight(
      (fallback, v) => `var(${variableName(v, 'base')}, ${fallback})`,
      fallback,
    );
    fallback = `var(${variableName(prop, 'base')}, ${fallback})`;
    fallback = vars.reduceRight(
      (fallback, v) => `var(${variableName(v, scope)}, ${fallback})`,
      fallback,
    );
  }
  return (`var(${variableName(prop, scope)}, ${fallback})`: any);
}

const styles = {};

visitCSSPropertyDomain((prop, scope, _variableName) => {
  if (CSSPropertyMask[prop] === true) {
    return;
  }
  if (scope === 'base') {
    styles[prop] = variable(prop, scope);
  } else {
    styles[scope] = styles[scope] || {};
    styles[scope][prop] = variable(prop, scope);
  }
});

const vboxStyle = {...defaultBoxStyle, flexDirection: 'column'};
const hboxStyle = {...defaultBoxStyle, flexDirection: 'row'};

function toDefaultVariables(style) {
  const variables = {};
  for (const prop in style) {
    variables[variableName(prop, 'default')] = style[prop];
  }
  return variables;
}

const vbox = ReactStylesheet.createStylesheet({
  className: VBoxBaseClassName,
  base: toDefaultVariables(vboxStyle),
});

const hbox = ReactStylesheet.createStylesheet({
  className: HBoxBaseClassName,
  base: toDefaultVariables(hboxStyle),
});

const base = ReactStylesheet.createStylesheet({
  className: ElementBaseClassName,
  base: styles,
});

console.log(ReactStylesheet.renderStylesheet(base));
console.log(ReactStylesheet.renderStylesheet(vbox));
console.log(ReactStylesheet.renderStylesheet(hbox));
