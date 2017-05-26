/**
 * @flow
 */

import React from 'react';
import {storiesOf} from '@kadira/storybook';

import Element from '../src/Element';
import {VBox, HBox} from '../src/Box';

storiesOf('<Element />', module).add('Basic', () => (
  <div>
    <Element
      display="block"
      textAlignOnHover="right"
      width={100}
      height={40}
      widthOnHover={200}
      border="1px solid red">
      OK
    </Element>
    <Element
      display="block"
      width={100}
      height={40}
      widthOnHover={200}
      border="1px solid red"
      borderLeftOnHover="5px solid red"
    />
    <Element
      display="block"
      width={100}
      height={40}
      widthOnHover={200}
      border="1px solid red"
      borderLeftOnHover="5px solid red"
    />
    <Element
      display="block"
      width={100}
      height={40}
      widthOnHover={200}
      border="1px solid red"
      borderLeftOnHover="5px solid red"
    />
    <Element
      display="block"
      width={100}
      height={40}
      widthOnHover={200}
      border="1px solid red"
      borderLeftOnHover="5px solid red"
    />
    <Element
      display="block"
      width={100}
      height={40}
      widthOnHover={200}
      border="1px solid red"
      borderLeftOnHover="5px solid red"
    />
    <Element
      display="block"
      width={100}
      height={40}
      widthOnHover={200}
      border={{width: 1, color: 'red', style: 'solid'}}
      borderLeftOnHover="5px solid red"
    />
  </div>
));

storiesOf('<Box />', module).add('Basic', () => (
  <div>
    <HBox border="1px solid red">
      <VBox border="1px solid red">Hi</VBox>
      <VBox border="1px solid red">Hi</VBox>
    </HBox>
  </div>
));
