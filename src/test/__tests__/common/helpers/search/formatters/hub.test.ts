import { formatHubItem } from '@common/helpers/search/formatters/hub';

const mockHubData = [
  {
    suggestLabel: 'Beta (Computer file) suggest',
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
    suggestLabel: 'Alpha Test suggest',
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
    expect(firstItem.hub.label).toBe('Beta (Computer file) suggest');
    expect(firstItem.hub.uri).toBe('test_uri/test_token');
    expect(firstItem.auth.label).toBe('ld.yes');
    expect(firstItem.rda.label).toBe('ld.yes');

    // Test second item without Auth and RDA notes
    const secondItem = result[1];
    expect(secondItem.__meta.id).toBe('test-hub-id');
    expect(secondItem.hub.label).toBe('Alpha Test suggest');
    expect(secondItem.auth.label).toBe(undefined);
    expect(secondItem.rda.label).toBe(undefined);
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

    expect(result[0].rda.label).toBe('ld.yes');
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

    expect(result[0].auth.label).toBe('ld.yes');
  });

  describe('suggestLabel handling', () => {
    test('uses suggestLabel when present', () => {
      const result = formatHubItem([{ ...mockHubData[0], suggestLabel: 'Custom Suggest Label' }]);

      expect(result[0].hub.label).toBe('Custom Suggest Label');
    });

    test('uses empty string when suggestLabel is empty string', () => {
      const result = formatHubItem([{ ...mockHubData[0], suggestLabel: '' }]);

      expect(result[0].hub.label).toBe('');
    });

    test('preserves suggestLabel with special characters', () => {
      const specialLabel = 'Test <>&"\'@#$%^&*()';
      const result = formatHubItem([{ ...mockHubData[0], suggestLabel: specialLabel }]);

      expect(result[0].hub.label).toBe(specialLabel);
    });

    test('handles suggestLabel with only whitespace', () => {
      const result = formatHubItem([{ ...mockHubData[0], suggestLabel: '   ' }]);

      expect(result[0].hub.label).toBe('   ');
    });

    test('handles very long suggestLabel', () => {
      const longLabel = 'A'.repeat(500);
      const result = formatHubItem([{ ...mockHubData[0], suggestLabel: longLabel }]);

      expect(result[0].hub.label).toBe(longLabel);
      expect(result[0].hub.label).toHaveLength(500);
    });
  });

  describe('uri handling', () => {
    test('uses uri when present', () => {
      const result = formatHubItem([{ ...mockHubData[0], uri: 'custom/uri/path' }]);

      expect(result[0].hub.uri).toBe('custom/uri/path');
    });

    test('uses empty string when uri is missing', () => {
      const hubWithoutUri: Partial<HubSearchResultDTO> = { ...mockHubData[0] };
      delete hubWithoutUri.uri;

      const result = formatHubItem([hubWithoutUri as HubSearchResultDTO]);

      expect(result[0].hub.uri).toBe('');
    });

    test('uses empty string when uri is empty string', () => {
      const result = formatHubItem([{ ...mockHubData[0], uri: '' }]);

      expect(result[0].hub.uri).toBe('');
    });

    test('handles uri with special characters', () => {
      const specialUri = 'http://example.com/test?param=value&other=123#anchor';
      const result = formatHubItem([{ ...mockHubData[0], uri: specialUri }]);

      expect(result[0].hub.uri).toBe(specialUri);
    });
  });

  describe('token handling', () => {
    test('uses token as __meta.id when present', () => {
      const result = formatHubItem([{ ...mockHubData[0], token: 'custom-token-123' }]);

      expect(result[0].__meta.id).toBe('custom-token-123');
    });

    test('uses empty string when token is missing', () => {
      const hubWithoutToken: Partial<HubSearchResultDTO> = { ...mockHubData[0] };
      delete hubWithoutToken.token;

      const result = formatHubItem([hubWithoutToken as HubSearchResultDTO]);

      expect(result[0].__meta.id).toBe('');
    });

    test('uses empty string when token is empty string', () => {
      const result = formatHubItem([{ ...mockHubData[0], token: '' }]);

      expect(result[0].__meta.id).toBe('');
    });

    test('handles token with special characters', () => {
      const specialToken = 'token-with_special.chars@123';
      const result = formatHubItem([{ ...mockHubData[0], token: specialToken }]);

      expect(result[0].__meta.id).toBe(specialToken);
    });
  });

  describe('notes handling', () => {
    test('handles empty notes array', () => {
      const hubWithEmptyNotes = {
        ...mockHubData[0],
        more: { ...mockHubData[0].more, notes: [] },
      };

      const result = formatHubItem([hubWithEmptyNotes]);

      expect(result[0].auth.label).toBeUndefined();
      expect(result[0].rda.label).toBeUndefined();
    });

    test('handles missing notes array', () => {
      const hubWithoutNotes: HubSearchResultDTO = {
        ...mockHubData[0],
        more: { ...mockHubData[0].more, notes: undefined as unknown as string[] },
      };

      const result = formatHubItem([hubWithoutNotes]);

      expect(result[0].auth.label).toBeUndefined();
      expect(result[0].rda.label).toBeUndefined();
    });

    test('handles missing more object', () => {
      const hubWithoutMore: HubSearchResultDTO = {
        ...mockHubData[0],
        more: undefined as unknown as HubSearchResultDTO['more'],
      };

      const result = formatHubItem([hubWithoutMore]);

      expect(result[0].auth.label).toBeUndefined();
      expect(result[0].rda.label).toBeUndefined();
    });

    test('detects auth note in various positions', () => {
      const hubWithAuthInMiddle = {
        ...mockHubData[0],
        more: {
          ...mockHubData[0].more,
          notes: ['First note', 'Second note', 'Created from auth.', 'Last note'],
        },
      };

      const result = formatHubItem([hubWithAuthInMiddle]);

      expect(result[0].auth.label).toBe('ld.yes');
    });

    test('detects RDA note in various formats', () => {
      const testCases = [
        ['040 $aDLC$beng$erda'],
        ['040$erda'],
        ['Some prefix 040 text $erda suffix'],
        ['040 $aTest$erda$cOther'],
      ];

      for (const notes of testCases) {
        const hubWithRDA = {
          ...mockHubData[0],
          more: { ...mockHubData[0].more, notes },
        };

        const result = formatHubItem([hubWithRDA]);

        expect(result[0].rda.label).toBe('ld.yes');
      }
    });

    test('does not detect RDA when pattern does not match', () => {
      const testCases = [
        ['040 $aDLC$beng'],
        ['erda without 040'],
        ['040 no dollar erda'],
      ];

      for (const notes of testCases) {
        const hubWithoutRDA = {
          ...mockHubData[0],
          more: { ...mockHubData[0].more, notes },
        };

        const result = formatHubItem([hubWithoutRDA]);

        expect(result[0].rda.label).toBeUndefined();
      }
    });

    test('detects both auth and RDA when both present', () => {
      const hubWithBoth = {
        ...mockHubData[0],
        more: {
          ...mockHubData[0].more,
          notes: ['Created from auth.', '040 $erda', 'Other note'],
        },
      };

      const result = formatHubItem([hubWithBoth]);

      expect(result[0].auth.label).toBe('ld.yes');
      expect(result[0].rda.label).toBe('ld.yes');
    });

    test('handles notes with very long strings', () => {
      const longNote = 'A'.repeat(1000);
      const hubWithLongNote = {
        ...mockHubData[0],
        more: {
          ...mockHubData[0].more,
          notes: [longNote, 'Created from auth.'],
        },
      };

      const result = formatHubItem([hubWithLongNote]);

      expect(result[0].auth.label).toBe('ld.yes');
    });
  });
});
