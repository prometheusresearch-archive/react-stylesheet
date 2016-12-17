/**
 * @flow
 */

import Element from './Element';
import stylesheet from './Stylesheet';

let boxStylesheet = stylesheet('Box', {
  base: {
    boxSizing: 'border-box',
    position: 'relative',

    overflow: 'hidden',

    margin: 0,
    padding: 0,

    display: 'flex',
    alignItems: 'stretch',
    flexBasis: 'auto',
    flexShrink: 0,

    minHeight: 0,
    minWidth: 0
  }
});

export class VBox extends Element {

  static defaultProps = {
    flexDirection: 'column',
  };

  static className = boxStylesheet.toClassName();

  componentWillMount() {
    boxStylesheet.inject();
  }
}

export class HBox extends Element {

  static defaultProps = {
    flexDirection: 'row',
  };

  static className = boxStylesheet.toClassName();

  componentWillMount() {
    boxStylesheet.inject();
  }
}
