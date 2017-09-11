/**
 * @flow
 */

/**
 * Stylesheet environment defines how CSS rules are being injected/disposed.
 */
export interface StylesheetEnvironment {
  /**
   * Inject a CSS rule.
   */
  inject(rule: string): void,

  /**
   * Dispose manager along with all injected styles.
   */
  dispose(): void,
}
