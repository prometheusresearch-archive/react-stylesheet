/**
 * @flow
 */

import type {Stylesheet, ClassNameMapping} from './Stylesheet';

import createHash from 'murmurhash-js/murmurhash3_gc';
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';
import dangerousStyleValue from 'react/lib/dangerousStyleValue';

/**
 * Variant names we want to see compiled as CSS pseudo classes.
 */
const SUPPORTED_PSEUDO_CLASSES = {
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
  stylesheet: Stylesheet
): {id: string; css: string, mapping: ClassNameMapping}{

  let id = createHash(JSON.stringify(stylesheet));
  let mapping = {};
  let css = [];

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
    let tracePseudo = [];
    let variantMapping = mapping;
    for (let i = 0; i < variant.length; i++) {
      if (variant[i] === 'base' && variant.length > 1) {
        throw new Error('"base" should not be used as a part of a complex variant');
      }
      if (SUPPORTED_PSEUDO_CLASSES[variant[i]]) {
        seenPseudoClass = true;
        tracePseudo.push(variant[i]);
      } else if (seenPseudoClass) {
        console.log(i, variant);
        throw new Error('variant could not be used after a pseudo class');
      }

      if (variant[i] !== 'base' && !seenPseudoClass) {
        variantMapping.then = variantMapping.then || {};
        variantMapping.then[variant[i]] = variantMapping.then[variant[i]] || {};
        variantMapping = variantMapping.then[variant[i]];
        trace.push(variant[i]);
      }

      if (i === variant.length - 1) {
        let className = `${trace.join('-')}-${id}`;
        css.push(`
.${tracePseudo.length === 0 ? className : className + ':' + tracePseudo.join(':')} {
  ${CSSPropertyOperations.createMarkupForStyles(style)}
}
        `.trim());
        variantMapping.className = className;
      }
    }

  }

  return {id, css: css.join('\n'), mapping};
}
