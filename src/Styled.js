/**
 * @copyright 2015 Prometheus Research, LLC
 */

import Themeable              from 'rethemeable/lib/Themeable';
import map                    from 'lodash/collection/map';
import zipObject              from 'lodash/array/zipObject';
import isValidReactComponent  from './isValidReactComponent';
import createStylesheet       from './createStylesheet';
import styleComponent         from './styleComponent';

export default function Styled(Component, stylesheet = Component.stylesheet) {
  let displayName = Component.displayName || Component.name;
  if (stylesheet) {
    stylesheet = createStylesheet(stylesheet);
  }
  Component = Themeable(Component, stylesheet);
  return class extends Themeable(Component, stylesheet) {

    static displayName = `Styled(${displayName})`;

    static style(nextStylesheet) {
      nextStylesheet = map(nextStylesheet, (spec, key) => {
        let prevSpec = stylesheet[key];
        if (prevSpec &&
            !isValidReactComponent(spec) &&
            !isValidReactComponent(prevSpec)) {
          spec = {Component: prevSpec.Component, ...spec};
        }
        return [key, spec];
      });
      nextStylesheet = zipObject(nextStylesheet);
      nextStylesheet = createStylesheet(nextStylesheet);
      return Component.style(nextStylesheet);
    }

    constructor(props) {
      super(props);
      this._styledCache = null;
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
      let prevTheme = this.theme;
      super.componentWillUpdate(nextProps, nextState, nextContext);
      if (prevTheme !== this.theme) {
        this._styledCache = null;
      }
    }

    get stylesheet() {
      if (this._styledCache === null) {
        this._styledCache = createStylesheet(this.theme);
      }
      return this._styledCache;
    }

  }
}
