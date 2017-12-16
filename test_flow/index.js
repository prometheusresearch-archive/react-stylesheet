/**
 * @flow
 */

import {style} from '../src';
import React from 'react';

function Functional({hello}: {hello: string}) {
  return <div>{hello}</div>;
}

<Functional hello="here" />;

// $ExpectError
<Functional hello={42} />;

let StyledFunctional = style(Functional, {
  base: {
    color: 'red',
  },
});

<StyledFunctional hello="here" />;

// $ExpectError
<StyledFunctional hello={42} />;

class Class extends React.Component<{hello: string}> {
  render() {
    return <div>{this.props.hello}</div>;
  }
}

<Class hello="here" />;

// $ExpectError
<Class hello={42} />;

let StyledClass = style(Class, {
  base: {
    color: 'red',
  },
});

<StyledClass hello="here" />;

// $ExpectError
<StyledClass hello={42} />;

// $ExpectError
style(Class, {
  base: {
    olor: 'red',
  },
});

import {Element} from '../src';

<Element justifyContent="space-between" />;

// $ExpectError
<Element justifyContent="space-between-oops" />;

import {HBox} from '../src';

<HBox justifyContent="space-between" />;

// $ExpectError
<HBox justifyContent="space-between-oops" />;
