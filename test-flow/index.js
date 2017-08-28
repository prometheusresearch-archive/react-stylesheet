/**
 * @flow
 */

import * as React from 'react';
import {
  styleComponent,
  createStylesheet,
  injectStylesheet,
  toClassName,
  Element,
  VBox,
} from '../src/index';
import * as CSS from '../src/css';

/*
 * Styling DOM components
 */

const FancyDiv = styleComponent('div', {
  base: {
    color: CSS.hex(0xfff),
  },
});

<FancyDiv className="x" />;

// $FlowFixMe: expect error
<FancyDiv className="x" variant={12} />;

/*
 * Styling stateless functional components
 */

function StatelessFunctionalComponent(props: {a: number}) {
  return <div>{props.a}</div>;
}

const FancyStatelessFunctionalComponent = styleComponent(StatelessFunctionalComponent, {
  base: {
    color: CSS.rgb(255, 255, 255),
  },
});

<FancyStatelessFunctionalComponent a={12} />;

// $FlowFixMe: expect error
<FancyStatelessFunctionalComponent />;

// $FlowFixMe: expect error
<FancyStatelessFunctionalComponent a="12" />;

/*
 * Using stylesheets directly
 */

const stylesheet = createStylesheet({
  base: {
    color: 'black',
  },
});

const stylesheetWithHover = createStylesheet({
  base: {
    color: 'black',
    hover: {
      color: 'red',
      focus: {
        color: 'yellow',
      },
    },
  },
});

/**
 * <Element /> API
 */

<Element color="black" />;

<Element color="black" hover={{color: 'red'}} />;

// $FlowFixMe: expect error
<Element color="blackx" />;

// $FlowFixMe: expect error
<Element color="black" hover={{color: 'redx'}} />;

<Element Component="span" color="black" />;

<Element Component={StatelessFunctionalComponent} a={12} color="black" />;

// $FlowFixMe: expect error
<Element Component={StatelessFunctionalComponent} a={12} color="blackx" />;

// $FlowFixMe: expect error
<Element Component={StatelessFunctionalComponent} color="black" />;

/**
 * <VBox /> / <HBox /> API
 */

<VBox color="black" />;

// $FlowFixMe: expect error
<VBox color="blackx" />;

<VBox Component="span" color="black" />;

<VBox Component={StatelessFunctionalComponent} a={12} color="black" />;

// $FlowFixMe: expect error
<VBox Component={StatelessFunctionalComponent} a={12} color="blackx" />;

// $FlowFixMe: expect error
<VBox Component={StatelessFunctionalComponent} color="black" />;
