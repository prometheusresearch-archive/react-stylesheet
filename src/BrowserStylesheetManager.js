/*
 * @flow
 *
 * Implementation adapted from emotion.
 *
 * @copyright 2017, Prometheus Research, LLC
 * @copyright 2016, Kye Hohenberger
 * @license MIT, APL2
 */

const invariant = require('invariant');

import type {StylesheetManager} from './index';
import * as Environment from './Environment';

type StylesheetTag = {
  cssRules: Array<mixed>,
  insertRule: (string, index?: number) => void,
};

function last(arr) {
  return arr[arr.length - 1];
}

function sheetForTag(tag): StylesheetTag {
  if (tag.sheet) {
    return (tag.sheet: any);
  }

  // this weirdness brought to you by firefox
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return (document.styleSheets[i]: any);
    }
  }

  invariant(false, 'Cannot get the HTMLStyleElement for the stylesheet');
}

function createHTMLStyleElement(): HTMLStyleElement {
  let tag = document.createElement('style');
  tag.type = 'text/css';
  tag.setAttribute('data-emotion', '');
  tag.appendChild(document.createTextNode(''));
  (document.head || document.getElementsByTagName('head')[0]).appendChild(tag);
  return tag;
}

export class BrowserStylesheetManager implements StylesheetManager {
  isSpeedy: boolean;
  sheet: StylesheetTag;
  tags: Array<HTMLStyleElement>;
  maxLength: number;
  numberOfRulesInjected: number;
  injected: boolean;

  constructor(
    {
      speedy = !Environment.isDev && !Environment.isTest,
      maxLength = Environment.isOldIE ? 4000 : 65000,
    }: {speedy: boolean, maxLength: number} = {},
  ) {
    this.isSpeedy = speedy; // the big drawback here is that the css won't be editable in devtools
    this.tags = [createHTMLStyleElement()];
    this.maxLength = maxLength;
    this.numberOfRulesInjected = 0;
    this.injected = true;
  }

  getSheet(): StylesheetTag {
    return sheetForTag(last(this.tags));
  }

  _inject(rule: string) {
    // this weirdness for perf, and chrome's weird bug
    // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
    try {
      const sheet = this.getSheet();
      sheet.insertRule(rule, rule.indexOf('@import') !== -1 ? 0 : sheet.cssRules.length);
    } catch (e) {
      if (Environment.isDev) {
        // might need beter dx for this
        console.warn('illegal rule', rule); // eslint-disable-line no-console
      }
    }
  }

  inject(rule: string) {
    // this is the ultrafast version, works across browsers
    if (this.isSpeedy && this.getSheet().insertRule) {
      this._inject(rule);
    } else {
      // more browser weirdness. I don't even know
      // else if(this.tags.length > 0 && this.tags::last().styleSheet) {
      //   this.tags::last().styleSheet.cssText+= rule
      // }
      if (rule.indexOf('@import') !== -1) {
        const tag = last(this.tags);
        tag.insertBefore(document.createTextNode(rule), tag.firstChild);
      } else {
        last(this.tags).appendChild(document.createTextNode(rule));
      }
    }

    this.numberOfRulesInjected++;

    if (this.numberOfRulesInjected % this.maxLength === 0) {
      this.tags.push(createHTMLStyleElement());
    }
  }

  dispose() {
    for (let i = 0; i < this.tags.length; i++) {
      const tag = this.tags[i];
      if (tag.parentNode != null) {
        tag.parentNode.removeChild(tag);
      }
    }
    this.tags = [];
    this.numberOfRulesInjected = 0;
    // TODO: look for remnants in document.styleSheets
    this.injected = false;
  }

  rules() {
    let arr = [];
    for (let i = 0; i < this.tags.length; i++) {
      const stylesheet = sheetForTag(this.tags[i]);
      arr.splice(arr.length, 0, ...Array.from(stylesheet.cssRules));
    }
    return arr;
  }
}

export function create() {
  return new BrowserStylesheetManager();
}
