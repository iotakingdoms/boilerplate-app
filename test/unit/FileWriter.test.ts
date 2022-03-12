import { GitIgnoreFileWriter, PackageJsonFileWriter } from '../../lib/FileWriter';

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));

const fs = require("fs");

describe('FileWriter', () => {
  describe('PackageJsonFileWriter', () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it('can write package.json', async () => {
      await new PackageJsonFileWriter().write('./package.json', { name: 'a' });
      expect(fs.promises.writeFile).toHaveBeenCalledWith('./package.json', JSON.stringify({"name": "a"}, null, 2));
    });
  });
  
  describe('GitIgnoreFileWriter', () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it('can write .gitignore', async () => {
      await new GitIgnoreFileWriter().write('./.gitignore', ['line1', 'line2', 'line3']);
      expect(fs.promises.writeFile).toHaveBeenCalledWith('./.gitignore', 'line1\nline2\nline3');
    });
  });
});
