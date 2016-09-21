/**
 * @copyright 2015 Prometheus Research, LLC
 * @flow
 */

import type {StylesheetSpec} from './Stylesheet';

import style from './style';
import Stylesheet from './Stylesheet';

function stylesheet(name: string, spec: StylesheetSpec) {
  return new Stylesheet(name, spec);
}

export {style, stylesheet};
