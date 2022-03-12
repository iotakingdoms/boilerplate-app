import deepmerge from 'deepmerge';

describe('deepmerge', () => {
  it('combines properties with distinct names', () => {
    expect(deepmerge({ a: 1 }, { b: 1 })).toStrictEqual({ a: 1, b: 1 });
  });

  it('overwrites properties with identical names', () => {
    expect(deepmerge({ a: 1 }, { a: 2 })).toStrictEqual({ a: 2 });
  });

  it('does not produce duplicates with array unionMerge strategy', () => {
    const unionMerge = (target: any, source: any): any => [...new Set(target.concat(source))];

    expect(deepmerge({ a: [1] }, { a: [1] }, { arrayMerge: unionMerge })).toStrictEqual({ a: [1] });
    expect(deepmerge({ a: [1,2] }, { a: [1,2] }, { arrayMerge: unionMerge })).toStrictEqual({ a: [1,2] });
    expect(deepmerge({ a: [2,1] }, { a: [1,2] }, { arrayMerge: unionMerge })).toStrictEqual({ a: [2,1] });
    expect(deepmerge({ a: [2,1,3] }, { a: [1,2,3] }, { arrayMerge: unionMerge })).toStrictEqual({ a: [2,1,3] });
    expect(deepmerge({ a: [2,1,4] }, { a: [1,2,3] }, { arrayMerge: unionMerge })).toStrictEqual({ a: [2,1,4,3] });
    expect(deepmerge({ a: [{ b: 1}] }, { a: [{ b: 1}] }, { arrayMerge: unionMerge })).toStrictEqual({ a: [{ b: 1}, { b: 1 }] });
    expect(deepmerge({ a: [{ b: 1}] }, { a: [{ b: 2}] }, { arrayMerge: unionMerge })).toStrictEqual({ a: [{ b: 1}, { b: 2 }] });
  });
});
