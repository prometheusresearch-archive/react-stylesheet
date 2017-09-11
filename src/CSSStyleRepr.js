/**
 * @flow
 */

import * as Runtime from './Runtime';

export type ClassName = CSSClass | CSSClassJoin | string | null | void;

type CSSRuleRepr = {selector: string, props: Array<string>};

export class CSSClass {
  className: string;
  repr: ?CSSRuleRepr;

  constructor(className: string, repr: ?CSSRuleRepr) {
    this.className = className;
    this.repr = repr;
  }

  valueOf() {
    return this.className;
  }
}

export class CSSClassJoin {
  styles: Array<ClassName>;

  constructor(styles: Array<ClassName>) {
    this.styles = styles;
  }

  valueOf() {
    let className = '';
    for (let i = 0; i < this.styles.length; i++) {
      let s = this.styles[i];
      if (s != null) {
        className += ' ' + s.valueOf();
      }
    }
    return className;
  }
}

const isTest = Runtime.isTest;

export function className(className: string, repr: ?CSSRuleRepr): CSSClass | string {
  if (isTest) {
    return new CSSClass(className, repr);
  } else {
    return className;
  }
}

export function classNameJoin(styles: Array<ClassName>): CSSClassJoin | string {
  if (isTest) {
    return new CSSClassJoin(styles);
  } else {
    return styles.join(' ');
  }
}
