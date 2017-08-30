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
} from './Stylesheet';

export {default as styleComponent} from './styleComponent';
export {default as Element} from './Element';
export {VBox, HBox} from './Box';
