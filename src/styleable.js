/**
 * @copyright 2015 Prometheus Research, LLC
 */

import {overrideStylesheet} from './Stylesheet';
import getComponentDisplayName from './getComponentDisplayName';

export default function styleable(Component) {
  let displayName = getComponentDisplayName(Component);
  return class extends Component {

    static displayName = displayName;

    static style(spec) {
      return class extends this {
        static stylesheet = overrideStylesheet(this.stylesheet, spec);
      };
    }

    get stylesheet() {
      return this.props.stylesheet || this.constructor.stylesheet;
    }
  };
}
