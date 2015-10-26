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
    return class extends this {
      static stylesheet = stylesheet;
    };
  }

  render() {
    let {Component, stylesheet} = this.constructor;
    return <Component stylesheet={stylesheet} {...this.props} />;
  }
}
