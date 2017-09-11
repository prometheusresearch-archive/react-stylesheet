/**
 * @flow
 */

import type {StylesheetEnvironment} from './index';

class ServerEnvironment implements StylesheetEnvironment {
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
  return new ServerEnvironment();
}
