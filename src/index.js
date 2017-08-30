/**
 * @flow
 */

import type {
  Stylesheet as StylesheetPrivate,
  StylesheetSpec,
  StylesheetContext,
  StylesheetManager,
} from './Stylesheet';

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

export const Element = NaiveElement.Element;
export const VBox = NaiveElement.VBox;
export const HBox = NaiveElement.HBox;
