/**
 * @flow
 */

import type {StyleState} from './ElementPropSpec';
import * as CSSType from './CSSType';

import React from 'react';
import createHash from 'murmurhash-js/murmurhash3_gc';
import injectStylesheet from 'style-loader/addStyles';

import {compileStyle, expandStyle} from './compiler';
import {Spec} from './ElementPropSpec';

type Style = Object;

export type ElementProps = {
  Component?: string;
  style?: Object;
  className?: string;

  alignContent?: CSSType.alignContent;
  alignContentOnHover?: CSSType.alignContent;
  alignContentOnFocus?: CSSType.alignContent;
  alignContentOnActive?: CSSType.alignContent;
  alignContentOnDisabled?: CSSType.alignContent;

  alignItems?: CSSType.alignItems;
  alignItemsOnHover?: CSSType.alignItems;
  alignItemsOnFocus?: CSSType.alignItems;
  alignItemsOnActive?: CSSType.alignItems;
  alignItemsOnDisabled?: CSSType.alignItems;

  alignSelf?: CSSType.alignSelf;
  alignSelfOnHover?: CSSType.alignSelf;
  alignSelfOnFocus?: CSSType.alignSelf;
  alignSelfOnActive?: CSSType.alignSelf;
  alignSelfOnDisabled?: CSSType.alignSelf;

  background?: CSSType.background;
  backgroundOnHover?: CSSType.background;
  backgroundOnFocus?: CSSType.background;
  backgroundOnActive?: CSSType.background;
  backgroundOnDisabled?: CSSType.background;

  border?: CSSType.border;
  borderOnHover?: CSSType.border;
  borderOnFocus?: CSSType.border;
  borderOnActive?: CSSType.border;
  borderOnDisabled?: CSSType.border;

  borderRadius?: CSSType.borderRadius;
  borderRadiusOnHover?: CSSType.borderRadius;
  borderRadiusOnFocus?: CSSType.borderRadius;
  borderRadiusOnActive?: CSSType.borderRadius;
  borderRadiusOnDisabled?: CSSType.borderRadius;

  borderBottom?: CSSType.border;
  borderBottomOnHover?: CSSType.border;
  borderBottomOnFocus?: CSSType.border;
  borderBottomOnActive?: CSSType.border;
  borderBottomOnDisabled?: CSSType.border;

  borderLeft?: CSSType.border;
  borderLeftOnHover?: CSSType.border;
  borderLeftOnFocus?: CSSType.border;
  borderLeftOnActive?: CSSType.border;
  borderLeftOnDisabled?: CSSType.border;

  borderRight?: CSSType.border;
  borderRightOnHover?: CSSType.border;
  borderRightOnFocus?: CSSType.border;
  borderRightOnActive?: CSSType.border;
  borderRightOnDisabled?: CSSType.border;

  borderTop?: CSSType.border;
  borderTopOnHover?: CSSType.border;
  borderTopOnFocus?: CSSType.border;
  borderTopOnActive?: CSSType.border;
  borderTopOnDisabled?: CSSType.border;

  bottom?: number | string;
  bottomOnHover?: number | string;
  bottomOnFocus?: number | string;
  bottomOnActive?: number | string;
  bottomOnDisabled?: number | string;

  boxSizing?: CSSType.boxSizing;
  boxSizingOnHover?: CSSType.boxSizing;
  boxSizingOnFocus?: CSSType.boxSizing;
  boxSizingOnActive?: CSSType.boxSizing;
  boxSizingOnDisabled?: CSSType.boxSizing;

  color?: CSSType.color;
  colorOnHover?: CSSType.color;
  colorOnFocus?: CSSType.color;
  colorOnActive?: CSSType.color;
  colorOnDisabled?: CSSType.color;

  cursor?: CSSType.cursor;
  cursorOnHover?: CSSType.cursor;
  cursorOnFocus?: CSSType.cursor;
  cursorOnActive?: CSSType.cursor;
  cursorOnDisabled?: CSSType.cursor;

  display?: CSSType.display;
  displayOnHover?: CSSType.display;
  displayOnFocus?: CSSType.display;
  displayOnActive?: CSSType.display;
  displayOnDisabled?: CSSType.display;

  flex?: CSSType.flex;
  flexOnHover?: CSSType.flex;
  flexOnFocus?: CSSType.flex;
  flexOnActive?: CSSType.flex;
  flexOnDisabled?: CSSType.flex;

  flexBasis?: CSSType.flexBasis;
  flexBasisOnHover?: CSSType.flexBasis;
  flexBasisOnFocus?: CSSType.flexBasis;
  flexBasisOnActive?: CSSType.flexBasis;
  flexBasisOnDisabled?: CSSType.flexBasis;

  flexDirection?: CSSType.flexDirection;
  flexDirectionOnHover?: CSSType.flexDirection;
  flexDirectionOnFocus?: CSSType.flexDirection;
  flexDirectionOnActive?: CSSType.flexDirection;
  flexDirectionOnDisabled?: CSSType.flexDirection;

  flexFlow?: CSSType.flexFlow;
  flexFlowOnHover?: CSSType.flexFlow;
  flexFlowOnFocus?: CSSType.flexFlow;
  flexFlowOnActive?: CSSType.flexFlow;
  flexFlowOnDisabled?: CSSType.flexFlow;

  flexGrow?: CSSType.flexGrow;
  flexGrowOnHover?: CSSType.flexGrow;
  flexGrowOnFocus?: CSSType.flexGrow;
  flexGrowOnActive?: CSSType.flexGrow;
  flexGrowOnDisabled?: CSSType.flexGrow;

  flexShrink?: CSSType.flexShrink;
  flexShrinkOnHover?: CSSType.flexShrink;
  flexShrinkOnFocus?: CSSType.flexShrink;
  flexShrinkOnActive?: CSSType.flexShrink;
  flexShrinkOnDisabled?: CSSType.flexShrink;

  flexWrap?: CSSType.flexWrap;
  flexWrapOnHover?: CSSType.flexWrap;
  flexWrapOnFocus?: CSSType.flexWrap;
  flexWrapOnActive?: CSSType.flexWrap;
  flexWrapOnDisabled?: CSSType.flexWrap;

  float?: CSSType.float;
  floatOnHover?: CSSType.float;
  floatOnFocus?: CSSType.float;
  floatOnActive?: CSSType.float;
  floatOnDisabled?: CSSType.float;

  fontFamily?: CSSType.fontFamily;
  fontFamilyOnHover?: CSSType.fontFamily;
  fontFamilyOnFocus?: CSSType.fontFamily;
  fontFamilyOnActive?: CSSType.fontFamily;
  fontFamilyOnDisabled?: CSSType.fontFamily;

  fontSize?: CSSType.fontSize;
  fontSizeOnHover?: CSSType.fontSize;
  fontSizeOnFocus?: CSSType.fontSize;
  fontSizeOnActive?: CSSType.fontSize;
  fontSizeOnDisabled?: CSSType.fontSize;

  fontStyle?: CSSType.fontStyle;
  fontStyleOnHover?: CSSType.fontStyle;
  fontStyleOnFocus?: CSSType.fontStyle;
  fontStyleOnActive?: CSSType.fontStyle;
  fontStyleOnDisabled?: CSSType.fontStyle;

  fontWeight?: CSSType.fontWeight;
  fontWeightOnHover?: CSSType.fontWeight;
  fontWeightOnFocus?: CSSType.fontWeight;
  fontWeightOnActive?: CSSType.fontWeight;
  fontWeightOnDisabled?: CSSType.fontWeight;

  height?: number | string;
  heightOnHover?: number | string;
  heightOnFocus?: number | string;
  heightOnActive?: number | string;
  heightOnDisabled?: number | string;

  justifyContent?: CSSType.justifyContent;
  justifyContentOnHover?: CSSType.justifyContent;
  justifyContentOnFocus?: CSSType.justifyContent;
  justifyContentOnActive?: CSSType.justifyContent;
  justifyContentOnDisabled?: CSSType.justifyContent;

  left?: number | string;
  leftOnHover?: number | string;
  leftOnFocus?: number | string;
  leftOnActive?: number | string;
  leftOnDisabled?: number | string;

  lineHeight?: CSSType.lineHeight;
  lineHeightOnHover?: CSSType.lineHeight;
  lineHeightOnFocus?: CSSType.lineHeight;
  lineHeightOnActive?: CSSType.lineHeight;
  lineHeightOnDisabled?: CSSType.lineHeight;

  margin?: CSSType.margin;
  marginOnHover?: CSSType.margin;
  marginOnFocus?: CSSType.margin;
  marginOnActive?: CSSType.margin;
  marginOnDisabled?: CSSType.margin;

  marginBottom?: CSSType.marginBottom;
  marginBottomOnHover?: CSSType.marginBottom;
  marginBottomOnFocus?: CSSType.marginBottom;
  marginBottomOnActive?: CSSType.marginBottom;
  marginBottomOnDisabled?: CSSType.marginBottom;

  marginLeft?: CSSType.marginLeft;
  marginLeftOnHover?: CSSType.marginLeft;
  marginLeftOnFocus?: CSSType.marginLeft;
  marginLeftOnActive?: CSSType.marginLeft;
  marginLeftOnDisabled?: CSSType.marginLeft;

  marginRight?: CSSType.marginRight;
  marginRightOnHover?: CSSType.marginRight;
  marginRightOnFocus?: CSSType.marginRight;
  marginRightOnActive?: CSSType.marginRight;
  marginRightOnDisabled?: CSSType.marginRight;

  marginTop?: CSSType.marginTop;
  marginTopOnHover?: CSSType.marginTop;
  marginTopOnFocus?: CSSType.marginTop;
  marginTopOnActive?: CSSType.marginTop;
  marginTopOnDisabled?: CSSType.marginTop;

  maxHeight?: CSSType.maxHeight;
  maxHeightOnHover?: CSSType.maxHeight;
  maxHeightOnFocus?: CSSType.maxHeight;
  maxHeightOnActive?: CSSType.maxHeight;
  maxHeightOnDisabled?: CSSType.maxHeight;

  maxWidth?: CSSType.maxWidth;
  maxWidthOnHover?: CSSType.maxWidth;
  maxWidthOnFocus?: CSSType.maxWidth;
  maxWidthOnActive?: CSSType.maxWidth;
  maxWidthOnDisabled?: CSSType.maxWidth;

  minHeight?: CSSType.minHeight;
  minHeightOnHover?: CSSType.minHeight;
  minHeightOnFocus?: CSSType.minHeight;
  minHeightOnActive?: CSSType.minHeight;
  minHeightOnDisabled?: CSSType.minHeight;

  minWidth?: CSSType.minWidth;
  minWidthOnHover?: CSSType.minWidth;
  minWidthOnFocus?: CSSType.minWidth;
  minWidthOnActive?: CSSType.minWidth;
  minWidthOnDisabled?: CSSType.minWidth;

  opacity?: CSSType.opacity;
  opacityOnHover?: CSSType.opacity;
  opacityOnFocus?: CSSType.opacity;
  opacityOnActive?: CSSType.opacity;
  opacityOnDisabled?: CSSType.opacity;

  order?: CSSType.order;
  orderOnHover?: CSSType.order;
  orderOnFocus?: CSSType.order;
  orderOnActive?: CSSType.order;
  orderOnDisabled?: CSSType.order;

  outline?: CSSType.outline;
  outlineOnHover?: CSSType.outline;
  outlineOnFocus?: CSSType.outline;
  outlineOnActive?: CSSType.outline;
  outlineOnDisabled?: CSSType.outline;

  overflow?: CSSType.overflow;
  overflowOnHover?: CSSType.overflow;
  overflowOnFocus?: CSSType.overflow;
  overflowOnActive?: CSSType.overflow;
  overflowOnDisabled?: CSSType.overflow;

  overflowX?: CSSType.overflowX;
  overflowXOnHover?: CSSType.overflowX;
  overflowXOnFocus?: CSSType.overflowX;
  overflowXOnActive?: CSSType.overflowX;
  overflowXOnDisabled?: CSSType.overflowX;

  overflowY?: CSSType.overflowY;
  overflowYOnHover?: CSSType.overflowY;
  overflowYOnFocus?: CSSType.overflowY;
  overflowYOnActive?: CSSType.overflowY;
  overflowYOnDisabled?: CSSType.overflowY;

  padding?: CSSType.padding;
  paddingOnHover?: CSSType.padding;
  paddingOnFocus?: CSSType.padding;
  paddingOnActive?: CSSType.padding;
  paddingOnDisabled?: CSSType.padding;

  paddingBottom?: CSSType.paddingBottom;
  paddingBottomOnHover?: CSSType.paddingBottom;
  paddingBottomOnFocus?: CSSType.paddingBottom;
  paddingBottomOnActive?: CSSType.paddingBottom;
  paddingBottomOnDisabled?: CSSType.paddingBottom;

  paddingLeft?: CSSType.paddingLeft;
  paddingLeftOnHover?: CSSType.paddingLeft;
  paddingLeftOnFocus?: CSSType.paddingLeft;
  paddingLeftOnActive?: CSSType.paddingLeft;
  paddingLeftOnDisabled?: CSSType.paddingLeft;

  paddingRight?: CSSType.paddingRight;
  paddingRightOnHover?: CSSType.paddingRight;
  paddingRightOnFocus?: CSSType.paddingRight;
  paddingRightOnActive?: CSSType.paddingRight;
  paddingRightOnDisabled?: CSSType.paddingRight;

  paddingTop?: CSSType.paddingTop;
  paddingTopOnHover?: CSSType.paddingTop;
  paddingTopOnFocus?: CSSType.paddingTop;
  paddingTopOnActive?: CSSType.paddingTop;
  paddingTopOnDisabled?: CSSType.paddingTop;

  position?: CSSType.position;
  positionOnHover?: CSSType.position;
  positionOnFocus?: CSSType.position;
  positionOnActive?: CSSType.position;
  positionOnDisabled?: CSSType.position;

  right?: number | string;
  rightOnHover?: number | string;
  rightOnFocus?: number | string;
  rightOnActive?: number | string;
  rightOnDisabled?: number | string;

  textAlign?: CSSType.textAlign;
  textAlignOnHover?: CSSType.textAlign;
  textAlignOnFocus?: CSSType.textAlign;
  textAlignOnActive?: CSSType.textAlign;
  textAlignOnDisabled?: CSSType.textAlign;

  textShadow?: CSSType.textShadow;
  textShadowOnHover?: CSSType.textShadow;
  textShadowOnFocus?: CSSType.textShadow;
  textShadowOnActive?: CSSType.textShadow;
  textShadowOnDisabled?: CSSType.textShadow;

  textTransform?: CSSType.textTransform;
  textTransformOnHover?: CSSType.textTransform;
  textTransformOnFocus?: CSSType.textTransform;
  textTransformOnActive?: CSSType.textTransform;
  textTransformOnDisabled?: CSSType.textTransform;

  top?: number | string;
  topOnHover?: number | string;
  topOnFocus?: number | string;
  topOnActive?: number | string;
  topOnDisabled?: number | string;

  userSelect?: CSSType.userSelect;
  userSelectOnHover?: CSSType.userSelect;
  userSelectOnFocus?: CSSType.userSelect;
  userSelectOnActive?: CSSType.userSelect;
  userSelectOnDisabled?: CSSType.userSelect;

  verticalAlign?: CSSType.verticalAlign;
  verticalAlignOnHover?: CSSType.verticalAlign;
  verticalAlignOnFocus?: CSSType.verticalAlign;
  verticalAlignOnActive?: CSSType.verticalAlign;
  verticalAlignOnDisabled?: CSSType.verticalAlign;

  visibility?: CSSType.visibility;
  visibilityOnHover?: CSSType.visibility;
  visibilityOnFocus?: CSSType.visibility;
  visibilityOnActive?: CSSType.visibility;
  visibilityOnDisabled?: CSSType.visibility;

  whiteSpace?: CSSType.whiteSpace;
  whiteSpaceOnHover?: CSSType.whiteSpace;
  whiteSpaceOnFocus?: CSSType.whiteSpace;
  whiteSpaceOnActive?: CSSType.whiteSpace;
  whiteSpaceOnDisabled?: CSSType.whiteSpace;

  width?: number | string;
  widthOnHover?: number | string;
  widthOnFocus?: number | string;
  widthOnActive?: number | string;
  widthOnDisabled?: number | string;

  zIndex?: CSSType.zIndex;
  zIndexOnHover?: CSSType.zIndex;
  zIndexOnFocus?: CSSType.zIndex;
  zIndexOnActive?: CSSType.zIndex;
  zIndexOnDisabled?: CSSType.zIndex;
};

export default class Element<P: ElementProps = ElementProps> extends React.Component<*, P, void> {

  static defaultProps = {
    boxSizing: 'border-box',
  };

  static Component = 'div';
  static className: ?string = null;

  render() {
    let ownProps = this.transformProps(this.props);
    let Component = this.constructor.Component;
    let className = [];
    let style = ownProps.style || {};
    let dynamicStyle = {};
    let dynamicStyleKey = [];
    let props = {};

    if (this.constructor.className != null) {
      className.push(this.constructor.className);
    }

    for (let k in ownProps) {
      if (!ownProps.hasOwnProperty(k)) {
        continue;
      }
      let v = ownProps[k];

      if (k === 'Component') {
        Component = v;
        continue;
      } else if (k === 'className') {
        className.push(v);
        continue;
      } else if (k === 'style') {
        continue;
      }

      let spec = Spec[k];
      if (spec != null) {
        if (v == null) {
          continue;
        }
        if (spec.applyStrategy === 'dynamic-inline') {
          style[spec.name] = v;
        } else if (spec.applyStrategy === 'dynamic') {
          if (spec.state === 'normal') {
            dynamicStyle[spec.name] = v;
          } else {
            dynamicStyle[spec.state] = dynamicStyle[spec.state] || {};
            dynamicStyle[spec.state][spec.name] = v;
          }
          dynamicStyleKey[spec.index] = v;
        } else if (spec.applyStrategy === 'static') {
          className.push(staticStylesheetManager.toClassName(spec.state, spec.name, v));
        }
      } else {
        props[k] = v;
      }
    }

    className.push(dynamicStylesheetManager.toClassName(dynamicStyleKey, dynamicStyle));

    return (
      <Component
        {...props}
        style={expandStyle(style)}
        className={className.join(' ')}
        />
    );
  }

  transformProps(props: P): P {
    return props;
  }
}

class DynamicStylesheetManager {

  _stylesheetCache: Map<string, string> = new Map();

  toClassName(key: mixed, style: Style): string {
    key = `rs-${String(createHash(String(key)))}`;
    let className = this._stylesheetCache.get(key);
    if (className == null) {
      let css = compileStyle(key, style, true);
      className = key;
      injectStylesheet([[key, css]]);
      this._stylesheetCache.set(key, className);
    }
    return className;
  }

}

class StaticStylesheetManager {

  constructor() {
    this._precompile();
  }

  toClassName(state: StyleState, name: string, value: string): string {
    return `rs-${name}-${value}-${state}`;
  }

  _precompile(): void {
    let cssList = [];
    for (let k in Spec) {
      if (!Spec.hasOwnProperty(k)) {
        continue;
      }
      let spec = Spec[k];
      if (spec.applyStrategy === 'static') {
        this._generateRuleSet(cssList, spec.name, spec.state, spec.valueSet);
      }
    }
    injectStylesheet([['static', cssList.join('\n')]]);
  }

  _generateRuleSet(
    cssList: Array<string>,
    name: string,
    state: string,
    valueSet: Array<string>
  ): void {
    for (let i = 0; i < valueSet.length; i++) {
      let value = valueSet[i];
      let className = `rs-${name}-${value}-${state}`;
      let important = true;
      cssList.push(compileStyle(
        className,
        state === 'normal'
        ? {[name]: value}
        : {[state]: {[name]: value}},
        important
      ));
    }
  }
}

export const dynamicStylesheetManager = new DynamicStylesheetManager();
export const staticStylesheetManager = new StaticStylesheetManager();
