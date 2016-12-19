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

class Box extends Element {

  static className = boxStylesheet.toClassName();

  componentWillMount() {
    boxStylesheet.inject();
  }
}

export class VBox extends Box {

  static defaultProps = {
    flexDirection: 'column',
  };

}

export class HBox extends Box {

  static defaultProps = {
    flexDirection: 'row',
  };
}
