/**
 * @flow
 */

export type StyleState =
  | 'normal'
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled';

export type StyleApplyStrategy =
  | 'static'
  | 'dynamic'
  | 'dynamic-inline';

class PropSpec {

  static lastIndex = 0;

  name: string;
  state: StyleState;
  applyStrategy: StyleApplyStrategy;
  valueSet: Array<string>;
  index: number;

  constructor(name, state, applyStrategy, valueSet = []) {
    this.name = name;
    this.state = state;
    this.applyStrategy = applyStrategy;
    this.valueSet = valueSet;
    this.index = ++this.constructor.lastIndex;
  }
}

export const Spec: {[propName: string]: PropSpec} = {};

function defineStyleProp(spec, name, valueSet?: Array<string>) {
  let nameOnHover     = `${name}OnHover`;
  let nameOnFocus     = `${name}OnFocus`;
  let nameOnActive    = `${name}OnActive`;
  let nameOnDisabled  = `${name}OnDisabled`;
  let normalStrategy = valueSet == null ? 'dynamic-inline': 'static';
  let stateStrategy  = valueSet == null ? 'dynamic': 'static';
  Object.assign(spec, {
    [name]:           new PropSpec(name, 'normal',   normalStrategy, valueSet),
    [nameOnHover]:    new PropSpec(name, 'hover',    stateStrategy,  valueSet),
    [nameOnFocus]:    new PropSpec(name, 'focus',    stateStrategy,  valueSet),
    [nameOnActive]:   new PropSpec(name, 'active',   stateStrategy,  valueSet),
    [nameOnDisabled]: new PropSpec(name, 'disabled', stateStrategy,  valueSet),
  });
}

defineStyleProp(Spec, 'margin');
defineStyleProp(Spec, 'marginTop');
defineStyleProp(Spec, 'marginRight');
defineStyleProp(Spec, 'marginBottom');
defineStyleProp(Spec, 'marginLeft');
defineStyleProp(Spec, 'padding');
defineStyleProp(Spec, 'paddingH');
defineStyleProp(Spec, 'paddingTop');
defineStyleProp(Spec, 'paddingRight');
defineStyleProp(Spec, 'paddingBottom');
defineStyleProp(Spec, 'paddingLeft');
defineStyleProp(Spec, 'border');
defineStyleProp(Spec, 'borderTop');
defineStyleProp(Spec, 'borderRight');
defineStyleProp(Spec, 'borderBottom');
defineStyleProp(Spec, 'borderLeft');
defineStyleProp(Spec, 'color');
defineStyleProp(Spec, 'background');
defineStyleProp(Spec, 'width');
defineStyleProp(Spec, 'minWidth');
defineStyleProp(Spec, 'maxWidth');
defineStyleProp(Spec, 'height');
defineStyleProp(Spec, 'minHeight');
defineStyleProp(Spec, 'maxHeight');
defineStyleProp(Spec, 'top');
defineStyleProp(Spec, 'right');
defineStyleProp(Spec, 'bottom');
defineStyleProp(Spec, 'left');
defineStyleProp(Spec, 'fontSize');
defineStyleProp(Spec, 'fontWeight');
defineStyleProp(Spec, 'fontFamily');
defineStyleProp(Spec, 'fontStyle');
defineStyleProp(Spec, 'opacity');
defineStyleProp(Spec, 'flexShrink');
defineStyleProp(Spec, 'flexGrow');
defineStyleProp(Spec, 'flexBasis');
defineStyleProp(Spec, 'flexFlow');
defineStyleProp(Spec, 'order');
defineStyleProp(Spec, 'boxShadow');
defineStyleProp(Spec, 'textShadow');
defineStyleProp(Spec, 'transition');
defineStyleProp(Spec, 'outline');

defineStyleProp(Spec,
  'display',
  ['none', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'table']
);
defineStyleProp(Spec,
  'position',
  ['absolute', 'relative', 'static', 'fixed', 'sticky']
);
defineStyleProp(Spec,
  'textAlign',
  ['start', 'end', 'left', 'right', 'center', 'justify', 'match-parent']
);
defineStyleProp(Spec,
  'overflow',
  ['visible', 'hidden', 'scroll', 'auto']
);
defineStyleProp(Spec,
  'overflowX',
  ['visible', 'hidden', 'scroll', 'auto']
);
defineStyleProp(Spec,
  'overflowY',
  ['visible', 'hidden', 'scroll', 'auto']
);
defineStyleProp(Spec,
  'float',
  ['left', 'right', 'none', 'inline-start', 'inline-end']
);
defineStyleProp(Spec,
  'flexDirection',
  ['row', 'row-reverse', 'column', 'column-reverse']
);
defineStyleProp(Spec,
  'flexWrap',
  ['nowrap', 'wrap', 'wrap-reverse']
);
defineStyleProp(Spec,
  'justifyContent',
  ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
);
defineStyleProp(Spec,
  'alignContent',
  ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch']
);
defineStyleProp(Spec,
  'alignItems',
  ['flex-start', 'flex-end', 'center', 'baseline', 'stretch']
);
defineStyleProp(Spec,
  'alignSelf',
  ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']
);
defineStyleProp(Spec,
  'whiteSpace',
  ['normal', 'pre', 'nowrap', 'pre-wrap', 'pre-line']
);
defineStyleProp(Spec,
  'visibility',
  ['visible', 'hidden', 'collapse']
);
defineStyleProp(Spec,
  'textTransform',
  ['none', 'capitalize', 'uppercase', 'lowercase', 'full-width']
);
