import { GitIgnoreMergeStrategy, PackageJsonMergeStrategy } from '../../lib/MergeStrategy';

describe('MergeStrategy', () => {
  describe('PackageJsonMergeStrategy', () => {
    it('can merge json', async () => {
      expect(await new PackageJsonMergeStrategy().merge(
        {
          name: 'p1',
          keywords: ['k1', 'k2']
        },
        {
          name: 'p2',
          keywords: ['k3', 'k2']
        }
      )).toStrictEqual({ name: 'p2', keywords: ['k3', 'k2', 'k1'] });
    })
  });
  
  describe('GitIgnoreMergeStrategy', () => {
    it('can merge files and deduplicate entries', async () => {
      expect(await new GitIgnoreMergeStrategy().merge(['a', 'b', 'd'], ['d', 'c', 'a']))
        .toStrictEqual(['d', 'c', 'a', 'b']);
    })
  });
});
