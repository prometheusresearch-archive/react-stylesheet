/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant                from 'invariant';
import map                      from 'lodash/collection/map';
import zipObject                from 'lodash/array/zipObject';
import isString                 from 'lodash/lang/isString';
import isPlainObject            from 'lodash/lang/isPlainObject';
import isValidReactComponent    from './isValidReactComponent';
import createStylesheet         from './createStylesheet';
import styleComponent           from './styleComponent';
import getComponentDisplayName  from './getComponentDisplayName';

export default function Styleable(Component, stylesheet = Component.stylesheet) {

  return class extends Component {

    static displayName = `Styleable(${getComponentDisplayName(Component)})`;

    static stylesheet = createStylesheet(stylesheet);

    static style(nextStylesheet) {
      nextStylesheet = reconcileStylesheet(
        nextStylesheet,
        this.stylesheet,
        getComponentDisplayName(this)
      );
      return Styleable(Component, nextStylesheet);
    }

    get stylesheet() {
      return this.constructor.stylesheet;
    }

  }
}

function reconcileStylesheet(stylesheet, prevStylesheet, displayName) {
  stylesheet = map(stylesheet, (spec, key) => {
    let Component = prevStylesheet[key];
    invariant(
      Component !== undefined,
      'Invalid stylesheet override for key "%s" for component "<%s />"',
      key, displayName
    );
    if (isPlainObject(spec)) {
      spec = {Component, ...spec};
    }
    return [key, spec];
  });
  stylesheet = zipObject(stylesheet);
  stylesheet = createStylesheet(stylesheet);
  return stylesheet;
}
