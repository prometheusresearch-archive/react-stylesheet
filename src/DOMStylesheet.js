/**
 * @copyright 2015 Prometheus Research, LLC
 */

import memoize                  from 'memoize-decorator';
import addStyleToDOM            from 'style-loader/addStyles';
import CSSPropertyOperations    from 'react/lib/CSSPropertyOperations';
import dangerousStyleValue      from 'react/lib/dangerousStyleValue';
import {isArray, isPlainObject,
        toDashCase, uniqueID}   from './utilities';

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
export function create(spec, id = '') {
  id = uniqueID(id ? `Style_${id}` : 'Style');
  return new DOMStylesheet(parseSpecToStyle(spec), id);
}

/**
 * Check if object is a valida stylesheet.
 */
export function isStylesheet(obj) {
  return obj instanceof DOMStylesheet;
}

/**
 * Produce a new stylesheet by overriding an existing one with a new stylesheet
 * spec.
 */
function overrideStylesheet(stylesheet, override, id) {
  override = isStylesheet(override) ?
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

function sanitizeID(id) {
  return id.replace(/[^0-9a-zA-Z\-_]/g, '_');
}

/**
 * DOM stylesheet is a collection of classes which are applied to a single DOM
 * element.
 */
class DOMStylesheet {

  constructor(style, id) {
    this.style = style;
    this.id = sanitizeID(id);

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

  override(spec, id) {
    return overrideStylesheet(this, spec, id);
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
      styleBase[key] = compileValue(key, item);
    }
  }
  return style;
}

/**
 * Compile style into CSS string with mapping from variant names to CSS class
 * names.
 */
function compileStyle(style, id, variants = []) {
  let mapping = {};
  let css = [];
  let variant = variants.length === 0 ? null : variants[variants.length - 1];
  for (let key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }
    let value = style[key];
    if (key === BASE) {
      if (variant !== null) {
        let selector = compileSelector(id, variants);
        let [className] = selector;
        mapping[variant] = mapping[variant] || {};
        mapping[variant][CLASSNAME] = className;
        css.push(compileClass(compileSelector(id, variants), value));
      } else {
        css.push(compileClass([id], value));
        mapping[CLASSNAME] = id;
      }
    } else {
      let subResult = compileStyle(value, id, variants.concat(key));
      mapping[key] = subResult.mapping;
      css = css.concat(subResult.css);
    }
  }
  return {css, mapping};
}

/**
 * Compile class name and rule set into CSS class.
 */
function compileClass(selector, ruleSet) {
  let css = `${selector.map(item => '.' + item).join(', ')} { ${CSSPropertyOperations.createMarkupForStyles(ruleSet)} }`;
  return css;
}

function compileSelector(id, path) {
  if (path.length === 0) {
    return [id];
  }

  if (!SUPPORTED_PSEUDO_CLASSES[path[path.length - 1]]) {
    return [id + '--' + path.join('--')];
  }

  let cutIndex = -1;
  for (let i = path.length - 1; i >= 0; i--) {
    if (!SUPPORTED_PSEUDO_CLASSES[path[i]]) {
      cutIndex = i;
      break;
    }
  }

  let staticPath = path.slice(0, cutIndex + 1);
  staticPath.unshift(id);
  let variantPath = path.slice(cutIndex + 1);

  let selector = [];

  selector.push(staticPath.concat(variantPath).join('--'));
  for (let i = 0; i < variantPath.length; i++) {
    selector.push(staticPath.join('--') + ':' + variantPath.slice(i).map(toDashCase).join(':'));
    staticPath.push(variantPath[i]);
  }

  return selector;
}

function compileValue(key, value) {
  let compiled = '';
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (i === 0) {
        compiled += dangerousStyleValue(key, liftValue(value[i]));
      } else {
        compiled += ';' + key + ':' + dangerousStyleValue(key, liftValue(value[i]));
      }
    }
  } else {
    compiled = liftValue(value);
  }
  return compiled;
}

function liftValue(value) {
  return value && value.toCSS ? value.toCSS() : value;
}
