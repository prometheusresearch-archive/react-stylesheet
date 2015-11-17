/**
 * @copyright 2015 Prometheus Research, LLC
 */

import memoize                  from 'memoize-decorator';
import addStyleToDOM            from 'style-loader/addStyles';
import CSSPropertyOperations    from 'react/lib/CSSPropertyOperations';
import dangerousStyleValue      from 'react/lib/dangerousStyleValue';
import {isArray, isPlainObject,
        toDashCase, uniqueID}   from './Utils';

const BASE = 'base';

const DEFAULT_STYLE = {
  boxSizing: 'border-box'
};

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

export function createStylesheet(spec, id = '') {
  id = uniqueID(id ? `Style_${id}` : 'Style');
  return new DOMStylesheet(_parse(spec), id);
}

export function isValidStylesheet(obj) {
  return obj instanceof DOMStylesheet;
}

export function overrideStylesheet(stylesheet, spec, id) {
  let style = isValidStylesheet(spec) ? spec.style : _parse(spec);
  let nextStyle = {...stylesheet.style};
  for (let key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }
    if (key === BASE) {
      nextStyle[key] = {...nextStyle[key], ...style[key]};
    } else {
      let value = style[key];
      nextStyle[key] = {...nextStyle[key]};
      for (let sKey in value) {
        if (!value.hasOwnProperty(sKey)) {
          continue;
        }
        nextStyle[key][sKey] = {...value[sKey]};
      }
    }
  }
  id = uniqueID(id ? `Style_${id}` : 'Style');
  return new DOMStylesheet(nextStyle, id);
}


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
    return _compile(this.style, this.id);
  }

  get css() {
    return this._compiled.css;
  }

  get className() {
    return this._compiled.className;
  }

  asClassName(variant = {}) {
    return _variantToClassName(this.className, variant).join(' ');
  }

  use() {
    this._refs = this._refs + 1;
    if (this._disposeTimer !== null) {
      clearTimeout(this._disposeTimer);
      this._disposeTimer = null;
    }
    if (this._remove === null) {
      this._remove = addStyleToDOM(this.css);
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


function _variantToClassName(mapping, variant, prefix = '') {
  let classList = prefix === '' ? [mapping[BASE]] : [];

  for (let key in variant) {
    if (!variant.hasOwnProperty(key) || !variant[key]) {
      continue;
    }
    let classNameKey = `${prefix}${key}`;
    if (mapping[classNameKey]) {
      classList.push(mapping[classNameKey]);
    }
    if (typeof variant[key] === 'object' && variant[key] !== null) {
      classList = classList.concat(_variantToClassName(mapping, variant[key], `${prefix}${key}--`));
    }
  }
  return classList;
}

/**
 * Parse style spec into style object.
 */
function _parse(spec, root = true) {
  let styleBase = root ? {...DEFAULT_STYLE} : {};
  let style = {[BASE]: styleBase};
  for (let key in spec) {
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    let item = spec[key];
    if (isPlainObject(item)) {
      style[key] = _parse(item, false);
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
function _compile(
    style, id,
    result = {className: {}, css: []},
    variantPath = [],
    variant = null
  ) {
  for (let key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }
    let value = style[key];
    if (key === BASE) {
      if (variant !== null) {
        let className = _className(id, variantPath, variant);
        result.className[_variantKey(variantPath, variant)] = className;


        if (SUPPORTED_PSEUDO_CLASSES[variant]) {
          let pseudoClassName = _className(id, variantPath, variant, true);
          result.css.push(_emitClass(`.${className}, .${pseudoClassName}`, value));
        } else {
          result.css.push(_emitClass(`.${className}`, value));
        }
      } else {
        result.css.push(_emitClass(`.${id}`, value));
        result.className[BASE] = id;
      }
    } else {
      _compile(
        value,
        id,
        result,
        variant !== null ? variantPath.concat(variant) : variantPath,
        key,
      );
    }
  }
  return {css: [[id, result.css.join('\n')]], className: result.className};
}

/**
 * Compile class name and rule set into CSS class.
 */
function _emitClass(className, ruleSet) {
  let css = `${className} { ${CSSPropertyOperations.createMarkupForStyles(ruleSet)} }`;
  return css;
}

/**
 * Create a CSS class name.
 */
function _className(id, variantPath, variant, asPseudo = false) {
  let className = `${id}`;
  if (variantPath.length > 0) {
    className = className + `--${variantPath.join('--')}`;
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
 * Create a variant key.
 */
function _variantKey(variantPath, variant) {
  return variantPath.concat(variant).join('--');
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
