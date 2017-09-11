/**
 * @flow
 */

const React = require('react');
const invariant = require('invariant');

import type {StylesheetEnvironment} from './environment';

import CSSPseudoClassSet from './CSSPseudoClassSet';
import * as CSS from './CSS';
import * as CSSStyleRepr from './CSSStyleRepr';
import * as Compiler from './Compiler';
import * as Runtime from './Runtime';

/**
 * This is how you define your stylesheet.
 */
export type StylesheetSpec = {
  displayName?: string,
  className?: string,
  [key: string]: CSS.CSSStylesheet,
};

/**
 * This is the opaque type which represents the compiled stylesheet.
 */
export type Stylesheet = Compiler.CompiledStylesheet;

/**
 * The context for stylesheet.
 */
export type StylesheetContext = {
  rightToLeft: boolean,
  className?: CSSStyleRepr.ClassName,
};

export const defaultContext = {
  rightToLeft: false,
};

function noop() {}

type StylesheetRecord = {
  manager: StylesheetEnvironment,
  dispose: () => void,
  useCount: number,
};

class StylesheetManager {
  injected: {[id: string]: ?StylesheetRecord};
  staticRecord: StylesheetRecord;

  constructor() {
    this.injected = {};
    this.staticRecord = {
      manager: Runtime.createEnvironment(),
      dispose: noop,
      useCount: Infinity,
    };
  }

  injectDisposable(stylesheet: Stylesheet) {
    const rec = this.injected[stylesheet.id];
    if (rec == null) {
      if (stylesheet.rules.length > 0) {
        const manager = Runtime.createEnvironment();
        for (const rule of stylesheet.rules) {
          manager.inject(rule.cssText);
        }
        const dispose = () => {
          const rec = this.injected[stylesheet.id];
          if (rec != null) {
            if (rec.useCount === 0) {
              rec.manager.dispose();
              this.injected[stylesheet.id] = null;
            } else {
              this.injected[stylesheet.id] = {...rec, useCount: rec.useCount - 1};
            }
          }
        };
        this.injected[stylesheet.id] = {manager, dispose, useCount: 1};
        return dispose;
      } else {
        return noop;
      }
    } else {
      return rec.dispose;
    }
  }

  inject(stylesheet: Stylesheet) {
    const rec = this.injected[stylesheet.id];
    if (rec == null) {
      this.injected[stylesheet.id] = this.staticRecord;
      for (const rule of stylesheet.rules) {
        this.staticRecord.manager.inject(rule.cssText);
      }
    } else if (rec !== this.staticRecord) {
      // "upgrade" stylesheet to be static
      this.injected[stylesheet.id] = this.staticRecord;
    }
  }

  disposeAll() {
    const ids = Object.keys(this.injected);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const rec = this.injected[id];
      if (rec != null) {
        rec.dispose();
      }
    }
  }
}

export const stylesheetManager = new StylesheetManager();

/**
 * Produce a stylesheet from a spec.
 */
export function createStylesheet(spec: StylesheetSpec): Stylesheet {
  return Compiler.compile(spec);
}

export function createEnvironment(): StylesheetEnvironment {
  return Runtime.createEnvironment();
}

/**
 * Override a stylesheet with a spec.
 */
export function overrideStylesheet(
  stylesheet: Stylesheet,
  override: StylesheetSpec,
): Stylesheet {
  function overrideVariant(variant, override) {
    const nextVariant = {...variant};
    for (const k in override) {
      if (CSSPseudoClassSet[k]) {
        nextVariant[k] = overrideVariant(nextVariant[k], override[k]);
      } else {
        nextVariant[k] = override[k];
      }
    }
    return nextVariant;
  }

  const nextSpec = {
    ...stylesheet.spec,
    displayName:
      override.displayName != null ? override.displayName : stylesheet.spec.displayName,
  };
  for (const variant in override) {
    if (variant === 'displayName') {
      continue;
    }
    nextSpec[variant] = overrideVariant(nextSpec[variant], override[variant]);
  }

  return Compiler.compile(nextSpec);
}

export function injectStylesheet(stylesheet: Stylesheet): void {
  stylesheetManager.inject(stylesheet);
}

export function injectDisposableStylesheet(stylesheet: Stylesheet): () => void {
  return stylesheetManager.injectDisposable(stylesheet);
}

export function toClassName(
  stylesheet: Stylesheet,
  variant: Object,
  context?: StylesheetContext = defaultContext,
): null | string | CSSStyleRepr.CSSClassJoin {
  const styles = [];
  const addStyle = style => {
    if (style != null) {
      if (typeof style === 'string') {
        styles.push(style);
      } else {
        styles.push(CSSStyleRepr.className(style.className, style.repr));
      }
    }
  };

  addStyle(stylesheet.variantToClassName.base);
  if (context.rightToLeft) {
    addStyle(Compiler.RTL_CLASS_NAME);
    addStyle(stylesheet.variantToClassName.rightToLeft);
  }
  for (const key in variant) {
    if (key === 'base') {
      continue;
    }
    if (key === 'rightToLeft' && context.rightToLeft) {
      continue;
    }
    if (variant[key] != null && variant[key] !== false) {
      addStyle(stylesheet.variantToClassName[key]);
    }
  }
  if (context.className != null) {
    addStyle(context.className.valueOf());
  }
  return styles.length > 0 ? CSSStyleRepr.classNameJoin(styles) : null;
}

export function renderStylesheet(stylesheet: Stylesheet): string {
  return stylesheet.rules.map(rule => rule.cssText).join('\n');
}
