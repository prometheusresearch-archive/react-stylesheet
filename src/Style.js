/**
 * @copyright 2015 Prometheus Research, LLC
 */

import addStyleToDOM            from 'style-loader/addStyles';
import CSSPropertyOperations    from 'react/lib/CSSPropertyOperations';
import dangerousStyleValue      from 'react/lib/dangerousStyleValue';
import {isArray, isPlainObject,
        toDashCase, uniqueID}   from './Utils';

const SELF = 'self';

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

export default class Style {

  static create(spec, id = '') {
    id = uniqueID(id ? `Style_${id}` : 'Style');
    return new Style(convertSpecToStyle(spec), id);
  }

  static is(obj) {
    return obj instanceof Style;
  }

  constructor(style, id) {
    let {css, className} = compileStylesheet(style, id);
    this.style = style;
    this.id = id;
    this.css = css;
    this.className = className;

    this._refs = 0;
    this._remove = null;
    this._disposePerform = this._disposePerform.bind(this);
    this._disposeTimer = null;
  }

  override(spec, id) {
    let style = Style.is(spec) ? spec.style : convertSpecToStyle(spec);
    let nextStyle = {...this.style};
    for (let key in style) {
      if (!style.hasOwnProperty(key)) {
        continue;
      }
      if (key === SELF) {
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
    return new Style(nextStyle, id);
  }

  asClassName(state = {}) {
    let className = [];
    for (let key in this.className) {
      if (!this.className.hasOwnProperty(key)) {
        continue;
      }
      if (key === SELF || state[key]) {
        className.push(this.className[key]);
      }
    }
    return className.join(' ');
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

function convertValue(key, value) {
  if (isArray(value) && value.length > 0) {
    let rest = value.slice(1).map(v => `${key}:${dangerousStyleValue(key, v)}`);
    value = [dangerousStyleValue(key, value[0])].concat(rest).join(';');
  }
  return value;
}

function convertSpecToStyle(spec, addDefaultStyle = true, recurse = true) {
  let style = {
    [SELF]: addDefaultStyle ? {...DEFAULT_STYLE} : {}
  };

  for (let key in spec) {
    if (!spec.hasOwnProperty(key)) {
      continue;
    }
    let value = spec[key];
    if (isPlainObject(value)) {
      if (recurse) {
        style[key] = convertSpecToStyle(value, false, false);
      } else {
        style[key] = convertValue(key, value);
      }
    } else {
      style[SELF][key] = convertValue(key, value);
    }
  }

  return style;
}

function compileStylesheet(style, id) {
  let mapping = {};
  let compiled = [];

  for (let key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }
    let value = style[key];

    let css = key === SELF ?
      CSSPropertyOperations.createMarkupForStyles(value) :
      CSSPropertyOperations.createMarkupForStyles(value[SELF]);

    if (SUPPORTED_PSEUDO_CLASSES[key]) {
      compiled.push(compilePseudoClass(mapping, css, key, id));
    } else {
      compiled.push(compileClass(mapping, css, key, id));
    }
    if (key !== SELF) {
      for (let sKey in value) {
        if (!value.hasOwnProperty(sKey)) {
          continue;
        }
        let sValue = value[sKey];
        if (sKey === SELF || !SUPPORTED_PSEUDO_CLASSES[sKey]) {
          continue;
        }
        let css = CSSPropertyOperations.createMarkupForStyles(sValue);
        compiled.push(compilePseudoClass(mapping, css, sKey, `${id}--${key}`, false));
      }
    }
  }

  compiled = compiled.join('\n');

  return {css: [[id, compiled]], className: mapping};
}

function compileClass(mapping, css, name, id) {
  let className = name === SELF ? id : id + '--' + name;
  mapping[name] = className;
  return `.${className} { ${css} }`;
}

function compilePseudoClass(mapping, css, name, id, compileAsRegular = true) {
  let pseudoClassName = `${id}:${toDashCase(name)}`;
  if (compileAsRegular) {
    let className = `${id}--${name}`;
    mapping[name] = className;
    return `.${className}, .${pseudoClassName} { ${css} }`;
  } else {
    return `.${pseudoClassName} { ${css} }`;
  }
}
