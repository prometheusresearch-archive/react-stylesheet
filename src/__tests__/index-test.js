/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert           from 'power-assert';
import * as pkg         from '../index';
import Styleable        from '../Styleable';
import Style            from '../Style';
import styleComponent   from '../styleComponent';
import createStylesheet from '../createStylesheet';

describe('package', function() {

  it('exports some stuff', function() {
    assert(pkg.default === Styleable);
    assert(pkg.Style === Style);
    assert(pkg.style === styleComponent);
    assert(pkg.stylesheet === createStylesheet);
    assert(pkg.Styleable === Styleable);
  });
});
