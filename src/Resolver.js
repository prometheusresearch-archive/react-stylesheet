//@flow

import {expandStyle} from './compiler';
import {Spec} from './Strategy';
import {staticStylesheetManager, dynamicStylesheetManager} from './StylesheetManager';

export const resolve = ({
  defaultClassName,
  defaultComponent,
  props,
}: {
  defaultClassName: Array<string>,
  defaultComponent: *,
  props: *,
}) => {
  let Component = defaultComponent;
  const className = defaultClassName;
  let style = props.style || {};
  let dynamicStyle = {};
  let dynamicStyleKey = [];
  let resultProps = {};

  for (let k in props) {
    if (!props.hasOwnProperty(k)) {
      continue;
    }
    let v = props[k];

    if (k === 'Component') {
      Component = v;
      continue;
    } else if (k === 'className') {
      className.push(v);
      continue;
    } else if (k === 'style') {
      continue;
    }

    let spec = Spec[k];
    if (spec != null) {
      if (v == null) {
        continue;
      }

      if (spec.applyStrategy === 'dynamic-inline') {
        style[spec.name] = v;
      } else if (spec.applyStrategy === 'dynamic') {
        if (spec.state === 'normal') {
          dynamicStyle[spec.name] = v;
        } else {
          dynamicStyle[spec.state] = dynamicStyle[spec.state] || {};
          dynamicStyle[spec.state][spec.name] = v;
        }
        dynamicStyleKey[spec.index] = v;
      } else if (spec.applyStrategy === 'static') {
        className.push(staticStylesheetManager.toClassName(spec.state, spec.name, v));
      }
    } else {
      resultProps[k] = v;
    }
  }

  className.push(dynamicStylesheetManager.toClassName(dynamicStyleKey, dynamicStyle));

  const res = {
    Component,
    props: resultProps,
    style: expandStyle(style),
    className: className.join(' '),
  };

  return res;
};
