/**
 * @flow
 */

import type {StylesheetManager} from './index';

class ServerStylesheetManager implements StylesheetManager {
  rules: Array<string>;

  constructor() {
    this.rules = [];
  }

  inject(rule: string) {
    this.rules.push(rule);
  }

  dispose() {
    this.rules = [];
  }
}

export function create() {
  return new ServerStylesheetManager();
}
