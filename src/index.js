/**
 * @flow
 */

import type {
  Stylesheet as StylesheetPrivate,
  StylesheetSpec,
  StylesheetContext,
  StylesheetManager,
} from './Stylesheet';

import * as Environment from './Environment';

/**
 * We export StylesheetPrivate as opaque type.
 */
export opaque type Stylesheet = StylesheetPrivate;
export type {StylesheetSpec, StylesheetContext, StylesheetManager};

export {
  createStylesheet,
  injectStylesheet,
  staticStyles,
  toClassName,
  createStylesheetManager,
  renderStylesheet,
} from './Stylesheet';

export {default as styleComponent} from './styleComponent';

import * as NaiveElement from './NaiveElement';
import * as CSSVariableElement from './CSSVariableElement';

export const Element = Environment.isCSSVariablesSupported
  ? CSSVariableElement.Element
  : NaiveElement.Element;

export const VBox = Environment.isCSSVariablesSupported
  ? CSSVariableElement.VBox
  : NaiveElement.VBox;

export const HBox = Environment.isCSSVariablesSupported
  ? CSSVariableElement.HBox
  : NaiveElement.HBox;
