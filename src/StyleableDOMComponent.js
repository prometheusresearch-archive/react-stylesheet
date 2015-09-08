/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React, {PropTypes}       from 'react';
import getComponentDisplayName  from './getComponentDisplayName';
import Style                    from './Style';

export default class StyleableDOMComponent extends React.Component {

  static Component = null;

  static stylesheet = null;

  static propTypes = {
    state: PropTypes.object
  };

  static style(stylesheet, Component = this.Component, name = null) {
    let displayName = getComponentDisplayName(Component);
    if (!Style.is(stylesheet)) {
      stylesheet = Style.create(stylesheet, name || displayName);
    }
    return class extends StyleableDOMComponent {
      static displayName = `StyleableDOMComponent(${displayName})`;
      static Component = Component;
      static stylesheet = stylesheet;
    };
  }

  render() {
    let {state, ...props} = this.props;
    let {Component, stylesheet} = this.constructor;
    let className = stylesheet.asClassName(state);
    return <Component {...props} className={className} />;
  }

  componentDidMount() {
    this.constructor.stylesheet.use();
  }

  componentWillUnmount() {
    this.constructor.stylesheet.dispose();
  }
}
