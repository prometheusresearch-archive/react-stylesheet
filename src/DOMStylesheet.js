/**
 * @copyright 2015 Prometheus Research, LLC
 */

import memoize                  from 'memoize-decorator';
import addStyleToDOM            from 'style-loader/addStyles';
import CSSPropertyOperations    from 'react/lib/CSSPropertyOperations';
import dangerousStyleValue      from 'react/lib/dangerousStyleValue';
import {isArray, isPlainObject,
        toDashCase, uniqueID}   from './Utils';

/**
 * Special key which designates the rules which should be applied even if no
 * variant is being active.
 */
const BASE = 'base';

/**
 * Special key which is used to store className in mapping.
 */
const CLASSNAME = 'className';

/**
 * Styles we want to be added to every CSS class.
 */
const DEFAULT_STYLE = {
  boxSizing: 'border-box'
};

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

/**
 * Create a new stylesheet from stylesheet spec.
 */
export function createStylesheet(spec, id = '') {
  id = uniqueID(id ? `Style_${id}` : 'Style');
  return new DOMStylesheet(parseSpecToStyle(spec), id);
}

/**
 * Check if object is a valida stylesheet.
 */
export function isValidStylesheet(obj) {
  return obj instanceof DOMStylesheet;
}

/**
 * Produce a new stylesheet by overriding an existing one with a new stylesheet
 * spec.
 */
export function overrideStylesheet(stylesheet, override, id) {
  override = isValidStylesheet(override) ?
    override.style :
    parseSpecToStyle(override);
  let style = overrideStyle(stylesheet.style, override);
  id = uniqueID(id ? `Style_${id}` : 'Style');
  return new DOMStylesheet(style, id);
}

function overrideStyle(style, override) {
  let nextStyle = {...style};
  for (let key in override) {
    if (!override.hasOwnProperty(key)) {
      continue;
    }
    if (key === BASE) {
      nextStyle[key] = {...nextStyle[key], ...override[key]};
    } else {
      nextStyle[key] = overrideStyle(nextStyle[key], override[key]);
    }
  }
  return nextStyle;
}

/**
 * DOM stylesheet is a collection of classes which are applied to a single DOM
 * element.
 */
class DOMStylesheet {

  constructor(style, id) {
    this.style = style;
    this.id = id;

    this._refs = 0;
    this._remove = null;
    this._disposePerform = this._disposePerform.bind(this);
    this._disposeTimer = null;
  }

  @memoize
  get _compiled() {
    return compileStyle(this.style, this.id);
  }

  get css() {
    return this._compiled.css;
  }

  get mapping() {
    return this._compiled.mapping;
  }

  asClassName(variant = {}) {
    return resolveVariantToClassName(this.mapping, variant).join(' ');
  }

  use() {
    this._refs = this._refs + 1;
    if (this._disposeTimer !== null) {
      clearTimeout(this._disposeTimer);
      this._disposeTimer = null;
    }
    if (this._remove === null) {
      this._remove = addStyleToDOM([[this.id, this.css.join('\n')]]);
    }
    return this;
  }

  dispose() {
    this._refs = this._refs - 1;
    if (this._disposeTimer === null) {
      this._disposeTimer = setTimeout(this._disposePerform, 0);
    }
    return this;
  }

  _disposePerform() {
    if (this._refs < 1) {
      this._remove();
      this._remove = null;
    }
  }

}

/**
 * Resolve variant to CSS class name.
 */
function resolveVariantToClassName(mapping, variant) {
  let classList = [];

  for (let key in mapping) {
    if (key === CLASSNAME) {
      classList.push(mapping[key]);
    } else if (variant[key]) {
      let subClassList = resolveVariantToClassName(mapping[key], variant);
      for (let i = 0; i < subClassList.length; i++) {
        classList.push(subClassList[i]);
      }
    }
  }

  return classList;
}

/**
 * Parse style spec to style object.
 */
function parseSpecToStyle(spec, root = true) {
  let styleBase = root ? {...DEFAULT_STYLE} : {};
  let style = {[BASE]: styleBase};
  for (let key in spec) {
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    let item = spec[key];
    if (isPlainObject(item)) {
      style[key] = parseSpecToStyle(item, false);
    } else {
      styleBase[key] = _value(key, item);
    }
  }
  return style;
}

/**
 * Compile style into CSS string with mapping from variant names to CSS class
 * names.
 */
function compileStyle(style, id, path = [], variant = null) {
  let mapping = {};
  let css = [];
  for (let key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }
    let value = style[key];
    if (key === BASE) {
      if (variant !== null) {
        let className = _className(id, path, variant);
        mapping[variant] = mapping[variant] || {};
        mapping[variant][CLASSNAME] = className;

        if (SUPPORTED_PSEUDO_CLASSES[variant]) {
          let pseudoClassName = _className(id, path, variant, true);
          css.push(compileClass(`.${className}, .${pseudoClassName}`, value));
        } else {
          css.push(compileClass(`.${className}`, value));
        }
      } else {
        css.push(compileClass(`.${id}`, value));
        mapping[CLASSNAME] = id;
      }
    } else {
      let nextPath = variant === null ? path : path.concat(variant);
      let subResult = compileStyle(value, id, nextPath, key);
      mapping[key] = subResult.mapping;
      css = css.concat(subResult.css);
    }
  }
  return {css, mapping};
}

/**
 * Compile class name and rule set into CSS class.
 */
function compileClass(className, ruleSet) {
  let css = `${className} { ${CSSPropertyOperations.createMarkupForStyles(ruleSet)} }`;
  return css;
}

/**
 * Create a CSS class name.
 */
function _className(id, path, variant, asPseudo = false) {
  let className = `${id}`;
  if (path.length > 0) {
    className = className + `--${path.join('--')}`;
  }
  if (variant) {
    if (asPseudo) {
      className = className + `:${toDashCase(variant)}`;
    } else {
      className = className + `--${variant}`;
    }
  }
  return className;
}

/**
 * Process ruleSet value.
 */
function _value(key, value) {
  if (isArray(value) && value.length > 0) {
    let rest = value.slice(1).map(v => `${key}:${dangerousStyleValue(key, v)}`);
    value = [dangerousStyleValue(key, value[0])].concat(rest).join(';');
  }
  return value;
}
