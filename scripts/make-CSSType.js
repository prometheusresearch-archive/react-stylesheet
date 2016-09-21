let t = require('babel-types');
let generate = require('babel-generator').default;
let parseSyntax = require('css-tree').syntax.parse;
let cssData = require('css-tree/data');
let toCamelCase = require('lodash/camelCase');

let number = t.identifier('number');
let string = t.identifier('string');

const TYPE = {
  'uri': string,
  'url': string,
  'length': number,
  'integer': number,
  'percentage': string,
  'positive-integer': number,
  'decibel': number,
  'frequency': number,
  'custom-ident': string,
  'dimension': string,
  'hex-color': string,
  'ident': string,
  'resolution': string,
  'flex': string,
  'number-one-or-greater': number,
  'unicode-range': string,
  'number-zero-one': number,
  'number': number,
  'string': string,
  'time': number,
  'angle': number,
};

function buildType(syntax, key) {
  if (syntax.type === 'Sequence') {
    let types = syntax.terms.map(p => buildType(p, key));
    return t.unionTypeAnnotation(types);
  } else if (syntax.type === 'Keyword') {
    return t.stringLiteral(syntax.name);
  } else if (syntax.type === 'Function') {
    return t.identifier('string');
  } else if (syntax.type === 'Type') {
    let type = TYPE[syntax.name];
    if (type != null) {
      return type;
    } else if (cssData.types[syntax.name] != null) {
      return t.identifier(typeName(syntax.name));
    } else {
      console.log(key, syntax);
      throw new Error('Unknown type: ' + syntax.type);
    }
  } else if (syntax.type === 'Property') {
    return t.identifier(propertyName(syntax.name));
  } else if (syntax.type === 'Group') {
    return t.identifier('string');
  } else if (syntax.type === 'Parentheses') {
    return t.identifier('string');
  } else if (syntax.type === 'String') {
    return t.identifier('string');
  } else if (syntax.type === 'Percent') {
    return t.identifier('string');
  } else if (syntax.type === 'Comma') {
    return t.identifier('string');
  } else {
    console.log(key, syntax);
    throw new Error(syntax.type);
  }
}

function normalizeType(node) {
  if (node.type === 'UnionTypeAnnotation') {
    let types = [];
    node.types.forEach(node => {
      node = normalizeType(node);
      if (node.type === 'UnionTypeAnnotation') {
        types = types.concat(node.types);
      } else {
        types.push(node);
      }
    });
    node.types = types;
    let seen = {};
    node.types = node.types.filter(node => {
      if (seen[JSON.stringify(node)]) {
        return false;
      } else {
        seen[JSON.stringify(node)] = true;
        return true;
      }
    });
    return node;
  }
  return node;
}

function typeName(name) {
  return toCamelCase(name) + 'T';
}

function propertyName(name) {
  return toCamelCase(name);
}

let statementList = [];
let propList = []

for (let key in cssData.properties) {
  let prop = parseSyntax(cssData.properties[key]);
  key = toCamelCase(key);
  statementList.push(
    t.exportNamedDeclaration(
      t.typeAlias(
        t.identifier(propertyName(key)),
        null,
        normalizeType(buildType(prop, key))
      ),
      [],
      t.stringLiteral('type')
    )
  );
  let typeProp = t.objectTypeProperty(
    t.identifier(key),
    t.identifier(propertyName(key))
  );
  typeProp.optional = true;
  propList.push(
    typeProp
  );
}

for (let key in cssData.types) {
  let type = parseSyntax(cssData.types[key]);
  statementList.push(
    t.exportNamedDeclaration(
      t.typeAlias(
        t.identifier(typeName(key)),
        null,
        normalizeType(buildType(type, key))
      ),
      [],
      t.stringLiteral('type')
    )
  );
}

let CSSPropertySetType = t.objectTypeAnnotation(propList)
CSSPropertySetType.exact = true;

statementList.push(
  t.exportNamedDeclaration(
    t.typeAlias(
      t.identifier('CSSPropertySet'),
      null,
      CSSPropertySetType
    ),
    [],
    t.stringLiteral('type')
  )
);

console.log(generate(t.program(statementList)).code);
