/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert from 'power-assert';
import * as pkg from '../index';
import styleComponent from '../styleComponent';
import * as Stylesheet from '../Stylesheet';

describe('package', function() {

  it('exports some stuff', function() {
    assert(pkg.default === undefined);
    assert(pkg.style === styleComponent);
    assert(pkg.create === Stylesheet.create);
    assert(pkg.override === Stylesheet.override);
    assert(pkg.isStylesheet === Stylesheet.isStylesheet);
  });
});
