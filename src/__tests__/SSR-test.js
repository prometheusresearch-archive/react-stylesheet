//@flow

import React from 'react';
import ReactDomServer from 'react-dom/server';
import {style, Element} from '../';

import {Spec} from '../ElementPropSpec';

let origSpec;

const patchStrategy = (spec, targetSpec, targetApplyStrategy) => {
  Object.keys(spec).forEach(fieldName => {
    const field = spec[fieldName];

    field.applyStrategy =
      targetApplyStrategy ||
      (targetSpec && targetSpec[fieldName].applyStrategy) ||
      'static';
  });
};

describe('SSR dynamic-inline strategy', () => {
  beforeAll(() => {
    origSpec = JSON.parse(JSON.stringify(Spec));

    patchStrategy(Spec, null, 'dynamic-inline');
  });

  it('hello world button Element ', () => {
    const Button = () => (
      <Element
        background="red"
        backgroundOnHover="yellow"
        color="yellow"
        colorOnHover="red"
      />
    );

    expect(ReactDomServer.renderToString(<Button />)).toMatchSnapshot();
  });

  it('hello world button Style ', () => {
    const Button = style('div', {
      base: {
        fontSize: '16px',
        lineHeight: 20,
        color: '#ffffff',
        textDecoration: 'none',
        backgroundColor: '#b6a809',
        borderTop: '20px solid #b6a809',
        borderBottom: '20px solid #b6a809',
        borderLeft: '60px solid #b6a809',
        borderRight: '60px solid #b6a809',
        borderRadius: 3,
        display: 'inline-block',
      },
    });

    expect(ReactDomServer.renderToString(<Button />)).toMatchSnapshot();
  });

  afterAll(() => {
    origSpec = JSON.parse(JSON.stringify(Spec));

    patchStrategy(Spec, origSpec, null);
  });
});
