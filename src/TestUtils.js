/**
 * @flow
 */

import {CSSClassRepresentation, CSSClassJoinRepresentation} from './StyleRepresentation';

export const snapshotSerializer = {
  // $ExpectError: ...
  print(val, serialize, _indent) {
    if (val instanceof CSSClassRepresentation) {
      const repr = serialize(val.representation);
      return repr.replace(/^Object {/, `${val.representationName} {`);
    } else if (val instanceof CSSClassJoinRepresentation) {
      const repr = serialize(val.styles);
      return repr.replace(/^Array \[/, 'StyleJoin [');
    } else {
      return serialize(val);
    }
  },

  // $ExpectError: ...
  test(val) {
    return (
      val instanceof CSSClassRepresentation || val instanceof CSSClassJoinRepresentation
    );
  },
};
