/**
 * CSS properties object model
 *
 * @flow
 */

opaque type CSSColorUnit = string;
export type CSSColor = 'red' | 'yellow' | 'black' | CSSColorUnit;

opaque type CSSMeasureUnit = string;
export type CSSMeasure = number | CSSMeasureUnit;

export type CSSDisplay = 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'inline';
export type CSSPosition = 'absolute' | 'relative' | 'fixed' | 'sticky';

export type CSSPropertySet = {
  color?: ?CSSColor,
  backgroundColor?: ?CSSColor,

  display?: ?CSSDisplay,
  position?: ?CSSPosition,

  width?: ?CSSMeasure,
  height?: ?CSSMeasure,

  top?: ?CSSMeasure,
  bottom?: ?CSSMeasure,
  left?: ?CSSMeasure,
  right?: ?CSSMeasure,
  startOffset?: ?CSSMeasure,
  endOffset?: ?CSSMeasure,

  padding?: ?CSSMeasure,
  paddingLeft?: ?CSSMeasure,
  paddingRight?: ?CSSMeasure,
  paddingTop?: ?CSSMeasure,
  paddingBottom?: ?CSSMeasure,
  paddingStart?: ?CSSMeasure,
  paddingEnd?: ?CSSMeasure,
  paddingVertical?: ?CSSMeasure,
  paddingHorizontal?: ?CSSMeasure,

  margin?: ?CSSMeasure,
  marginLeft?: ?CSSMeasure,
  marginRight?: ?CSSMeasure,
  marginTop?: ?CSSMeasure,
  marginBottom?: ?CSSMeasure,
  marginStart?: ?CSSMeasure,
  marginEnd?: ?CSSMeasure,
  marginVertical?: ?CSSMeasure,
  marginHorizontal?: ?CSSMeasure,

  // TODO: add more here
};

export function em(val: number): CSSMeasureUnit {
  return `${val}em`;
}

export function pcnt(val: number): CSSMeasureUnit {
  return `${val}%`;
}

export function rgb(r: number, g: number, b: number, a?: number) {
  if (a == null) {
    const color = `rgb(${r}, ${g}, ${b})`;
    return (color: CSSColor);
  } else {
    const color = `rgba(${r}, ${g}, ${b}, ${a})`;
    return (color: CSSColor);
  }
}

export function grayscale(n: number) {
  const color = `rgb(${n}, ${n}, ${n})`;
  return (color: CSSColor);
}

export function hex(n: number) {
  if (n <= 0xfff) {
    n = n + 0xfff000;
  }
  const color = '#' + n.toString(16);
  return (color: CSSColor);
}

export type CSSStylesheet = CSSPropertySet & {
  focus?: CSSStylesheet,
  hover?: CSSStylesheet,
  active?: CSSStylesheet,
  checked?: CSSStylesheet,
  default?: CSSStylesheet,
  disabled?: CSSStylesheet,
  empty?: CSSStylesheet,
  enabled?: CSSStylesheet,
  firstChild?: CSSStylesheet,
  firstOfType?: CSSStylesheet,
  fullscreen?: CSSStylesheet,
  indeterminate?: CSSStylesheet,
  invalid?: CSSStylesheet,
  lastChild?: CSSStylesheet,
  lastOfType?: CSSStylesheet,
  link?: CSSStylesheet,
  onlyChild?: CSSStylesheet,
  optional?: CSSStylesheet,
  required?: CSSStylesheet,
  root?: CSSStylesheet,
  scope?: CSSStylesheet,
  target?: CSSStylesheet,
  valid?: CSSStylesheet,
  visited?: CSSStylesheet,
};
