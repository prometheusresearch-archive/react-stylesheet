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
    variant: PropTypes.object,
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

  constructor(props) {
    super(props);
    this._stateDeprecationWarned = false;
  }

  render() {
    let {
      variant, state,
      Component = this.constructor.Component,
      className: extraClassName,
      ...props
    } = this.props;
    if (state && !this._stateDeprecationWarned) {
      this._stateDeprecationWarned = true;
      console.error( // eslint-disable-line
        'Warning: React Stylesheet: state is deprecated, use variant instead'
      );
    }
    variant = variant || state;
    let {stylesheet} = this.constructor;
    let className = stylesheet.asClassName(variant);
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
