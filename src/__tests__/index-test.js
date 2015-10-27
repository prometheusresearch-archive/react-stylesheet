/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert from 'power-assert';
import * as pkg from '../index';
import attachStylesheet from '../attachStylesheet';
import styleComponent from '../styleComponent';
import * as Stylesheet from '../Stylesheet';

describe('package', function() {

  it('exports some stuff', function() {
    assert(pkg.default === undefined);
    assert(pkg.attachStylesheet === attachStylesheet);
    assert(pkg.styleComponent === styleComponent);
    assert(pkg.createStylesheet === Stylesheet.createStylesheet);
  });
});
