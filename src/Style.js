/**
 * @copyright 2015 Prometheus Research, LLC
 */

import addStyleToDOM          from 'style-loader/addStyles';
import CSSPropertyOperations  from 'react/lib/CSSPropertyOperations';
import isPlainObject          from 'lodash/lang/isPlainObject';
import uniqueId               from 'lodash/utility/uniqueId';
import forEach                from 'lodash/collection/forEach';
import map                    from 'lodash/collection/map';
import filter                 from 'lodash/collection/filter';
import flatten                from 'lodash/array/flatten';
import decamelize             from 'decamelize';

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
    id = uniqueId(id ? `Style_${id}` : 'Style');
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
    forEach(style, (value, name) => {
      if (name === SELF) {
        nextStyle[name] = {...nextStyle[name], ...value};
      } else {
        nextStyle[name] = {...nextStyle[name]};
        forEach(value, (sValue, sName) => {
          nextStyle[name][sName] = {...sValue};
        });
      }
    });
    id = uniqueId(id ? `Style_${id}` : 'Style');
    return new Style(nextStyle, id);
  }

  asClassName(state = {}) {
    return filter(
      this.className,
      (className, key) => key === SELF || state[key]
    ).join(' ');
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

function convertSpecToStyle(spec, addDefaultStyle = true, recurse = true) {
  let style = {
    [SELF]: addDefaultStyle ? {...DEFAULT_STYLE} : {}
  };

  forEach(spec, (value, key) => {
    if (isPlainObject(value)) {
      if (recurse) {
        style[key] = convertSpecToStyle(value, false, false);
      } else {
        style[key] = value;
      }
    } else {
      style[SELF][key] = value;
    }
  });

  return style;
}

function compileStylesheet(style, id) {
  let mapping = {};
  let compiled = [];

  forEach(style, (style, name) => {
    let css = name === SELF ?
      CSSPropertyOperations.createMarkupForStyles(style) :
      CSSPropertyOperations.createMarkupForStyles(style[SELF]);

    if (SUPPORTED_PSEUDO_CLASSES[name]) {
      compiled.push(compilePseudoClass(mapping, css, name, id));
    } else {
      compiled.push(compileClass(mapping, css, name, id));
    }
    if (name !== SELF) {
      forEach(style, (style, sName) => {
        if (sName === SELF || !SUPPORTED_PSEUDO_CLASSES[sName]) {
          return;
        }
        let css = CSSPropertyOperations.createMarkupForStyles(style);
        compiled.push(compilePseudoClass(mapping, css, sName, `${id}--${name}`, false));
      });
    }
  })
  compiled = compiled.join('\n');

  return {css: [[id, compiled]], className: mapping};
}

function compileClass(mapping, css, name, id) {
  let className = name === SELF ? id : id + '--' + name;
  mapping[name] = className;
  return `.${className} { ${css} }`;
}

function compilePseudoClass(mapping, css, name, id, compileAsRegular = true) {
  let pseudoClassName = `${id}:${decamelize(name, '-')}`;
  if (compileAsRegular) {
    let className = `${id}--${name}`;
    mapping[name] = className;
    return `.${className}, .${pseudoClassName} { ${css} }`;
  } else {
    return `.${pseudoClassName} { ${css} }`;
  }
}
