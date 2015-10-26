/**
 * @copyright 2015 Prometheus Research, LLC
 */

import invariant                from 'invariant';
import {isPlainObject}          from './Utils';
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

function reconcileStylesheet(stylesheet, prevStylesheet, displayName = 'Unknown') {
  let nextStylesheet = {};
  for (let key in stylesheet) {
    if (!stylesheet.hasOwnProperty(key)) {
      continue;
    }

    let spec = stylesheet[key];
    let Component = prevStylesheet[key];
    invariant(
      Component !== undefined,
      'Invalid stylesheet override for key "%s" for component "<%s />"',
      key, displayName
    );

    if (isPlainObject(spec)) {
      spec = {Component, ...spec};
    }

    nextStylesheet[key] = spec;
  }

  nextStylesheet = {...prevStylesheet, ...nextStylesheet};
  nextStylesheet = createStylesheet(nextStylesheet);
  return nextStylesheet;
}
