import { promises, PathLike } from 'fs';
import { GitIgnoreType, PackageJsonType } from './MergeStrategy';

const { readFile } = promises;

export interface IFileReader<T> {
  read(file: PathLike): Promise<T>;
};

export class PackageJsonFileReader implements IFileReader<PackageJsonType> {
  async read(file: PathLike) {
    return JSON.parse(await readFile(file, 'utf8')) as PackageJsonType;
  }
};

export class GitIgnoreFileReader implements IFileReader<GitIgnoreType> {
  async read(file: PathLike) {
    const data = await readFile(file, 'utf8');
    return data.trim().split(/\r?\n/).filter(l => l.length > 0);;
  }
};
