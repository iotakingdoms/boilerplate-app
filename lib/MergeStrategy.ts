import deepmerge from 'deepmerge';

export interface IMergeStrategy<T> {
  merge(a: T, b: T): Promise<T>;
};

export type PackageJsonType = Record<string, any>;
export class PackageJsonMergeStrategy implements IMergeStrategy<PackageJsonType> {
  async merge(p1: PackageJsonType, p2: PackageJsonType) {
    return deepmerge(p1, p2, { arrayMerge: (a1, a2) => [...new Set(a2.concat(a1))] });
  }
};

export type GitIgnoreType = string[];
export class GitIgnoreMergeStrategy implements IMergeStrategy<GitIgnoreType> {
  async merge(g1: GitIgnoreType, g2: GitIgnoreType) {
    return [...new Set(g2.concat(g1))];
  }
}
