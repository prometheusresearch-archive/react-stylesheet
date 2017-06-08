/**
 * Copyright 2016-present, Prometheus Research, LLC. MIT License
 *
 * @flow
 */

import type {StylesheetSpec} from '../Stylesheet';

import prefix from 'inline-style-prefix-all';
import createHash from 'murmurhash-js/murmurhash3_gc';
import hyphenateStyleName from 'fbjs/lib/hyphenateStyleName';
import memoizeStringOnly from 'fbjs/lib/memoizeStringOnly';
import PseudoClassSet from './PseudoClassSet';
import expand from './expand';

export type ClassNameMapping = {
  className: string,
  then?: {[name: string]: ClassNameMapping},
};

export type CompileResult = {
  id: string,
  css: string,
  mapping: ClassNameMapping,
};

export default function compile(name: string, stylesheet: StylesheetSpec): CompileResult {
  let id = createHash(name + JSON.stringify(stylesheet));
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

export function compileStyle(
  className: string,
  style: Object,
  important?: boolean = false,
): string {
  let css = [];
  let cssList = [];
  let ownStyle = {};

  for (let name in style) {
    let value = style[name];
    if (!style.hasOwnProperty(name)) {
      continue;
    }
    if (PseudoClassSet.hasOwnProperty(name) && PseudoClassSet[name]) {
      // this is pseudo class, recurse
      cssList.push(compileStyle(className + ':' + compileName(name), value, important));
    } else if (!isEmpty(value)) {
      ownStyle[name] = value;
    }
  }

  ownStyle = expand(ownStyle);
  ownStyle = prefix(ownStyle);

  for (let name in ownStyle) {
    let value = ownStyle[name];
    name = compileName(name);
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        css.push(`${name}:${value[i]}${important ? ' !important' : ''}`);
      }
    } else {
      css.push(`${name}:${value}${important ? ' !important' : ''}`);
    }
  }

  if (css.length > 0) {
    return [`.${className} { ${css.join(';')}; }`].concat(cssList).join('\n');
  } else {
    return cssList.join('\n');
  }
}

function isEmpty(value) {
  return value == null || value === '' || value === false;
}

/**
 * Compile style prop name.
 *
 * Based on code in React, see react/lib/CSSPropertyOperations module.
 */
export function compileName(name: string): string {
  return hyphenateStyleName(name);
}

export let expandStyle = expand;

compileName = memoizeStringOnly(compileName); // eslint-disable-line
