/**
 * @flow
 */

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
