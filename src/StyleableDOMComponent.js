/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React, {PropTypes}       from 'react';
import cx                       from 'classnames';
import getComponentDisplayName  from './getComponentDisplayName';
import Style                    from './Style';

export default class StyleableDOMComponent extends React.Component {

  static Component = null;

  static stylesheet = null;

  static propTypes = {
    state: PropTypes.object,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
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
    let {
      state,
      Component = this.constructor.Component,
      className: extraClassName,
      ...props
    } = this.props;
    let {stylesheet} = this.constructor;
    let className = stylesheet.asClassName(state);
    return (
      <Component
        {...props}
        className={cx(className, extraClassName)}
        />
    );
  }

  componentDidMount() {
    this.constructor.stylesheet.use();
  }

  componentWillUnmount() {
    this.constructor.stylesheet.dispose();
  }
}
