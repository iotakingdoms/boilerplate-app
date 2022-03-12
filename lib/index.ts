#!/usr/bin/env node

import {
  resolve,
  join,
  relative,
  dirname,
  extname,
  basename,
} from 'path';
import { promises } from 'fs';
import { GitIgnoreFileReader, IFileReader, PackageJsonFileReader } from './FileReader';
import { GitIgnoreFileWriter, IFileWriter, PackageJsonFileWriter } from './FileWriter';
import { GitIgnoreMergeStrategy, IMergeStrategy, PackageJsonMergeStrategy } from './MergeStrategy';

const { readdir, copyFile, mkdir, stat } = promises;

async function* getFiles(path: string): AsyncGenerator<any, any, any> | string {
  const dirents = await readdir(path, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(path, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

const mergeFiles = async (src: string, dest: string) => {
  const fileReaders: Record<string, IFileReader<any>> = {
    'package.json.template': new PackageJsonFileReader(),
    '.gitignore.template': new GitIgnoreFileReader(),
  };
  
  const fileWriters: Record<string, IFileWriter<any>> = {
    'package.json.template': new PackageJsonFileWriter(),
    '.gitignore.template': new GitIgnoreFileWriter(),
  };
  
  const mergeStrategies: Record<string, IMergeStrategy<any>> = {
    'package.json.template': new PackageJsonMergeStrategy(),
    '.gitignore.template': new GitIgnoreMergeStrategy(),
  };

  for await (const file of getFiles(src)) {
    const fileBaseName = basename(file);

    const rel = relative(src, file);
    const outfile = resolve(dest, rel.replace(new RegExp('.template$'), ''));
    const outfileBaseName = basename(outfile);
    const outdir = dirname(outfile)
    await mkdir(outdir, { recursive: true });

    try {
      await stat(outfile);

      if (!fileReaders[fileBaseName]) {
        console.log(`No file reader found for: ${file}`);
        continue;
      }
      
      if (!fileWriters[fileBaseName]) {
        console.log(`No file writer found for: ${file}`);
        continue;
      }
      
      if (!mergeStrategies[fileBaseName]) {
        console.log(`No merge strategy found for: ${file}`);
        continue;
      }

      await fileWriters[fileBaseName].write(outfile,
        await mergeStrategies[fileBaseName].merge(
          await fileReaders[fileBaseName].read(file),
          await fileReaders[fileBaseName].read(outfile)
        )
      );

      console.log(`Merged ${file} -> ${outfile}`);
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err;
      await copyFile(file, outfile);

      console.log(`Copied: ${file} -> ${outfile}`);
    }
  }
}

(async () => {
  await mergeFiles(
    join(__dirname, "../template/"),
    join(process.cwd(), "./")
  );
})();
