import { getFilenameWithoutExtension, getUrlFilenameWithoutExtension } from '@/common/helpers/filename.helper';

describe('filename.helper', () => {
  describe('getFilenameWithoutExtension', () => {
    it('empty input, empty result', () => {
      const result = getFilenameWithoutExtension('');
      expect(result).toEqual('');
    });

    it('extensionless filename is returned as is', () => {
      const result = getFilenameWithoutExtension('extensionless');
      expect(result).toEqual('extensionless');
    });

    it('filename with only extension is returned as is', () => {
      const result = getFilenameWithoutExtension('.rdf');
      expect(result).toEqual('.rdf');
    });

    it('filename with extension is returned without the extension', () => {
      const result = getFilenameWithoutExtension('resources.json');
      expect(result).toEqual('resources');
    });

    it('filename with extra periods returned without the final extension', () => {
      const result = getFilenameWithoutExtension('resources.extra.dots.json');
      expect(result).toEqual('resources.extra.dots');
    });
  });

  describe('getUrlFilenameWithoutExtension', () => {
    it('empty input, empty result', () => {
      const result = getUrlFilenameWithoutExtension('');
      expect(result).toEqual('');
    });

    it('invalid URL is returned with some sanitizing', () => {
      const result = getUrlFilenameWithoutExtension('not-A-url/');
      expect(result).toEqual('not-A-url-');
    });

    it('URL without a path returns the hostname', () => {
      const result = getUrlFilenameWithoutExtension('http://this.will.be.the.name/');
      expect(result).toEqual('this.will.be.the.name');
    });

    it('URL path of slashes returns the hostname', () => {
      const result = getUrlFilenameWithoutExtension('https://this.will.be.the.name//////');
      expect(result).toEqual('this.will.be.the.name');
    });

    it('URL ending in slashes uses the last path segment removing extension', () => {
      const result = getUrlFilenameWithoutExtension('https://this.will.not.be.the.name///but.this.one.will//');
      expect(result).toEqual('but.this.one');
    });

    it('URL ending with filename returns filename without extension', () => {
      const result = getUrlFilenameWithoutExtension('https://some.host/leading/up/to/the/filename.json');
      expect(result).toEqual('filename');
    });
  });
});
