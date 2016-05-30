/**
 * @copyright 2015 Prometheus Research, LLC
 */

import React, {PropTypes} from 'react';
import getComponentDisplayName from './getComponentDisplayName';

export default class StyleableDOMComponent extends React.Component {

  static Component = null;

  static stylesheet = null;

  static propTypes = {
    variant: PropTypes.object,
    className: PropTypes.string,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    stylesheet: PropTypes.object,
  };

  static style(spec) {
    return class extends StyleableDOMComponent {
      static displayName = getComponentDisplayName(this);
      static Component = this.Component;
      static stylesheet = this.stylesheet.override(spec);
    };
  }

  render() {
    let {
      variant,
      className: extraClassName,
      Component = this.constructor.Component,
      stylesheet = this.constructor.stylesheet,
      ...props
    } = this.props;
    let className = stylesheet.asClassName(variant);
    if (extraClassName) {
      className = className + ' ' + extraClassName;
    }
    return (
      <Component
        {...props}
        className={className}
        />
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stylesheet !== this.props.stylesheet) {
      this._disposeStylesheet(this.props);
      this._useStylesheet(nextProps);
    }
  }

  componentWillMount() {
    this._useStylesheet();
  }

  componentWillUnmount() {
    this._disposeStylesheet();
  }

  _useStylesheet(props = this.props) {
    if (props.stylesheet) {
      props.stylesheet.use();
    } else {
      this.constructor.stylesheet.use();
    }
  }

  _disposeStylesheet(props = this.props) {
    if (props.stylesheet) {
      props.stylesheet.dispose();
    } else {
      this.constructor.stylesheet.dispose();
    }
  }
}
