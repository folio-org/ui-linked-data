import { ApiErrorCodes } from '@/common/constants/api.constants';
import { checkHasErrorOfCodeType, loadSimpleLookup } from '@/common/helpers/api.helper';

const mockGetLookupDict = jest.fn();
jest.mock('@/common/api/base.api');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));
jest.mock('@/common/api/lookup.api', () => ({
  getLookupDict: (...args: unknown[]) => mockGetLookupDict(...args),
}));

describe('api.helper', () => {
  describe('loadSimpleLookup', () => {
    test('http url containing id.loc.gov switches to https', async () => {
      await loadSimpleLookup('http://id.loc.gov/vocabulary/millus');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'https://id.loc.gov/vocabulary/millus.json',
        expect.anything(),
        expect.anything(),
      );
    });

    test('http url containing subdomain of id.loc.gov switches to https', async () => {
      await loadSimpleLookup('http://preprod.id.loc.gov/authorities/names');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'https://preprod.id.loc.gov/authorities/names.json',
        expect.anything(),
        expect.anything(),
      );
    });

    test('any other http url does not switch to https', async () => {
      await loadSimpleLookup('http://some-other-domain/lookup/id');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'http://some-other-domain/lookup/id.json',
        expect.anything(),
        expect.anything(),
      );
    });

    test('no change for https url', async () => {
      await loadSimpleLookup('https://id.loc.gov/vocabulary/millus');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'https://id.loc.gov/vocabulary/millus.json',
        expect.anything(),
        expect.anything(),
      );
    });

    test('no change to https for query parameter value', async () => {
      await loadSimpleLookup('http://some-other-domain/vocabulary/millus?q=http://id.loc.gov/resources/');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'http://some-other-domain/vocabulary/millus.json?q=http://id.loc.gov/resources/',
        expect.anything(),
        expect.anything(),
      );
    });

    test('same origin is not set for http url', async () => {
      await loadSimpleLookup('http://some-other-domain/id');
      expect(mockGetLookupDict).toHaveBeenCalledWith(expect.anything(), expect.anything(), false);
    });

    test('same origin is not set for https url', async () => {
      await loadSimpleLookup('https://some-other-domain/id');
      expect(mockGetLookupDict).toHaveBeenCalledWith(expect.anything(), expect.anything(), false);
    });

    test('same origin is set for relative path', async () => {
      await loadSimpleLookup('/linked-data/vocabularies/millus');
      expect(mockGetLookupDict).toHaveBeenCalledWith(expect.anything(), expect.anything(), true);
    });

    test('add .json for http url', async () => {
      await loadSimpleLookup('http://some-other-domain/id');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'http://some-other-domain/id.json',
        expect.anything(),
        expect.anything(),
      );
    });

    test('add .json for https url', async () => {
      await loadSimpleLookup('https://some-other-domain/id');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'https://some-other-domain/id.json',
        expect.anything(),
        expect.anything(),
      );
    });

    test('do not add .json for local path', async () => {
      await loadSimpleLookup('/linked-data/vocabularies/millus');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        '/linked-data/vocabularies/millus',
        expect.anything(),
        expect.anything(),
      );
    });

    test('do not add .json if already .rdf', async () => {
      await loadSimpleLookup('https://some-other-domain/id.rdf');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'https://some-other-domain/id.rdf',
        expect.anything(),
        expect.anything(),
      );
    });

    test('.rdf in url sets isText to true', async () => {
      await loadSimpleLookup('http://some-other-domain/id.rdf');
      expect(mockGetLookupDict).toHaveBeenCalledWith(expect.anything(), true, expect.anything());
    });

    test('.xml in url sets isText to true', async () => {
      await loadSimpleLookup('http://some-other-domain/id.xml');
      expect(mockGetLookupDict).toHaveBeenCalledWith(expect.anything(), true, expect.anything());
    });

    test('no rdf/xml suffix in url sets isText to false', async () => {
      await loadSimpleLookup('http://some-other-domain/id');
      expect(mockGetLookupDict).toHaveBeenCalledWith(expect.anything(), false, expect.anything());
    });

    test('parameters are unaffected by URI reformatting', async () => {
      await loadSimpleLookup('http://id.loc.gov/vocabulary/msomething?memberOf=http://id.loc.gov/something');
      expect(mockGetLookupDict).toHaveBeenCalledWith(
        'https://id.loc.gov/vocabulary/msomething.json?memberOf=http://id.loc.gov/something',
        expect.anything(),
        expect.anything(),
      );
    });

    test('local path parameters are ignored in determining if text expected', async () => {
      await loadSimpleLookup('/msomething.rdf?memberOf=http://id.loc.gov/something.json');
      expect(mockGetLookupDict).toHaveBeenCalledWith(expect.anything(), true, expect.anything());
    });
  });

  describe('checkHasErrorOfCodeType', () => {
    test('returns matching error', () => {
      expect(
        checkHasErrorOfCodeType({ errors: [{ code: ApiErrorCodes.AlreadyExists }] }, ApiErrorCodes.AlreadyExists),
      ).toBeTruthy();
    });
  });
});
