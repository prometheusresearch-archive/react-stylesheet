 /**
  * @flow
  */

import {style} from 'react-dom-stylesheet';
import React from 'react';

function Functional({hello}: {hello: string}) {
  return <div>{hello}</div>;
}

<Functional hello="here" />;

// $ExpectError
<Functional hello={42} />;

let StyledFunctional = style(Functional, {
  color: 'red',
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
  color: 'red',
});

<StyledClass hello="here" />;

// $ExpectError
<StyledClass hello={42} />;

import {create} from 'react-dom-stylesheet';

let stylesheet = create({
  color: 'red'
});

stylesheet.use();

stylesheet.dispose();

let className = stylesheet.asClassName({ok: true});

let nextStylesheet = stylesheet.override({
  background: 'red',
});
