/**
 * @flow
 */

const hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');
const memoizeStringOnly = require('fbjs/lib/memoizeStringOnly');
const computeHashImpl = require('murmurhash-js/murmurhash3_gc');

import type {StylesheetSpec} from './Stylesheet';
import * as Runtime from './Runtime';
import CSSPseudoClassSet from './CSSPseudoClassSet';
import CSSUnitlessNumberPropSet from './CSSUnitlessNumberPropSet';

export type CompiledStylesheet = {
  id: string,
  rules: Array<{cssText: string}>,
  spec: StylesheetSpec,
  variantToClassName: {
    [variantName: string]: {
      className: string,
      repr: ?{selector: string, props: Array<string>},
    },
  },
};

export const RTL_CLASS_NAME = 'RTL';

export function compile(spec: StylesheetSpec): CompiledStylesheet {
  const displayName = spec.displayName != null ? spec.displayName : 'Component';
  const variantToClassName = {};
  const rules = [];
  let id = [];
  for (const key in spec) {
    if (key === 'displayName' || key === 'className') {
      continue;
    }

    // compile variant
    const variant = [];
    compileVariant(variant, [], spec[key]);

    // now turn variant into rule
    const hash = computeHash(displayName + '||' + JSON.stringify(variant));
    id.push(hash);

    let variantSelector = spec.className;

    if (variantSelector == null) {
      variantSelector = displayName;
      if (key !== 'base') {
        variantSelector = `${variantSelector}-${key}`;
      }
      variantSelector = `${variantSelector}-${hash}`;
    }

    const repr = Runtime.isTest ? [] : null;
    let variantHasStyles = false;

    for (let i = 0; i < variant.length; i++) {
      const rule = variant[i];
      if (rule.props.length === 0) {
        continue;
      }
      variantHasStyles = true;
      // selector
      let selector = `.${variantSelector}`;
      if (rule.rightToLeft) {
        selector = `${selector}.${RTL_CLASS_NAME}`;
      }
      if (rule.selector.length > 0) {
        selector = `${selector}:${rule.selector.join(':')}`;
      }
      // props
      const props = rule.props.join(';\n') + ';';
      rules.push({cssText: `${selector} {\n${props}\n}`});
      // repr
      if (repr !== null) {
        let reprSelector = key;
        if (rule.selector.length > 0) {
          reprSelector = reprSelector + ':' + rule.selector.join(':');
        }
        repr.push({selector: reprSelector, props: rule.props});
      }
    }

    if (variantHasStyles) {
      variantToClassName[key] = {className: variantSelector, repr};
    }
  }

  return {
    id: computeHash(id.join('||')),
    rules,
    spec,
    variantToClassName,
  };
}

function compileVariant(rules, selector, variant) {
  const props = [];
  const propsRTL = [];
  const variantRules = [];
  for (const name in variant) {
    const value = variant[name];
    if (CSSPseudoClassSet[name]) {
      compileVariant(variantRules, selector.concat(compileName(name)), value);
    } else if (!isEmpty(value)) {
      compileProperty(props, propsRTL, name, value);
    }
  }
  if (props.length > 0) {
    rules.push({selector, props, rightToLeft: false});
  }
  if (propsRTL.length > 0) {
    rules.push({selector, props: propsRTL, rightToLeft: true});
  }
  if (variantRules.length > 0) {
    rules.push(...variantRules);
  }
}

function compileProperty(propsLTR, propsRTL, name, value) {
  switch (name) {
    case 'paddingStart': {
      const cvalue = compileValue('padding', value);
      propsLTR.push(`padding-left: ${cvalue} !important`);
      propsRTL.push(`padding-right: ${cvalue} !important`);
      break;
    }
    case 'paddingEnd': {
      const cvalue = compileValue('padding', value);
      propsLTR.push(`padding-right: ${cvalue} !important`);
      propsRTL.push(`padding-left: ${cvalue} !important`);
      break;
    }
    case 'paddingVertical': {
      const cvalue = compileValue('padding', value);
      propsLTR.push(`padding-top: ${cvalue} !important`);
      propsLTR.push(`padding-bottom: ${cvalue} !important`);
      break;
    }
    case 'paddingHorizontal': {
      const cvalue = compileValue('padding', value);
      propsLTR.push(`padding-left: ${cvalue} !important`);
      propsLTR.push(`padding-right: ${cvalue} !important`);
      break;
    }
    case 'marginStart': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-left: ${cvalue} !important`);
      propsRTL.push(`margin-right: ${cvalue} !important`);
      break;
    }
    case 'marginEnd': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-right: ${cvalue} !important`);
      propsRTL.push(`margin-left: ${cvalue} !important`);
      break;
    }
    case 'marginVertical': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-top: ${cvalue} !important`);
      propsLTR.push(`margin-bottom: ${cvalue} !important`);
      break;
    }
    case 'marginHorizontal': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-left: ${cvalue} !important`);
      propsLTR.push(`margin-right: ${cvalue} !important`);
      break;
    }
    case 'startOffset': {
      const cvalue = compileValue('left', value);
      propsLTR.push(`left: ${cvalue} !important`);
      propsRTL.push(`right: ${cvalue} !important`);
      break;
    }
    case 'endOffset': {
      const cvalue = compileValue('right', value);
      propsLTR.push(`right: ${cvalue} !important`);
      propsRTL.push(`left: ${cvalue} !important`);
      break;
    }
    default:
      const cname = compileName(name);
      const cvalue = compileValue(name, value);
      propsLTR.push(`${cname}: ${cvalue} !important`);
  }
}

export function compileValue(name: string, value: mixed): string {
  let isNonNumeric = isNaN(value);
  if (
    isNonNumeric ||
    value === 0 ||
    (CSSUnitlessNumberPropSet.hasOwnProperty(name) && CSSUnitlessNumberPropSet[name])
  ) {
    return '' + ((value: any): string); // cast to string
  } else {
    return ((value: any): string) + 'px';
  }
}

const computeHash = value => (Runtime.isTest ? '<HASH>' : computeHashImpl(value));
const isEmpty = value => value == null || value === '' || value === false;
export const compileName = memoizeStringOnly(name => hyphenateStyleName(name));
