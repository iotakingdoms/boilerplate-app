import { GitIgnoreFileReader, PackageJsonFileReader } from '../../lib/FileReader';

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

const fs = require("fs");

describe('FileReader', () => {
  describe('PackageJsonFileReader', () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it('can read package.json', async () => {
      fs.promises.readFile.mockImplementationOnce(() => '{"name": "a"}');
      expect(await new PackageJsonFileReader().read('./package.json'))
        .toStrictEqual({ name: 'a' });
      expect(fs.promises.readFile).toHaveBeenCalledWith('./package.json', 'utf8');
    });
  });
  
  describe('GitIgnoreFileReader', () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it('can read .gitignore', async () => {
      fs.promises.readFile.mockImplementationOnce(() => 'line1\nline2\nline3');
      expect(await new GitIgnoreFileReader().read('./.gitignore'))
        .toStrictEqual(['line1', 'line2', 'line3']);
      expect(fs.promises.readFile).toHaveBeenCalledWith('./.gitignore', 'utf8');
    });
  });
});
