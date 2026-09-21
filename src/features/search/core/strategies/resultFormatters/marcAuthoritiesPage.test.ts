import { MarcAuthoritiesPageResultFormatter } from './marcAuthoritiesPage';

describe('MarcAuthoritiesPageResultFormatter', () => {
  let formatter: MarcAuthoritiesPageResultFormatter;

  beforeEach(() => {
    formatter = new MarcAuthoritiesPageResultFormatter();
  });

  it('returns an empty array when data is empty', () => {
    const result = formatter.format([]);

    expect(result).toEqual([]);
  });

  it('formats a full entry correctly', () => {
    const data = [
      {
        id: 'auth-1',
        authRefType: 'Authorized',
        headingRef: 'Shakespeare, William',
        headingType: 'Personal Name',
        sourceFileId: 'src-1',
        sourceName: 'LC Name Authority File',
        lccn: 'n78095332',
        naturalId: '',
      },
    ];

    const result = formatter.format(data);

    expect(result).toEqual([
      {
        __meta: { id: 'auth-1', key: 'auth-1', isAnchor: false, isLD: false },
        label: { label: 'Shakespeare, William', className: 'title' },
        type: { label: 'Personal Name' },
        identifiers: { label: 'n78095332' },
        authorized: { label: 'Authorized' },
        source: { label: 'LC Name Authority File' },
      },
    ]);
  });

  it('uses naturalId when lccn is absent', () => {
    const data = [
      {
        id: 'auth-2',
        authRefType: 'Reference',
        headingRef: 'Some Heading',
        headingType: 'Topic',
        sourceFileId: 'src-2',
        sourceName: 'Source',
        naturalId: 'nat-001',
      },
    ];

    const result = formatter.format(data);

    expect(result[0].identifiers).toEqual({ label: 'nat-001' });
  });

  it('uses options.notSpecifiedLabel when sourceName is absent', () => {
    const data = [
      {
        id: 'auth-3',
        authRefType: 'Authorized',
        headingRef: 'Heading',
        headingType: 'Type',
        sourceFileId: 'src-3',
      },
    ];

    const result = formatter.format(data, undefined, { notSpecifiedLabel: 'Not specified' });

    expect(result[0].source).toEqual({ label: 'Not specified' });
  });

  it('falls back to sourceFileId when neither sourceName nor notSpecifiedLabel is provided', () => {
    const data = [
      {
        id: 'auth-4',
        authRefType: 'Authorized',
        headingRef: 'Heading',
        headingType: 'Type',
        sourceFileId: 'src-4',
      },
    ];

    const result = formatter.format(data);

    expect(result[0].source).toEqual({ label: 'src-4' });
  });

  it('generates a fallback key when id is empty', () => {
    const data = [
      {
        id: '',
        authRefType: 'Authorized',
        headingRef: 'Heading A',
        headingType: 'Topic',
        sourceFileId: '',
      },
    ];

    const result = formatter.format(data);

    expect(result[0].__meta.id).toBe('');
    expect(result[0].__meta.key).toBeTruthy();
    expect(result[0].__meta.key).not.toBe('');
  });

  it('sets isLD to false for every entry', () => {
    const data = [{ id: 'auth-5', authRefType: '', headingRef: '', headingType: '', sourceFileId: '' }];

    const result = formatter.format(data);

    expect(result[0].__meta.isLD).toBe(false);
  });
});
