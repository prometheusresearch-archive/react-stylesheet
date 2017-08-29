/**
 * @flow
 */

import * as Environment from './Environment';

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
  styles: Array<CSSClass | string>;

  constructor(styles: Array<CSSClass | string>) {
    this.styles = styles;
  }

  valueOf() {
    return this.styles.map(style => style.valueOf()).join(' ');
  }
}

const isTest = Environment.isTest;

export function className(className: string, repr: ?CSSRuleRepr): CSSClass | string {
  if (isTest) {
    return new CSSClass(className, repr);
  } else {
    return className;
  }
}

export function classNameJoin(styles: Array<CSSClass | string>): CSSClassJoin | string {
  if (isTest) {
    return new CSSClassJoin(styles);
  } else {
    return className.join(' ');
  }
}
