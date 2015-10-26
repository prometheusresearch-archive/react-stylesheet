/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant                from 'invariant';
import {isPlainObject}          from './Utils';
import createStylesheet         from './createStylesheet';
import getComponentDisplayName  from './getComponentDisplayName';
import {overrideStylesheet}     from './Stylesheet';

export default function Styleable(Component, stylesheet = Component.stylesheet) {

  let StyleableComponent = class extends Component {

    static displayName = `Styleable(${getComponentDisplayName(Component)})`;

    static stylesheet = createStylesheet(stylesheet);

    get stylesheet() {
      return this.constructor.stylesheet;
    }

  };

  if (StyleableComponent.style === undefined) {
    StyleableComponent.style = function style(spec) {
      let stylesheet = overrideStylesheet(this.stylesheet, spec);
      return Styleable(Component, stylesheet);
    };
  }

  return StyleableComponent;
}
