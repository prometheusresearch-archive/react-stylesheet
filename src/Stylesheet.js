/**
 * @flow
 */

const React = require('react');
const invariant = require('invariant');

import CSSPseudoClassSet from './CSSPseudoClassSet';
import * as CSS from './CSS';
import * as CSSStyleRepr from './CSSStyleRepr';
import * as Compiler from './Compiler';
import * as Environment from './Environment';

/**
 * This is how you define your stylesheet.
 */
export type StylesheetSpec = {
  displayName?: string,
  className?: string,
  [key: string]: CSS.CSSStylesheet,
};

/**
 * Defines a stretegy for how styles are being inserted.
 *
 * Single manager can host multiple styles.
 */
export interface StylesheetManager {
  /**
   * Inject a CSS rule.
   */
  inject(rule: string): void,

  /**
   * Dispose manager along with all injected styles.
   */
  dispose(): void,
}

/**
 * This is the opaque type which represents the compiled stylesheet.
 */
export type Stylesheet = Compiler.CompiledStylesheet;

/**
 * The context for stylesheet.
 */
export type StylesheetContext = {
  rightToLeft: boolean,
  className?: string,
};

export const defaultContext = {
  rightToLeft: false,
};

export const staticStyles = Environment.createStylesheetManager();

/**
 * Produce a stylesheet from a spec.
 */
export function createStylesheet(spec: StylesheetSpec): Stylesheet {
  return Compiler.compile(spec);
}

export function createStylesheetManager(): StylesheetManager {
  return Environment.createStylesheetManager();
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

  return createStylesheet(nextSpec);
}

export function injectStylesheet(stylesheet: Stylesheet, manager = staticStyles): void {
  for (const rule of stylesheet.rules) {
    manager.inject(rule.cssText);
  }
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
    addStyle(context.className);
  }
  return styles.length > 0 ? CSSStyleRepr.classNameJoin(styles) : null;
}

export function renderStylesheet(stylesheet: Stylesheet): string {
  return stylesheet.rules.map(rule => rule.cssText).join('\n');
}
