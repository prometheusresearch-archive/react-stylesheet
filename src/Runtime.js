/**
 * This module defines the runtime configuration.
 *
 * @flow
 */

import invariant from 'invariant';

import * as BrowserEnvironment from './environment/BrowserEnvironment';
import * as ServerEnvironment from './environment/ServerEnvironment';

export const isBrowser = typeof window !== 'undefined';
export const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
export const isTest = process.env.NODE_ENV === 'test';
export const isOldIE = detectOldIE();
export const isCSSVariablesSupported = detectCSSVariables();

function detectCSSVariables() {
  if (
    typeof window !== 'undefined' &&
    window.CSS != null &&
    window.CSS.supports != null
  ) {
    return window.CSS.supports('--fake-var', 0);
  } else {
    return false;
  }
}

function detectOldIE() {
  if (isBrowser) {
    let div = document.createElement('div');
    div.innerHTML = '<!--[if lt IE 10]><i></i><![endif]-->';
    return div.getElementsByTagName('i').length === 1;
  } else {
    return false;
  }
}

export function createEnvironment() {
  if (isBrowser) {
    return BrowserEnvironment.create();
  } else {
    return ServerEnvironment.create();
  }
}
