import { SIMPLE_LOOKUP_MAPPING } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

export const monographWorkRecordSchema: RecordSchema = {
  'http://bibfra.me/vocab/lite/Work': {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
      references: [
        {
          outputField: '_instanceReference',
        },
      ],
    },
    fields: {
      _creatorReference: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          _name: {
            type: RecordSchemaEntryType.string,
            value: RecordSchemaEntryType.string,
          },
          roles: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
            options: {
              mappedValues: SIMPLE_LOOKUP_MAPPING._contributions,
            },
          },
        },
      },
      'http://bibfra.me/vocab/marc/title': {
        type: RecordSchemaEntryType.array,
        value: {
          type: RecordSchemaEntryType.object,
          fields: {
            'http://bibfra.me/vocab/marc/Title': {
              type: RecordSchemaEntryType.object,
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/bflc/nonSortNum': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
              },
            },
            'http://bibfra.me/vocab/marc/VariantTitle': {
              type: RecordSchemaEntryType.object,
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/subTitle': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/lite/note': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/lite/date': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/lite/variantType': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
              },
            },
            'http://bibfra.me/vocab/marc/ParallelTitle': {
              type: RecordSchemaEntryType.object,
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/marc/subTitle': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/lite/note': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
                'http://bibfra.me/vocab/lite/date': {
                  type: RecordSchemaEntryType.array,
                  value: RecordSchemaEntryType.string,
                },
              },
            },
          },
        },
      },
      'http://bibfra.me/vocab/marc/governmentPublication': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://bibfra.me/vocab/marc/term': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://bibfra.me/vocab/lite/dateStart': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'http://bibfra.me/vocab/marc/originPlace': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://bibfra.me/vocab/lite/name': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://id.loc.gov/ontologies/bibframe/geographicCoverage': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          _geographicCoverageReference: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/targetAudience': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://bibfra.me/vocab/marc/term': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      _contributorReference: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          _name: {
            type: RecordSchemaEntryType.string,
            value: RecordSchemaEntryType.string,
          },
          roles: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
            options: {
              mappedValues: SIMPLE_LOOKUP_MAPPING._contributions,
            },
          },
        },
      },
      _notes: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          type: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
            options: {
              mappedValues: SIMPLE_LOOKUP_MAPPING._notes,
            },
          },
          value: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/summary': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'http://bibfra.me/vocab/lite/subject': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          label: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/tableOfContents': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'http://bibfra.me/vocab/lite/classification': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
          sourceField: 'http://bibfra.me/vocab/marc/source',
        },
        fields: {
          lc: {
            type: RecordSchemaEntryType.object,
            fields: {
              'http://bibfra.me/vocab/marc/code': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/marc/itemNumber': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/marc/status': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  'http://bibfra.me/vocab/marc/label': {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  'http://bibfra.me/vocab/lite/link': {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                },
              },
              _assigningSourceReference: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
            },
          },
          ddc: {
            type: RecordSchemaEntryType.object,
            fields: {
              'http://bibfra.me/vocab/marc/code': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/marc/itemNumber': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/marc/edition': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/marc/editionNumber': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              _assigningSourceReference: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
            },
          },
        },
      },
      'http://bibfra.me/vocab/marc/content': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://bibfra.me/vocab/marc/code': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://bibfra.me/vocab/lite/language': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://bibfra.me/vocab/marc/code': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/marc/term': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
    },
  },
};
