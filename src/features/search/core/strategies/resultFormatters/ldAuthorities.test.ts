import { LDAuthoritiesResultFormatter } from './ldAuthorities';

describe('LDAuthoritiesResultFormatter', () => {
  let formatter: LDAuthoritiesResultFormatter;

  beforeEach(() => {
    formatter = new LDAuthoritiesResultFormatter();
  });

  it('returns an empty array when data is empty', () => {
    const result = formatter.format([]);

    expect(result).toEqual([]);
  });

  it('formats a full entry correctly', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [
      {
        id: 'ld-1',
        label: 'Shakespeare, William',
        types: ['http://id.loc.gov/ontologies/bibframe/Person'],
        identifiers: [
          { value: 'n78095332', type: 'lccn' },
          { value: 'sh85122557', type: 'lccn' },
        ],
      },
    ];

    const result = formatter.format(data);

    expect(result).toEqual([
      {
        __meta: { id: 'ld-1', key: 'ld-1', isAnchor: false, isLD: true },
        label: { label: 'Shakespeare, William', className: 'title' },
        type: { label: 'Person' },
        identifiers: { label: 'n78095332, sh85122557' },
        authorized: { label: '' },
        source: { label: '' },
      },
    ]);
  });

  it('parses type label from URI (last path segment)', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [
      {
        id: 'ld-2',
        label: 'Some Label',
        types: ['http://example.com/onto/Topic'],
      },
    ];

    const result = formatter.format(data);

    expect(result[0].type).toEqual({ label: 'Topic' });
  });

  it('joins multiple types with a comma', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [
      {
        id: 'ld-3',
        label: 'Label',
        types: ['http://example.com/onto/Person', 'http://example.com/onto/Agent'],
      },
    ];

    const result = formatter.format(data);

    expect(result[0].type).toEqual({ label: 'Person, Agent' });
  });

  it('handles missing types gracefully', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [{ id: 'ld-4', label: 'Label' }];

    const result = formatter.format(data);

    expect(result[0].type).toEqual({ label: '' });
  });

  it('handles missing identifiers gracefully', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [{ id: 'ld-5', label: 'Label', types: [] }];

    const result = formatter.format(data);

    expect(result[0].identifiers).toEqual({ label: '' });
  });

  it('trims whitespace from identifier values', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [
      {
        id: 'ld-6',
        label: 'Label',
        identifiers: [
          { value: '  n001  ', type: 'lccn' },
          { value: ' n002 ', type: 'lccn' },
        ],
      },
    ];

    const result = formatter.format(data);

    expect(result[0].identifiers).toEqual({ label: 'n001, n002' });
  });

  it('generates a fallback key when id is empty', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [
      { id: '', label: 'Heading B', types: ['http://example.com/onto/Topic'] },
    ];

    const result = formatter.format(data);

    expect(result[0].__meta.id).toBe('');
    expect(result[0].__meta.key).toBeTruthy();
  });

  it('sets isLD to true for every entry', () => {
    const data: LDAuthorityAsSearchResultDTO[] = [{ id: 'ld-7', label: '' }];

    const result = formatter.format(data);

    expect(result[0].__meta.isLD).toBe(true);
  });
});
