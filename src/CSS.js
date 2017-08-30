/**
 * CSS properties object model
 *
 * @flow
 */

type CSSColorNamed =
  | 'aliceblue'
  | 'antiquewhite'
  | 'aqua'
  | 'aquamarine'
  | 'azure'
  | 'beige'
  | 'bisque'
  | 'black'
  | 'blanchedalmond'
  | 'blue'
  | 'blueviolet'
  | 'brown'
  | 'burlywood'
  | 'cadetblue'
  | 'chartreuse'
  | 'chocolate'
  | 'coral'
  | 'cornflowerblue'
  | 'cornsilk'
  | 'crimson'
  | 'cyan'
  | 'darkblue'
  | 'darkcyan'
  | 'darkgoldenrod'
  | 'darkgray'
  | 'darkgreen'
  | 'darkgrey'
  | 'darkkhaki'
  | 'darkmagenta'
  | 'darkolivegreen'
  | 'darkorange'
  | 'darkorchid'
  | 'darkred'
  | 'darksalmon'
  | 'darkseagreen'
  | 'darkslateblue'
  | 'darkslategray'
  | 'darkslategrey'
  | 'darkturquoise'
  | 'darkviolet'
  | 'deeppink'
  | 'deepskyblue'
  | 'dimgray'
  | 'dimgrey'
  | 'dodgerblue'
  | 'firebrick'
  | 'floralwhite'
  | 'forestgreen'
  | 'fuchsia'
  | 'gainsboro'
  | 'ghostwhite'
  | 'gold'
  | 'goldenrod'
  | 'gray'
  | 'green'
  | 'greenyellow'
  | 'grey'
  | 'honeydew'
  | 'hotpink'
  | 'indianred'
  | 'indigo'
  | 'ivory'
  | 'khaki'
  | 'lavender'
  | 'lavenderblush'
  | 'lawngreen'
  | 'lemonchiffon'
  | 'lightblue'
  | 'lightcoral'
  | 'lightcyan'
  | 'lightgoldenrodyellow'
  | 'lightgray'
  | 'lightgreen'
  | 'lightgrey'
  | 'lightpink'
  | 'lightsalmon'
  | 'lightseagreen'
  | 'lightskyblue'
  | 'lightslategray'
  | 'lightslategrey'
  | 'lightsteelblue'
  | 'lightyellow'
  | 'lime'
  | 'limegreen'
  | 'linen'
  | 'magenta'
  | 'maroon'
  | 'mediumaquamarine'
  | 'mediumblue'
  | 'mediumorchid'
  | 'mediumpurple'
  | 'mediumseagreen'
  | 'mediumslateblue'
  | 'mediumspringgreen'
  | 'mediumturquoise'
  | 'mediumvioletred'
  | 'midnightblue'
  | 'mintcream'
  | 'mistyrose'
  | 'moccasin'
  | 'navajowhite'
  | 'navy'
  | 'oldlace'
  | 'olive'
  | 'olivedrab'
  | 'orange'
  | 'orangered'
  | 'orchid'
  | 'palegoldenrod'
  | 'palegreen'
  | 'paleturquoise'
  | 'palevioletred'
  | 'papayawhip'
  | 'peachpuff'
  | 'peru'
  | 'pink'
  | 'plum'
  | 'powderblue'
  | 'purple'
  | 'rebeccapurple'
  | 'red'
  | 'rosybrown'
  | 'royalblue'
  | 'saddlebrown'
  | 'salmon'
  | 'sandybrown'
  | 'seagreen'
  | 'seashell'
  | 'sienna'
  | 'silver'
  | 'skyblue'
  | 'slateblue'
  | 'slategray'
  | 'slategrey'
  | 'snow'
  | 'springgreen'
  | 'steelblue'
  | 'tan'
  | 'teal'
  | 'thistle'
  | 'tomato'
  | 'turquoise'
  | 'violet'
  | 'wheat'
  | 'white'
  | 'whitesmoke'
  | 'yellow'
  | 'yellowgreen';

opaque type CSSColorUnit = string;
export type CSSColor = CSSColorNamed | CSSColorUnit;

opaque type CSSMeasureUnit = string;
export type CSSMeasure = number | CSSMeasureUnit;

export type CSSDisplay = 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'inline';
export type CSSPosition = 'absolute' | 'relative' | 'fixed' | 'sticky';

export type CSSBackfaceVisibility = 'visible' | 'hidden';

export type CSSBoxSizing = 'content-box' | 'border-box';

export type CSSClear = 'none' | 'left' | 'right' | 'both' | 'inline-start' | 'inline-end';

export type CSSFloat = 'left' | 'right' | 'none' | 'inline-start' | 'inline-end';

export type CSSFlexBasis = 'auto' | CSSMeasure;
export type CSSFlexGrow = number;
export type CSSFlexShrink = number;
export type CSSFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type CSSFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type CSSJustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around';
export type CSSAlignContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'stretch';
export type CSSAlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type CSSAlignSelf =
  | 'auto'
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'baseline'
  | 'stretch';
export type CSSOrder = number;

export type CSSCursor =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'e-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'col-resize'
  | 'row-resize'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out'
  | 'grab'
  | 'grabbing';

export type CSSDirection = 'ltr' | 'rtl';

export type CSSFontWeight =
  | 'normal'
  | 'bold'
  | 'bolder'
  | 'lighter'
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type CSSOpacity = number;

export type CSSOverflow = 'visible' | 'hidden' | 'scroll' | 'auto';

export type CSSPointerEvents =
  | 'auto'
  | 'none'
  | 'visiblePainted'
  | 'visibleFill'
  | 'visibleStroke'
  | 'visible'
  | 'painted'
  | 'fill'
  | 'stroke'
  | 'all'
  | 'inherit';

export type CSSResize = 'none' | 'both' | 'horizontal' | 'vertical';

export type CSSUserSelect = 'auto' | 'text' | 'none' | 'contain' | 'all';

export type CSSVerticalAlign =
  | 'baseline'
  | 'sub'
  | 'super'
  | 'text-top'
  | 'text-bottom'
  | 'middle'
  | 'top'
  | 'bottom'
  | string
  | number;

export type CSSVisibility = 'visible' | 'hidden' | 'collapse';

export type CSSWhiteSpace = 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line';

export type CSSZIndex = number | 'auto';

export type CSSTextAlign =
  | 'start'
  | 'end'
  | 'left'
  | 'right'
  | 'center'
  | 'justify'
  | 'match-parent';

export type CSSUntypedString = string;

export type CSSPropertySet = {
  color?: ?CSSColor,

  display?: ?CSSDisplay,
  position?: ?CSSPosition,

  width?: ?CSSMeasure,
  minWidth?: ?CSSMeasure,
  maxWidth?: ?CSSMeasure,

  height?: ?CSSMeasure,
  minHeight?: ?CSSMeasure,
  maxHeight?: ?CSSMeasure,

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

  animation?: ?CSSUntypedString,
  animationDelay?: ?CSSUntypedString,
  animationDirection?: ?CSSUntypedString,
  animationDuration?: ?CSSUntypedString,
  animationFillMode?: ?CSSUntypedString,
  animationIterationCount?: ?CSSUntypedString,
  animationName?: ?CSSUntypedString,
  animationPlayState?: ?CSSUntypedString,
  animationTimingFunction?: ?CSSUntypedString,

  background?: ?CSSUntypedString,
  backgroundAttachment?: ?CSSUntypedString,
  backgroundBlendMode?: ?CSSUntypedString,
  backgroundClip?: ?CSSUntypedString,
  backgroundColor?: ?CSSColor,
  backgroundImage?: ?CSSUntypedString,
  backgroundOrigin?: ?CSSUntypedString,
  backgroundPosition?: ?CSSUntypedString,
  backgroundPositionX?: ?CSSUntypedString,
  backgroundPositionY?: ?CSSUntypedString,
  backgroundRepeat?: ?CSSUntypedString,
  backgroundSize?: ?CSSUntypedString,

  borderRadius?: ?CSSUntypedString,
  borderBottomLeftRadius?: ?CSSUntypedString,
  borderBottomRightRadius?: ?CSSUntypedString,
  borderTopLeftRadius?: ?CSSUntypedString,
  borderTopRightRadius?: ?CSSUntypedString,

  borderCollapse?: ?CSSUntypedString,
  borderSpacing?: ?CSSUntypedString,

  border?: ?CSSUntypedString,
  borderBottom?: ?CSSUntypedString,
  borderLeft?: ?CSSUntypedString,
  borderRight?: ?CSSUntypedString,
  borderTop?: ?CSSUntypedString,

  boxShadow?: ?CSSUntypedString,

  boxSizing?: ?CSSBoxSizing,

  float?: ?CSSFloat,
  clear?: ?CSSClear,

  content?: ?CSSUntypedString,

  cursor?: ?CSSCursor,
  direction?: ?CSSDirection,

  flex?: ?CSSUntypedString,
  flexBasis?: ?CSSFlexBasis,
  flexDirection?: ?CSSFlexDirection,
  flexFlow?: ?CSSUntypedString,
  flexGrow?: ?CSSFlexGrow,
  flexShrink?: ?CSSFlexShrink,
  flexWrap?: ?CSSFlexWrap,
  justifyContent?: ?CSSJustifyContent,
  alignItems?: ?CSSAlignItems,
  alignSelf?: ?CSSAlignSelf,
  alignContent?: ?CSSAlignContent,
  order?: ?CSSOrder,

  font?: ?CSSUntypedString,
  fontFamily?: ?CSSUntypedString,
  fontSize?: ?CSSUntypedString,
  fontStyle?: ?CSSUntypedString,
  fontWeight?: ?CSSFontWeight,

  lineHeight?: ?CSSUntypedString,

  listStyle?: ?CSSUntypedString,
  listStyleImage?: ?CSSUntypedString,
  listStylePosition?: ?CSSUntypedString,
  listStyleType?: ?CSSUntypedString,

  opacity?: ?CSSOpacity,

  outline?: ?CSSUntypedString,
  outlineColor?: ?CSSUntypedString,
  outlineOffset?: ?CSSUntypedString,
  outlineStyle?: ?CSSUntypedString,
  outlineWidth?: ?CSSUntypedString,

  overflow?: ?CSSOverflow,
  overflowX?: ?CSSOverflow,
  overflowY?: ?CSSOverflow,

  pointerEvents?: ?CSSPointerEvents,
  resize?: ?CSSResize,

  textAlign?: ?CSSTextAlign,
  textDecoration?: ?CSSUntypedString,
  textOverflow?: ?CSSUntypedString,
  textShadow?: ?CSSUntypedString,
  textTransform?: ?CSSUntypedString,

  transform?: ?CSSUntypedString,
  transformOrigin?: ?CSSUntypedString,
  transformStyle?: ?CSSUntypedString,
  transition?: ?CSSUntypedString,
  transitionDelay?: ?CSSUntypedString,
  transitionDuration?: ?CSSUntypedString,
  transitionProperty?: ?CSSUntypedString,
  transitionTimingFunction?: ?CSSUntypedString,

  userSelect?: ?CSSUserSelect,

  verticalAlign?: ?CSSVerticalAlign,

  visibility?: ?CSSVisibility,

  whiteSpace?: ?CSSWhiteSpace,

  zIndex?: ?CSSZIndex,
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
