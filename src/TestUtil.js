/**
 * @flow
 */

import {CSSClassJoin, CSSClass} from './CSSStyleRepr';

export const snapshotSerializer = {
  // $FlowFixMe: ...
  print(val: mixed, serialize, indent) {
    if (val instanceof CSSClassJoin) {
      const styles = val.styles.map(style => indent(serialize(style)));
      return ['CSSClassJoin [', ...styles, ']'].join('\n');
    } else if (val instanceof CSSClass) {
      if (val.repr != null) {
        const repr = val.repr.map(rule =>
          [
            `CSSClass ${rule.selector} {`,
            ...rule.props.map(prop => indent(prop)),
            `}`,
          ].join('\n'),
        );
        return repr.join('\n');
      } else {
        return val.className;
      }
    }
  },

  test(val: mixed) {
    return val instanceof CSSClassJoin || (val instanceof CSSClass && val.repr != null);
  },
};
