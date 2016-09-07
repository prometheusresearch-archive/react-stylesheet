/**
 * @copyright 2015+, Prometheus Research, LLC
 * @flow
 */

import invariant from 'invariant';

export function boxShadow(
  offsetX: number,
  offsetY: number,
  blurRadius: number,
  spreadRadius: number,
  color: string
): string {
  if (color === none || color === null) {
    return none;
  }
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;
}

export function insetBoxShadow(
  offsetX: number,
  offsetY: number,
  blurRadius: number,
  spreadRadius: number,
  color: string
): string {
  if (color === none || color === null) {
    return none;
  }
  return `inset ${boxShadow(offsetX, offsetY, blurRadius, spreadRadius, color)}`;
}

export function textShadow(
  offsetX: number,
  offsetY: number,
  blurRadius: number,
  color: string
): string {
  if (color === none || color === null) {
    return none;
  }
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${color}`;
}

export function rgba(r: number, g: number, b?: number, a?: number): string {
  if (b == null && a == null) {
    a = g;
    g = r;
    b = r;
  }
  if (b == null || a == null) {
    invariant(false, 'Invalid color format: rgba(%s, %s, %s, %s)', r, g, b, a);
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function rgb(r: number, g?: number, b?: number) {
  if (g == null && b == null) {
    g = r;
    b = r;
  }
  if (g == null || b == null) {
    invariant(false, 'Invalid color format: rgb(%s, %s, %s)', r, g, b);
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export function border(width: number, style: string, color?: string): string {
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

export function linearGradient(
  direction: string,
  ...colorStops: Array<{color: string; value: string}>
): string {
  let colorStopsStr = colorStops
    .map(p => typeof p === 'string' ? p : `${p.color} ${p.value}`)
    .join(', ');
  return `linear-gradient(${direction}, ${colorStopsStr})`;
}

export function transform(duration: string): string {
  return `transform ${duration}s`;
}

export function translate3d(x: number, y: number, z: number): string {
  return `translate3d(${x}px, ${y}px, ${z}px)`;
}

function sizeSeq(...args: Array<number>): string {
  return args
    .map(arg => typeof arg === 'string' ? arg : `${arg}px`)
    .join(' ');
}

export function multi(...args: Array<string>): string {
  return args.filter(item => item !== none).join(', ');
}

export let padding = sizeSeq;
export let margin = sizeSeq;

export let position = {
  absolute: 'absolute',
  relative: 'relative',
  fixed: 'fixed',
};

export let display = {
  block: 'block',
  inlineBlock: 'inline-block',
  flex: 'flex',
  inlineFlex: 'inline-flex',
  inline: 'inline',
};

export let cursor = {
  pointer: 'pointer',
  default: 'default',
};

export let overflow = {
  auto: 'auto',
  hidden: 'hidden',
  scroll: 'scroll',
};

export let textAlign = {
  center: 'center',
  left: 'left',
  right: 'right',
};

export let verticalAlign = {
  middle: 'middle',
  baseline: 'baseline',
  sub: 'sub',
  super: 'super',
  top: 'top',
  bottom: 'bottom',
};

export let fontWeight = {
  bold: 'bold',
  normal: 'normal',
};

export let touchAction = {
  manipulation: 'manipulation',
};

export let none = 'none';

export let auto = 'auto';

export let whiteSpace = {
  nowrap: 'nowrap',
};

export let textDecoration = {
  none: 'none',
  underline: 'underline',
};

export let textOverflow = {
  ellipsis: 'ellipsis',
};

export let color = {
  transparent: 'transparent',
};
