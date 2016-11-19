/**
 * Copyright 2016-present, Prometheus Research, LLC. MIT License
 *
 * @flow
 */

import UnitlessNumberPropSet from './UnitlessNumberPropSet';

export default function expand(style: Object): Object {
  let expandedStyle = {};
  for (let name in style) {
    if (!style.hasOwnProperty(name)) {
      continue;
    }
    Object.assign(expandedStyle, expandProp(name, style[name]));
  }
  return expandedStyle;
}

/**
 * Compile name: value property.
 */
function expandProp(name: string, value: mixed): Object {
  switch (name) {

    // extended variants

    case 'padding':
      if (typeof value === 'object' && value != null) {
        return compileLayoutSyntax('padding', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'margin':
      if (typeof value === 'object' && value != null) {
        return compileLayoutSyntax('margin', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'border':
      if (typeof value === 'object' && value != null) {
        return expandBorderSyntax('border', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'borderLeft':
      if (typeof value === 'object' && value != null) {
        return expandBorderSyntax('borderLeft', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'borderTop':
      if (typeof value === 'object' && value != null) {
        return expandBorderSyntax('borderTop', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'borderBottom':
      if (typeof value === 'object' && value != null) {
        return expandBorderSyntax('borderBottom', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'borderRight':
      if (typeof value === 'object' && value != null) {
        return expandBorderSyntax('borderRight', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'transition':
      return compileTransition(value);

    case 'outline':
      if (typeof value === 'object' && value != null) {
        return expandBorderSyntax('outline', value);
      } else {
        return expandSingleProp(name, value);
      }

    case 'boxShadow':
      return compileBoxShadow(value);

    case 'textShadow':
      if (typeof value === 'object' && value != null) {
        return compileTextShadowSyntax(value);
      } else {
        return expandSingleProp(name, value);
      }

    default:
      return expandSingleProp(name, value);
  }
}

function expandSingleProp(name, value) {
  return {
    [name]: Array.isArray(value) ? value : compileValue(name, value)
  };
}

function expandBorderSyntax(name, value) {
  let {
    width = 'medium',
    style = 'none',
    color = 'currentColor',
  } = value;
  return {
    [name]: `${compileValue('borderWidth', width)} ${String(style)} ${String(color)}`
  };
}

function compileLayoutSyntax(name, value) {
  let {
    vertical = 0,
    horizontal = 0,
    top = vertical,
    right = horizontal,
    bottom = vertical,
    left = horizontal,
  } = value;
  return {
    [name]: `${compileValue('margin', top)} ${compileValue('margin', right)}  ${compileValue('margin', bottom)} ${compileValue('margin', left)}`
  };
}

function compileBoxShadow(value) {
  return compileValueWith('boxShadow', value, compileBoxShadowValueSyntax);
}

function compileBoxShadowValueSyntax(value) {
  let {x = 0, y = 0, blur = 0, spread = 0, color = '#000', inset = false} = value;
  let css = `${String(x)}px ${String(y)}px ${String(blur)}px ${String(spread)}px ${String(color)}`;
  if (inset) {
    css = 'inset ' + css;
  }
  return css;
}

function compileTextShadowSyntax(value) {
  let {x = 0, y = 0, blur = 0, color = '#000'} = value;
  let css = `${String(x)}px ${String(y)}px ${String(blur)}px ${String(color)}`;
  return expandSingleProp('textShadow', css);
}

function compileTransition(value) {
  return compileValueWith('transition', value, compileTransitionValueSyntax);
}

function compileTransitionValueSyntax(value) {
  let {
    property = 'all',
    duration = 0,
    timingFunction = 'ease',
    delay = 0,
  } = value;
  return `${String(property)} ${String(duration)}s ${String(timingFunction)} ${String(delay)}s`;
}

function compileValueWith(name, value, compileValue) {
  if (typeof value === 'object' && value != null) {
    let css = Array.isArray(value)
      ? value.map(compileValue).join(', ')
      : compileValue(value);
    return expandSingleProp(name, css);
  } else {
    return expandSingleProp(name, value);
  }
}

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
    UnitlessNumberPropSet.hasOwnProperty(name) && UnitlessNumberPropSet[name]
  ) {
    return '' + ((value: any): string); // cast to string
  } else {
    return ((value: any): string) + 'px';
  }
}
