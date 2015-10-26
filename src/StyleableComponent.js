/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React from 'react';
import * as Stylesheet from './Stylesheet';

export default class StyleableComponent extends React.Component {

  static stylesheet = null;

  static Component = null;

  static style(spec) {
    let stylesheet = Stylesheet.overrideStylesheet(this.stylesheet, spec);
    return class extends StyleableComponent {
      static stylesheet = stylesheet;
      static Component = this.Component;
      static displayName = this.displayName;
    };
  }

  render() {
    let {Component, stylesheet} = this.constructor;
    return <Component stylesheet={stylesheet} {...this.props} />;
  }
}
