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
        <VBox flexGrow={1} padding={10}>
          1
        </VBox>
        <VBox flexGrow={1} padding={10}>
          2
        </VBox>
      </HBox>
    </div>
  );
}
