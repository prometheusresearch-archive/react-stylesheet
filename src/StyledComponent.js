/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React, {PropTypes} from 'react';

export default class StyledComponent extends React.Component {

  static Component = null;

  static style = null;

  static propTypes = {
    state: PropTypes.object
  };

  render() {
    let {state, ...props} = this.props;
    let {Component, style} = this.constructor;
    let className = style.asClassName(state);
    return <Component {...props} className={className} />;
  }

  componentDidMount() {
    this.constructor.style.use();
  }

  componentWillUnmount() {
    this.constructor.style.dispose();
  }
}
