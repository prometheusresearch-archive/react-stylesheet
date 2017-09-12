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

import {
  createStylesheet,
  injectStylesheet,
  injectDisposableStylesheet,
  toClassName,
  createEnvironment,
  renderStylesheet,
} from './Stylesheet';

import {default as styleComponent} from './styleComponent';
import {Element, VBox, HBox} from './Element';

export {
  createStylesheet,
  injectStylesheet,
  injectDisposableStylesheet,
  toClassName,
  createEnvironment,
  renderStylesheet,
  styleComponent,
  Element,
  VBox,
  HBox,
};

export function defineStylesheet(spec: StylesheetSpec) {
  const stylesheet = createStylesheet(spec);
  injectStylesheet(stylesheet);
  return {
    toClassName: toClassName.bind(null, stylesheet),
  };
}
