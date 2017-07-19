/**
 * @flow
 */

/**
 * This is use to hold the additional information about styles compiled to CSS
 * classes. Only used during test runs.
 */
export class CSSClassRepresentation {
  className: string;
  representation: any;
  representationName: string;

  constructor(className: string, representation: any, representationName: string) {
    this.className = className;
    this.representation = representation;
    this.representationName = representationName;
  }

  valueOf() {
    return this.className;
  }
}

/**
 * This is use to hold the additional information about CSS classes
 * concatenation. Only used during test runs.
 */
export class CSSClassJoinRepresentation {
  styles: Array<string | CSSClassRepresentation>;

  constructor(styles: Array<string | CSSClassRepresentation>) {
    this.styles = styles;
  }

  valueOf() {
    return this.styles.join(' ');
  }
}
