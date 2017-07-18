/**
 * @flow
 */

/**
 * If we can inject stylesheets into the DOM.
 */
export const canInject = typeof window !== 'undefined';

export const isTest = process.env.NODE_ENV === 'test';
