/**
 * @flow
 */

import Element from './Element';

/**
 * These are the defaults which were taken from the Facebook's implementation of
 * flexbox in JS/C/Java (now called Yoga).
 */
const defaultBoxStyle = {
  position: 'relative',

  margin: 0,
  padding: 0,

  display: 'flex',
  alignItems: 'stretch',
  flexBasis: 'auto',
  flexShrink: 0,

  minHeight: 0,
  minWidth: 0,
};

export class VBox<P: {}> extends Element<P, *> {
  static defaultProps = {
    Component: 'div',
    ...defaultBoxStyle,
    flexDirection: 'column',
  };
}

export class HBox<P: {}> extends Element<P, *> {
  static defaultProps = {
    Component: 'div',
    ...defaultBoxStyle,
    flexDirection: 'row',
  };
}
