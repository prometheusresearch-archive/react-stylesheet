/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant                from 'invariant';
import map                      from 'lodash/collection/map';
import zipObject                from 'lodash/array/zipObject';
import isPlainObject            from 'lodash/lang/isPlainObject';
import createStylesheet         from './createStylesheet';
import getComponentDisplayName  from './getComponentDisplayName';

export default function Styleable(Component, stylesheet = Component.stylesheet) {

  let StyleableComponent = class extends Component {

    static displayName = `Styleable(${getComponentDisplayName(Component)})`;

    static stylesheet = createStylesheet(stylesheet);

    get stylesheet() {
      return this.constructor.stylesheet;
    }

  };

  if (StyleableComponent.style === undefined) {
    StyleableComponent.style = function style(nextStylesheet) {
      nextStylesheet = reconcileStylesheet(
        nextStylesheet,
        this.stylesheet,
        getComponentDisplayName(this)
      );
      return Styleable(Component, nextStylesheet);
    };
  }

  return StyleableComponent;
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
  stylesheet = {...prevStylesheet, ...stylesheet};
  stylesheet = createStylesheet(stylesheet);
  return stylesheet;
}
