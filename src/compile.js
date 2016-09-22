/**
 * @flow
 */

import type {StylesheetSpec} from './Stylesheet';

import prefix from 'inline-style-prefix-all';
import createHash from 'murmurhash-js/murmurhash3_gc';
import CSSProperty from 'react/lib/CSSProperty';
import hyphenateStyleName from 'fbjs/lib/hyphenateStyleName';
import memoizeStringOnly from 'fbjs/lib/memoizeStringOnly';

export type ClassNameMapping = {
  className: string;
  then?: {[name: string]: ClassNameMapping};
};

export type CompileResult = {
  id: string;
  css: string;
  mapping: ClassNameMapping;
};

const UNITLESS_NUMBER = CSSProperty.isUnitlessNumber;

export const PSEUDO_CLASS = {
  focus: true,
  hover: true,
  active: true,
  checked: true,
  default: true,
  disabled: true,
  empty: true,
  enabled: true,
  firstChild: true,
  firstOfType: true,
  fullscreen: true,
  indeterminate: true,
  invalid: true,
  lastChild: true,
  left: true,
  link: true,
  onlyChild: true,
  optional: true,
  required: true,
  right: true,
  root: true,
  scope: true,
  target: true,
  valid: true,
  visited: true,
};

export default function compile(
  name: string,
  stylesheet: StylesheetSpec
): CompileResult {

  let id = createHash(JSON.stringify(stylesheet));
  let mapping = {};
  let css = [];

  // If base is not defined we need to define it so defaults style kicks in.
  if (stylesheet.base == null) {
    stylesheet = {
      base: {},
      ...stylesheet,
    };
  }

  for (let variant in stylesheet) {

    let style = stylesheet[variant];
    if (variant.indexOf('_') > -1) {
      variant = variant.split('_');
    } else {
      variant = [variant];
    }
    variant.sort();

    let seenPseudoClass = false;
    let trace = [name];
    let variantMapping = mapping;
    for (let i = 0; i < variant.length; i++) {
      if (variant[i] === 'base' && variant.length > 1) {
        throw new Error('"base" should not be used as a part of a complex variant');
      }

      if (variant[i] !== 'base' && !seenPseudoClass) {
        variantMapping.then = variantMapping.then || {};
        variantMapping.then[variant[i]] = variantMapping.then[variant[i]] || {};
        variantMapping = variantMapping.then[variant[i]];
        trace.push(variant[i]);
      }

      if (i === variant.length - 1) {
        if (variant[i] === 'base') {
          style = {boxSizing: 'border-box', ...style};
        }
        let className = `${trace.join('-')}-${id}`;
        css.push(compileStyle(className, style));
        variantMapping.className = className;
      }
    }

  }

  return {id, css: css.join('\n'), mapping};
}

function compileStyle(className, style) {
  let css = [];
  let cssList = [];
  let ownStyle = {};

  for (let name in style) {
    let value = style[name];
    if (!style.hasOwnProperty(name)) {
      continue;
    }
    if (PSEUDO_CLASS.hasOwnProperty(name) && PSEUDO_CLASS[name]) {
      // this is pseudo class, recurse
      cssList.push(compileStyle(className + ':' + name, value));
    } else if (!isEmpty(value)) {
      ownStyle[name] = value;
    }
  }

  ownStyle = prefix(ownStyle);

  for (let name in ownStyle) {
    let value = ownStyle[name];
    let cssName = compileName(name);
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        let cssValue = compileValue(name, value[i]);
        css.push(`${cssName}:${cssValue}`);
      }
    } else {
      let cssValue = compileValue(name, value);
      css.push(`${cssName}:${cssValue}`);
    }
  }

  if (css.length > 0) {
    return [`.${className} { ${css.join(';')}; }`].concat(cssList).join('\n');
  } else {
    return cssList.join('\n');
  }
}

function isEmpty(value) {
  return (
    value == null ||
    value === '' ||
    value === false
  );
}

/**
 * Compile style prop name.
 *
 * Based on code in React, see react/lib/CSSPropertyOperations module.
 */
let compileName = memoizeStringOnly(name => hyphenateStyleName(name));

/**
 * Compile style prop value.
 *
 * Based on code in React, see react/lib/dangerousStyleValue module.
 */
function compileValue(name: string, value: mixed): string {
  let isNonNumeric = isNaN(value);
  if (
    isNonNumeric ||
    value === 0 ||
    UNITLESS_NUMBER.hasOwnProperty(name) && UNITLESS_NUMBER[name]
  ) {
    return '' + ((value: any): string); // cast to string
  } else {
    return ((value: any): string) + 'px';
  }
}
