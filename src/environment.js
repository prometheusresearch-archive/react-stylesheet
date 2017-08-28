/*
 * @flow
 *
 * Implementation adapted from emotion.
 *
 * @copyright 2017, Prometheus Research, LLC
 * @copyright 2016, Kye Hohenberger
 * @license MIT, APL2
 */

import invariant from 'invariant';

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

export const isBrowser: boolean = typeof window !== 'undefined';
export const isDev: boolean =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
export const isTest: boolean = process.env.NODE_ENV === 'test';

const oldIE = (() => {
  if (isBrowser) {
    let div = document.createElement('div');
    div.innerHTML = '<!--[if lt IE 10]><i></i><![endif]-->';
    return div.getElementsByTagName('i').length === 1;
  } else {
    return false;
  }
})();

function makeStyleTag() {
  let tag = document.createElement('style');
  tag.type = 'text/css';
  tag.setAttribute('data-emotion', '');
  tag.appendChild(document.createTextNode(''));
  (document.head || document.getElementsByTagName('head')[0]).appendChild(tag);
  return tag;
}

function makeDummyStyle() {
  const sheet = {
    cssRules: [],
    insertRule: (rule, _index) => {
      // enough 'spec compliance' to be able to extract the rules later
      // in other words, just the cssText field
      sheet.cssRules.push({cssText: rule});
    },
  };
  return sheet;
}

export class Environment {
  isSpeedy: boolean;
  sheet: StylesheetTag;
  tags: Array<HTMLStyleElement>;
  maxLength: number;
  numberOfRulesInjected: number;
  injected: boolean;

  constructor(
    {
      speedy = !isDev && !isTest,
      maxLength = isBrowser && oldIE ? 4000 : 65000,
    }: {speedy: boolean, maxLength: number} = {},
  ) {
    this.isSpeedy = speedy; // the big drawback here is that the css won't be editable in devtools
    this.sheet = makeDummyStyle();
    this.tags = [];
    this.maxLength = maxLength;
    this.numberOfRulesInjected = 0;
    this.injected = false;
  }

  getSheet(): StylesheetTag {
    return sheetForTag(last(this.tags));
  }

  initialize() {
    if (this.injected) {
      throw new Error('already injected!');
    }
    if (isBrowser) {
      this.tags[0] = makeStyleTag();
    } else {
      this.sheet = makeDummyStyle();
    }
    this.injected = true;
  }

  _insert(rule: string) {
    // this weirdness for perf, and chrome's weird bug
    // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
    try {
      const sheet = this.getSheet();
      sheet.insertRule(rule, rule.indexOf('@import') !== -1 ? 0 : sheet.cssRules.length);
    } catch (e) {
      if (isDev) {
        // might need beter dx for this
        console.warn('illegal rule', rule); // eslint-disable-line no-console
      }
    }
  }

  insert(rule: string) {
    if (isBrowser) {
      // this is the ultrafast version, works across browsers
      if (this.isSpeedy && this.getSheet().insertRule) {
        this._insert(rule);
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
    } else {
      // server side is pretty simple
      this.sheet.insertRule(
        rule,
        rule.indexOf('@import') !== -1 ? 0 : this.sheet.cssRules.length,
      );
    }

    this.numberOfRulesInjected++;

    if (isBrowser && this.numberOfRulesInjected % this.maxLength === 0) {
      this.tags.push(makeStyleTag());
    }

    return this.numberOfRulesInjected - 1;
  }

  dispose() {
    if (isBrowser) {
      for (let i = 0; i < this.tags.length; i++) {
        const tag = this.tags[i];
        if (tag.parentNode != null) {
          tag.parentNode.removeChild(tag);
        }
      }
      this.tags = [];
      this.numberOfRulesInjected = 0;
      // TODO: look for remnants in document.styleSheets
    } else {
      this.sheet.cssRules = [];
    }

    this.injected = false;
  }

  rules() {
    if (isBrowser) {
      let arr = [];
      for (let i = 0; i < this.tags.length; i++) {
        const stylesheet = sheetForTag(this.tags[i]);
        arr.splice(arr.length, 0, ...Array.from(stylesheet.cssRules));
      }
      return arr;
    } else {
      return this.sheet.cssRules;
    }
  }
}

export function create() {
  const env = new Environment();
  env.initialize();
  return env;
}
