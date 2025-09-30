import { formatHubItem } from '@common/helpers/search/formatters/hub';

const mockHubData = [
  {
    suggestLabel: 'Beta (Computer file)',
    uri: 'test_uri/test_token',
    aLabel: 'Beta (Computer file)',
    vLabel: '',
    sLabel: '',
    code: '',
    token: 'test_token',
    rank: '',
    more: {
      marcKeys: ['1300 $aBeta (Computer file)'],
      aaps: ['Beta (Computer file)'],
      varianttitles: [],
      rdftypes: ['Work', 'Hub', 'Multimedia'],
      collections: [],
      genres: [],
      contenttypes: [],
      languages: [],
      identifiers: ['n 93029105'],
      sources: [
        'data found: Karlsson, F. BETA-järjestelmä, 1985',
        'data found: t.p. (BETA) p. 54 (substitution grammar interpreter)',
      ],
      notes: ['t.p. (BETA) p. 54 (substitution grammar interpreter)', 'Created from auth.', '040 $aDLC$cDLC$erda'],
      subjects: [],
    },
  },
  {
    suggestLabel: 'Alpha Test',
    uri: 'test_hub_id',
    aLabel: 'Alpha Test',
    vLabel: '',
    sLabel: '',
    code: '',
    token: 'test-hub-id',
    rank: '',
    more: {
      marcKeys: [],
      aaps: [],
      varianttitles: [],
      rdftypes: [],
      collections: [],
      genres: [],
      contenttypes: [],
      languages: [],
      identifiers: [],
      sources: [],
      notes: ['Some note without auth or RDA'],
      subjects: [],
    },
  },
];

describe('formatHubItem', () => {
  test('hub data correctly', () => {
    const result = formatHubItem(mockHubData);

    expect(result).toHaveLength(2);

    // Test first item with Auth and RDA notes
    const firstItem = result[0];
    expect(firstItem.__meta.id).toBe('test_token');
    expect(firstItem.hub.label).toBe('Beta (Computer file)');
    expect(firstItem.hub.uri).toBe('test_uri/test_token');
    expect(firstItem.auth.hasNote).toBe(true);
    expect(firstItem.rda.hasNote).toBe(true);

    // Test second item without Auth and RDA notes
    const secondItem = result[1];
    expect(secondItem.__meta.id).toBe('test-hub-id');
    expect(secondItem.hub.label).toBe('Alpha Test');
    expect(secondItem.auth.hasNote).toBe(false);
    expect(secondItem.rda.hasNote).toBe(false);
  });

  test('handles empty hub list', () => {
    const result = formatHubItem([]);

    expect(result).toEqual([]);
  });

  test('detects RDA note with regex pattern', () => {
    const hubWithRDA = [
      {
        ...mockHubData[0],
        more: {
          ...mockHubData[0].more,
          notes: ['040 $aUkCU$beng$erda$cUkCU', '040 DLC $erda test'],
        },
      },
    ];

    const result = formatHubItem(hubWithRDA);

    expect(result[0].rda.hasNote).toBe(true);
  });

  test('detects auth note correctly', () => {
    const hubWithAuth = [
      {
        ...mockHubData[0],
        more: {
          ...mockHubData[0].more,
          notes: ['Some note', 'Created from auth.', 'Another note'],
        },
      },
    ];

    const result = formatHubItem(hubWithAuth);

    expect(result[0].auth.hasNote).toBe(true);
  });
});
