/**
 * Copyright 2016-present, Prometheus Research, LLC. MIT License
 *
 * @flow
 */

/**
 * Compile name: value property.
 */
export default function compileProp(
  name: string,
  value: mixed,
  compileName: (string) => string,
  compileValue: (string, mixed) => string,
) {
  switch (name) {

    // extended variants

    case 'padding':
      if (typeof value === 'object' && value != null) {
        return compileLayout('padding', value, compileName, compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'margin':
      if (typeof value === 'object' && value != null) {
        return compileLayout('margin', value, compileName, compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'background':
      if (typeof value === 'object' && value != null) {
        return compileBackground(value, compileName, compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'border':
      if (typeof value === 'object' && value != null) {
        return compileBorder('border', value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'borderLeft':
      if (typeof value === 'object' && value != null) {
        return compileBorder('borderLeft', value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'borderTop':
      if (typeof value === 'object' && value != null) {
        return compileBorder('borderTop', value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'borderBottom':
      if (typeof value === 'object' && value != null) {
        return compileBorder('borderBottom', value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'borderRight':
      if (typeof value === 'object' && value != null) {
        return compileBorder('borderRight', value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'outline':
      if (typeof value === 'object' && value != null) {
        return compileBorder('outline', value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'boxShadow':
      if (typeof value === 'object' && value != null) {
        return compileBoxShadow(value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    case 'textShadow':
      if (typeof value === 'object' && value != null) {
        return compileTextShadow(value, compileName,compileValue);
      } else {
        return [compileSingleProp(name, value, compileName, compileValue)];
      }

    // V / H variants for paddings, margins

    case 'paddingH':
      return [
        compileSingleProp('paddingLeft', value, compileName, compileValue),
        compileSingleProp('paddingRight', value, compileName, compileValue)
      ];
    case 'paddingV':
      return [
        compileSingleProp('paddingTop', value, compileName, compileValue),
        compileSingleProp('paddingBottom', value, compileName, compileValue)
      ];
    case 'marginH':
      return [
        compileSingleProp('marginLeft', value, compileName, compileValue),
        compileSingleProp('marginRight', value, compileName, compileValue)
      ];
    case 'marginV':
      return [
        compileSingleProp('marginTop', value, compileName, compileValue),
        compileSingleProp('marginBottom', value, compileName, compileValue)
      ];

    default: {
      return [compileSingleProp(name, value, compileName, compileValue)];
    }
  }
}

function compileSingleProp(name, value, compileName, compileValue) {
  return `${compileName(name)}:${compileValue(name, value)}`;
}

function compileBorder(name, value, compileName, compileValue) {
  let props = [];
  if (value.width != null) {
    props.push(
      compileSingleProp(name + 'Width', value.width, compileName, compileValue)
    );
  }
  if (value.style != null) {
    props.push(
      compileSingleProp(name + 'Style', value.style, compileName, compileValue)
    );
  }
  if (value.color != null) {
    props.push(
      compileSingleProp(name + 'Color', value.color, compileName, compileValue)
    );
  }
  return props;
}

function compileBackground(value, compileName, compileValue) {
  let props = [];
  if (value.attachment != null) {
    props.push(
      compileSingleProp('backgroundAttachment', value.attachment, compileName, compileValue)
    );
  }
  if (value.color != null) {
    props.push(
      compileSingleProp('backgroundColor', value.color, compileName, compileValue)
    );
  }
  if (value.image != null) {
    props.push(
      compileSingleProp('backgroundImage', value.image, compileName, compileValue)
    );
  }
  if (value.position != null) {
    props.push(
      compileSingleProp('backgroundPosition', value.position, compileName, compileValue)
    );
  }
  if (value.repeat != null) {
    props.push(
      compileSingleProp('backgroundRepeat', value.repeat, compileName, compileValue)
    );
  }
  return props;
}

function compileLayout(name, value, compileName, compileValue) {
  let props = [];
  if (value.top != null) {
    props.push(
      compileSingleProp(name + 'Top', value.top, compileName, compileValue)
    );
  }
  if (value.right != null) {
    props.push(
      compileSingleProp(name + 'Right', value.right, compileName, compileValue)
    );
  }
  if (value.bottom != null) {
    props.push(
      compileSingleProp(name + 'Bottom', value.bottom, compileName, compileValue)
    );
  }
  if (value.left != null) {
    props.push(
      compileSingleProp(name + 'Left', value.left, compileName, compileValue)
    );
  }
  return props;
}

function compileBoxShadow(value, compileName, compileValue) {
  let {x = 0, y = 0, blur = 0, spread = 0, color = '#000', inset = false} = value;
  let css = `${String(x)}px ${String(y)}px ${String(blur)}px ${String(spread)}px ${String(color)}`;
  if (inset) {
    css = 'inset ' + css;
  }
  return [compileSingleProp('boxShadow', css, compileName, compileValue)];
}

function compileTextShadow(value, compileName, compileValue) {
  let {x = 0, y = 0, blur = 0, color = '#000'} = value;
  let css = `${String(x)}px ${String(y)}px ${String(blur)}px ${String(color)}`;
  return [compileSingleProp('textShadow', css, compileName, compileValue)];
}
