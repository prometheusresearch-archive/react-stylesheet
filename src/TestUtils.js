/**
 * @flow
 */

import {CSSClassRepr, CSSClassJoinRepr} from './CSSClassRepr';

export const snapshotSerializer = {
  // $ExpectError: ...
  print(val, serialize, _indent) {
    if (val instanceof CSSClassRepr) {
      const repr = serialize(val.repr);
      return repr.replace(/^Object {/, `${val.reprName} {`);
    } else if (val instanceof CSSClassJoinRepr) {
      const repr = serialize(val.styles);
      return repr.replace(/^Array \[/, 'StyleJoin [');
    } else {
      return serialize(val);
    }
  },

  // $ExpectError: ...
  test(val) {
    return val instanceof CSSClassRepr || val instanceof CSSClassJoinRepr;
  },
};
