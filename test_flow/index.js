 /**
  * @flow
  */

import {style} from 'react-stylesheet';
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
  }
});

<StyledFunctional hello="here" />;

// $ExpectError
<StyledFunctional hello={42} />;

class Class extends React.Component {

  props: {
    hello: string;
  };

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
  }
});

<StyledClass hello="here" />;

// $ExpectError
<StyledClass hello={42} />;

// $ExpectError
style(Class, {
  base: {
    olor: 'red',
  }
});

import {Element} from 'react-stylesheet';

<Element justifyContent="space-between" />;

// $ExpectError
<Element justifyContent="space-between-oops" />;

import {HBox} from 'react-stylesheet';

<HBox justifyContent="space-between" />;

// $ExpectError
<HBox justifyContent="space-between-oops" />;
