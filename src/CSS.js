/**
 * @copyright 2015, Prometheus Research, LLC
 */

import {isString, toDashCase} from './utilities';

function keyMirrorDashCase(obj) {
  let result = {};
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    result[key] = toDashCase(key);
  }
  return result;
}

export function boxShadow(offsetX, offsetY, blurRadius, spreadRadius, color) {
  if (color === none || color === null) {
    return none;
  }
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;
}

export function insetBoxShadow(offsetX, offsetY, blurRadius, spreadRadius, color) {
  if (color === none || color === null) {
    return none;
  }
  return `inset ${boxShadow(offsetX, offsetY, blurRadius, spreadRadius, color)}`;
}

export function textShadow(offsetX, offsetY, blurRadius, color) {
  if (color === none || color === null) {
    return none;
  }
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${color}`;
}

export function rgba(r, g, b, a) {
  if (b === undefined && a === undefined) {
    a = g;
    g = r;
    b = r;
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function rgb(r, g, b) {
  if (g === undefined && b === undefined) {
    g = r;
    b = r;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export function border(width, style, color) {
  if (color === undefined) {
    color = style;
    style = border.solid;
  }
  if (color === none || color === null) {
    return none;
  }
  return `${width}px ${style} ${color}`;
}

border.solid = 'solid';

export function linearGradient(direction, ...colorStops) {
  colorStops = colorStops
    .map(p => isString(p) ? p : `${p.color} ${p.value}`)
    .join(', ');
  return `linear-gradient(${direction}, ${colorStops})`;
}

export function transform(duration) {
  return `transform ${duration}s`;
}

export function translate3d(x, y, z) {
  return `translate3d(${x}px, ${y}px, ${z}px)`;
}

function sizeSeq(...args) {
  return args
    .map(arg => isString(arg) ? arg : `${arg}px`)
    .join(' ');
}

export let padding = sizeSeq;
export let margin = sizeSeq;

export let position = keyMirrorDashCase({
  absolute: true,
  relative: true,
  fixed: true,
});

export let display = keyMirrorDashCase({
  block: true,
  inlineBlock: true,
  flex: true,
  inlineFlex: true,
  inline: true,
});

export let cursor = keyMirrorDashCase({
  pointer: true,
  default: true,
});

export let overflow = keyMirrorDashCase({
  auto: true,
  hidden: true,
  scroll: true,
});

export let textAlign = keyMirrorDashCase({
  center: true,
  left: true,
  right: true,
});

export let verticalAlign = keyMirrorDashCase({
  middle: true,
  baseline: true,
  sub: true,
  super: true,
  top: true,
  bottom: true,
});

export let fontWeight = keyMirrorDashCase({
  bold: true,
  normal: true,
});

export let touchAction = keyMirrorDashCase({
  manipulation: true,
});

export let none = 'none';

export let auto = 'auto';

export let whiteSpace = keyMirrorDashCase({
  nowrap: true
});

export let textDecoration = keyMirrorDashCase({
  none: true,
  underline: true,
});

export let textOverflow = keyMirrorDashCase({
  ellipsis: true,
});

export let color = keyMirrorDashCase({
  transparent: true,
});
