/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React, {PropTypes} from 'react';

export default class StyleableComponent extends React.Component {

  static Component = null;

  static _style= null;

  static propTypes = {
    state: PropTypes.object
  };

  render() {
    let {state, ...props} = this.props;
    let {Component, _style} = this.constructor;
    let className = _style.asClassName(state);
    return <Component {...props} className={className} />;
  }

  componentDidMount() {
    this.constructor._style.use();
  }

  componentWillUnmount() {
    this.constructor._style.dispose();
  }
}
