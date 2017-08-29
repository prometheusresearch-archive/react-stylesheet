/**
 * @flow
 */

import * as React from 'react';
import * as ReactStylesheet from '../src/index';
import * as CSS from '../src/CSS';

// Just a little helper to define references to CSS variables.
function variable(name, scope = 'base') {
  const fallback = scope === 'base' ? 'initial' : `var(--base-${name}, initial)`;
  return (`var(--${scope}-${name}, ${fallback})`: any);
}

// Define a base stylesheet which just defines a lot of placeholders, like
// really a lot
const base = ReactStylesheet.createStylesheet({
  displayName: 'base',
  base: {
    color: variable('color'),
    backgroundColor: variable('background-color'),
    hover: {
      color: variable('color', 'hover'),
      backgroundColor: variable('background-color', 'hover'),
    },
    focus: {
      color: variable('color', 'focus'),
      backgroundColor: variable('background-color', 'focus'),
    },
  },
});

// make sure stylesheet is in DOM
ReactStylesheet.injectStylesheet(base);

// This is an override. Why? So if we are sure we have a lot of static styles we
// can define it as an override on top of the base.
const baseWithBlackBackgroundColor = ReactStylesheet.overrideStylesheet(base, {
  displayName: 'baseWithBlackBackgroundColor',
  base: {
    '--base-background-color': 'black',
  },
});

// make sure stylesheet is in DOM
ReactStylesheet.injectStylesheet(baseWithBlackBackgroundColor);

// Now we are going to define a component which set CSS variable values based on
// its props. Note that we can eitehr pass a base stylesheet or some override.

type ElementProps = {
  stylesheet?: ReactStylesheet.Stylesheet,
  color?: CSS.CSSColor,
  backgroundColor?: CSS.CSSColor,
  colorOnHover?: CSS.CSSColor,
  backgroundColorOnHover?: CSS.CSSColor,
};

function Element({
  stylesheet = base,
  color,
  backgroundColor,
  colorOnHover,
  backgroundColorOnHover,
  ...props
}: ElementProps) {
  const style = {
    '--base-color': color,
    '--base-background-color': backgroundColor,
    '--hover-color': colorOnHover,
    '--hover-background-color': backgroundColorOnHover,
  };
  const className = ReactStylesheet.toClassName(stylesheet, {});
  return <div {...props} className={className} style={style} />;
}

// Now usage is pretty simple.

export default function ProtoStyle() {
  return (
    <div>
      <Element
        color="red"
        colorOnHover="green"
        backgroundColor="green"
        backgroundColorOnHover="red">
        OK
      </Element>
      <Element stylesheet={baseWithBlackBackgroundColor} color="red" colorOnHover="green">
        OK
      </Element>
    </div>
  );
}
