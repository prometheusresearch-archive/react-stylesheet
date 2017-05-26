import {classNameFor} from '../Stylesheet';

describe('classNameFor()', function() {
  it('injects base className by default', function() {
    let mapping = {
      className: 'base',
    };
    expect(classNameFor(mapping)).toBe('base');
    expect(classNameFor(mapping, {})).toBe('base');
  });

  it('injects variant', function() {
    let mapping = {
      className: 'base',
      then: {
        something: {
          className: 'something',
        },
      },
    };
    expect(classNameFor(mapping, {})).toBe('base');
    expect(classNameFor(mapping, {something: false})).toBe('base');
    expect(classNameFor(mapping, {something: true})).toBe('base something');
  });

  it('injects variant (multiple)', function() {
    let mapping = {
      className: 'base',
      then: {
        something: {
          className: 'something',
        },
        another: {
          className: 'another',
        },
      },
    };
    expect(classNameFor(mapping, {})).toBe('base');
    expect(classNameFor(mapping, {something: false})).toBe('base');
    expect(classNameFor(mapping, {something: true})).toBe('base something');
    expect(classNameFor(mapping, {another: false})).toBe('base');
    expect(classNameFor(mapping, {another: true})).toBe('base another');
    expect(classNameFor(mapping, {something: true, another: true})).toBe(
      'base something another',
    );
  });

  it('injects variant (combinations)', function() {
    let mapping = {
      className: 'base',
      then: {
        something: {
          className: 'something',
          then: {
            another: {
              className: 'another',
            },
          },
        },
      },
    };
    expect(classNameFor(mapping, {})).toBe('base');
    expect(classNameFor(mapping, {something: false})).toBe('base');
    expect(classNameFor(mapping, {something: true})).toBe('base something');
    expect(classNameFor(mapping, {another: false})).toBe('base');
    expect(classNameFor(mapping, {another: true})).toBe('base');
    expect(classNameFor(mapping, {something: true, another: true})).toBe(
      'base something another',
    );
  });
});
