//@flow

import {expandStyle} from './compiler';
import {Spec} from './Strategy';
import {staticStylesheetManager, dynamicStylesheetManager} from './StylesheetManager';

export const resolve = (props: *) => {
  let {Component, className, style, stylesheet, variant} = props;

  let variantClassName;
  let styleProps = props;

  if (!!stylesheet && !!variant) {
    variantClassName = stylesheet.toClassName(variant);

    styleProps = Object.keys(variant).reduce((prev, next) => {
      if (variant[next]) {
        return {...prev, ...stylesheet.spec[next]};
      }
      return prev;
    }, {});
  }

  const classNameArray = [
    ...(variantClassName ? [variantClassName] : []),
    ...(className ? [className] : []),
  ];

  style = style ? {...style} : {};
  const dynamicStyle = {};
  const dynamicStyleKey = [];
  const resultProps = {};

  for (const propName in styleProps) {
    if (
      !styleProps.hasOwnProperty(propName) ||
      ['Component', 'className', 'style'].indexOf(propName) !== -1
    ) {
      continue;
    }

    const stylePropName = propName;

    const value = styleProps[stylePropName];
    const spec = Spec[stylePropName];

    if (spec == null) {
      resultProps[stylePropName] = value;
      continue;
    }

    if (value == null) {
      continue;
    }

    if (spec.applyStrategy === 'dynamic-inline') {
      style[spec.name] = value;
      continue;
    }

    if (spec.applyStrategy === 'dynamic') {
      if (spec.state === 'normal') {
        dynamicStyle[spec.name] = value;
      } else {
        dynamicStyle[spec.state] = dynamicStyle[spec.state] || {};
        dynamicStyle[spec.state][spec.name] = value;
      }
      dynamicStyleKey[spec.index] = value;
      continue;
    }

    if (spec.applyStrategy === 'static') {
      classNameArray.push(
        staticStylesheetManager.toClassName(spec.state, spec.name, value),
      );
      continue;
    }
  }

  classNameArray.push(
    dynamicStylesheetManager.toClassName(dynamicStyleKey, dynamicStyle),
  );
  const res = {
    Component,
    ...resultProps,
    style: expandStyle(style),
    className: classNameArray.join(' '),
  };

  console.log(resultProps);
  return res;
};
