/**
 * @flow
 */

import hyphenateStyleName from 'fbjs/lib/hyphenateStyleName';
import memoizeStringOnly from 'fbjs/lib/memoizeStringOnly';
import computeHash from 'murmurhash-js/murmurhash3_gc';

import type {StylesheetSpec} from './index';
import PseudoClassSet from './PseudoClassSet';
import UnitlessNumberPropSet from './UnitlessNumberPropSet';

export type CompiledStylesheet = {
  id: string,
  rules: Array<{selector: string, props: string}>,
  spec: StylesheetSpec,
};

export function compile(spec: StylesheetSpec): CompiledStylesheet {
  const displayName = spec.displayName || 'Component';
  const rules = [];
  let id = [];
  for (const key in spec) {
    if (key === 'displayName') {
      continue;
    }
    // compile variant
    const variant = [];
    compileVariant(variant, [], spec[key]);
    // now turn variant into rule
    const hash = computeHash(displayName + '||' + JSON.stringify(variant));
    id.push(hash);
    for (let i = 0; i < variant.length; i++) {
      const rule = variant[i];
      if (rule.props.length === 0) {
        continue;
      }
      // selector
      let selector = displayName;
      if (key !== 'base') {
        selector = `${selector}-${key}`;
      }
      selector = `${selector}-${hash}`;
      if (rule.rightToLeft) {
        selector = `${selector}.RTL`;
      }
      if (rule.selector.length > 0) {
        selector = `${selector}:${rule.selector.join(':')}`;
      }
      // props
      const props = rule.props.join(';\n') + ';';
      rules.push({selector, props});
    }
  }

  return {
    id: computeHash(id.join('||')),
    rules,
    spec,
  };
}

function compileVariant(rules, selector, variant) {
  const props = [];
  const propsRTL = [];
  const variantRules = [];
  for (const key in variant) {
    const val = variant[key];
    if (PseudoClassSet[key]) {
      compileVariant(variantRules, selector.concat(key), val);
    } else {
      compileProperty(props, propsRTL, key, val);
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
      propsLTR.push(`padding-left: ${cvalue}`);
      propsRTL.push(`padding-right: ${cvalue}`);
      break;
    }
    case 'paddingEnd': {
      const cvalue = compileValue('padding', value);
      propsLTR.push(`padding-right: ${cvalue}`);
      propsRTL.push(`padding-left: ${cvalue}`);
      break;
    }
    case 'paddingVertical': {
      const cvalue = compileValue('padding', value);
      propsLTR.push(`padding-top: ${cvalue}`);
      propsLTR.push(`padding-bottom: ${cvalue}`);
      break;
    }
    case 'paddingHorizontal': {
      const cvalue = compileValue('padding', value);
      propsLTR.push(`padding-left: ${cvalue}`);
      propsLTR.push(`padding-right: ${cvalue}`);
      break;
    }
    case 'marginStart': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-left: ${cvalue}`);
      propsRTL.push(`margin-right: ${cvalue}`);
      break;
    }
    case 'marginEnd': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-right: ${cvalue}`);
      propsRTL.push(`margin-left: ${cvalue}`);
      break;
    }
    case 'marginVertical': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-top: ${cvalue}`);
      propsLTR.push(`margin-bottom: ${cvalue}`);
      break;
    }
    case 'marginHorizontal': {
      const cvalue = compileValue('margin', value);
      propsLTR.push(`margin-left: ${cvalue}`);
      propsLTR.push(`margin-right: ${cvalue}`);
      break;
    }
    case 'startOffset': {
      const cvalue = compileValue('left', value);
      propsLTR.push(`left: ${cvalue}`);
      propsRTL.push(`right: ${cvalue}`);
      break;
    }
    case 'endOffset': {
      const cvalue = compileValue('right', value);
      propsLTR.push(`right: ${cvalue}`);
      propsRTL.push(`left: ${cvalue}`);
      break;
    }
    default:
      const cname = compileName(name);
      const cvalue = compileValue(name, value);
      propsLTR.push(`${cname}: ${cvalue}`);
  }
}

export function compileValue(name: string, value: mixed): string {
  let isNonNumeric = isNaN(value);
  if (
    isNonNumeric ||
    value === 0 ||
    (UnitlessNumberPropSet.hasOwnProperty(name) && UnitlessNumberPropSet[name])
  ) {
    return '' + ((value: any): string); // cast to string
  } else {
    return ((value: any): string) + 'px';
  }
}

const isEmpty = value => value == null || value === '' || value === false;
export const compileName = memoizeStringOnly(name => hyphenateStyleName(name));
