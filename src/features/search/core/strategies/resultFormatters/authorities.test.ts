import { AuthoritiesResultFormatter } from './authorities';

describe('AuthoritiesResultFormatter', () => {
  let formatter: AuthoritiesResultFormatter;

  const mockAuthoritiesList = [
    {
      authority: {
        id: '1',
        authRefType: 'testType_1',
        headingRef: 'testHeading_1',
        headingType: 'testHeadingType_1',
        sourceFileId: 'testSource_1',
      },
      isAnchor: true,
    },
  ];

  beforeEach(() => {
    formatter = new AuthoritiesResultFormatter();
  });

  it('returns an empty array when authoritiesList is empty', () => {
    const result = formatter.format([]);

    expect(result).toEqual([]);
  });

  it('formats authority items correctly when authority is present', () => {
    const testResult = [
      {
        __meta: {
          id: '1',
          key: expect.any(String),
          isAnchor: true,
        },
        authorized: {
          label: 'testType_1',
        },
        title: {
          label: 'testHeading_1',
          className: 'title',
        },
        subclass: {
          label: 'testHeadingType_1',
          className: 'heading-type',
        },
        authoritySource: {
          label: 'testSource_1',
          className: 'authority-source',
        },
      },
    ];

    const result = formatter.format(mockAuthoritiesList as unknown as AuthorityAsBrowseResultDTO[]);

    expect(result).toEqual(testResult);
  });

  it('formats authority items correctly when authority is not present', () => {
    const authoritiesListWithoutAuthority = [
      {
        id: '2',
        authRefType: 'testType_2',
        headingRef: 'testHeading_2',
        headingType: 'testHeadingType_2',
        sourceFileId: 'testSource_2',
        isAnchor: false,
      },
    ];
    const testResult = [
      {
        __meta: {
          id: '2',
          key: expect.any(String),
          isAnchor: false,
        },
        authorized: {
          label: 'testType_2',
        },
        title: {
          label: 'testHeading_2',
          className: 'title',
        },
        subclass: {
          label: 'testHeadingType_2',
          className: 'heading-type',
        },
        authoritySource: {
          label: 'testSource_2',
          className: 'authority-source',
        },
      },
    ];

    const result = formatter.format(authoritiesListWithoutAuthority);

    expect(result).toEqual(testResult);
  });

  it('uses sourceData to find source label', () => {
    const sourceData = [{ id: 'testSource_1', name: 'Source Name 1' }];
    const testResult = [
      {
        __meta: {
          id: '1',
          key: expect.any(String),
          isAnchor: true,
        },
        authorized: {
          label: 'testType_1',
        },
        title: {
          label: 'testHeading_1',
          className: 'title',
        },
        subclass: {
          label: 'testHeadingType_1',
          className: 'heading-type',
        },
        authoritySource: {
          label: 'Source Name 1',
          className: 'authority-source',
        },
      },
    ];

    const result = formatter.format(
      mockAuthoritiesList as unknown as AuthorityAsBrowseResultDTO[],
      sourceData as SourceDataDTO,
    );

    expect(result).toEqual(testResult);
  });

  it('uses sourceFileId as source label when sourceData does not match', () => {
    const authoritiesListWithDifferentSource = [
      {
        authority: {
          id: '3',
          authRefType: 'testType_3',
          headingRef: 'testHeading_3',
          headingType: 'testHeadingType_3',
          sourceFileId: 'testSource_3',
        },
        isAnchor: false,
      },
    ];
    const sourceData = [{ id: 'testSource_4', name: 'Source Name 4' }];
    const testResult = [
      {
        __meta: {
          id: '3',
          key: expect.any(String),
          isAnchor: false,
        },
        authorized: {
          label: 'testType_3',
        },
        title: {
          label: 'testHeading_3',
          className: 'title',
        },
        subclass: {
          label: 'testHeadingType_3',
          className: 'heading-type',
        },
        authoritySource: {
          label: 'testSource_3',
          className: 'authority-source',
        },
      },
    ];

    const result = formatter.format(
      authoritiesListWithDifferentSource as unknown as AuthorityAsBrowseResultDTO[],
      sourceData as SourceDataDTO,
    );

    expect(result).toEqual(testResult);
  });
});
