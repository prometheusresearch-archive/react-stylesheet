/**
 * @flow
 */

import * as React from 'react';
import {Element, VBox, HBox} from '../src';

export default function CSSVariableElementExample() {
  return (
    <div>
      <Element
        color="red"
        backgroundColor="green"
        hover={{color: 'green', backgroundColor: 'red'}}>
        OK
      </Element>
      <HBox>
        <VBox padding="10px">1</VBox>
        <VBox padding="10px">2</VBox>
      </HBox>
    </div>
  );
}
