/**
 * @flow
 */

import type {
  Stylesheet as StylesheetPrivate,
  StylesheetSpec,
  StylesheetContext,
} from './Stylesheet';

import type {StylesheetEnvironment} from './environment';

/**
 * We export StylesheetPrivate as opaque type.
 */
export opaque type Stylesheet = StylesheetPrivate;
export type {StylesheetSpec, StylesheetContext, StylesheetEnvironment};

export {
  createStylesheet,
  injectStylesheet,
  injectDisposableStylesheet,
  toClassName,
  createEnvironment,
  renderStylesheet,
} from './Stylesheet';

export {default as styleComponent} from './styleComponent';
export {Element, VBox, HBox} from './Element';
