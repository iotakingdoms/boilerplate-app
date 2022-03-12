import { promises, PathLike } from 'fs';
import { GitIgnoreType, PackageJsonType } from './MergeStrategy';

const { writeFile } = promises;

export interface IFileWriter<T> {
  write(file: PathLike, data: T): Promise<void>;
};

export class PackageJsonFileWriter implements IFileWriter<PackageJsonType> {
  async write(file: PathLike, data: PackageJsonType) {
    return writeFile(file, JSON.stringify(data, null, 2))
  }
};

export class GitIgnoreFileWriter implements IFileWriter<GitIgnoreType> {
  async write(file: PathLike, data: GitIgnoreType) {
    return writeFile(file, data.join('\n'));
  }
};
