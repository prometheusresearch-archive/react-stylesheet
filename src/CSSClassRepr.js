/**
 * @flow
 */

export class CSSClassRepr {
  className: string;
  repr: any;
  reprName: string;

  constructor(className: string, repr: any, reprName: string) {
    this.className = className;
    this.repr = repr;
    this.reprName = reprName;
  }

  valueOf() {
    return this.className;
  }
}

export class CSSClassJoinRepr {
  styles: Array<string | CSSClassRepr>;

  constructor(styles: Array<string | CSSClassRepr>) {
    this.styles = styles;
  }

  valueOf() {
    return this.styles.join(' ');
  }
}
