/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React, {PropTypes} from 'react';
import cx from 'classnames';
import getComponentDisplayName from './getComponentDisplayName';
import * as DOMStylesheet from './DOMStylesheet';

export default class StyleableDOMComponent extends React.Component {

  static Component = null;

  static stylesheet = null;

  static propTypes = {
    state: PropTypes.object,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
  };

  static style(spec) {
    return class extends StyleableDOMComponent {
      static displayName = getComponentDisplayName(this);
      static Component = this.Component;
      static stylesheet = DOMStylesheet.overrideStylesheet(this.stylesheet, spec);
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
