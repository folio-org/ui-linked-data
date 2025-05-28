import { RecordModelType } from '@common/constants/recordModel.constants';

export const monographWorkModel: RecordModel = {
  'http://bibfra.me/vocab/lite/Work': {
    type: RecordModelType.object,
    options: {
      isRootEntity: true,
      references: [
        {
          outputField: '_instanceReference',
        },
      ],
    },
    fields: {
      _creatorReference: {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          id: {
            type: RecordModelType.string,
            value: RecordModelType.string,
          },
          roles: {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/title': {
        type: RecordModelType.array,
        value: {
          type: RecordModelType.object,
          fields: {
            'http://bibfra.me/vocab/marc/Title': {
              type: RecordModelType.object,
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/bflc/nonSortNum': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
              },
            },
            'http://bibfra.me/vocab/marc/VariantTitle': {
              type: RecordModelType.object,
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/subTitle': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/lite/note': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/lite/date': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/lite/variantType': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
              },
            },
            'http://bibfra.me/vocab/marc/ParallelTitle': {
              type: RecordModelType.object,
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/marc/subTitle': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/lite/note': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
                'http://bibfra.me/vocab/lite/date': {
                  type: RecordModelType.array,
                  value: RecordModelType.string,
                },
              },
            },
          },
        },
      },
      'http://bibfra.me/vocab/marc/governmentPublication': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/marc/term': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      'http://bibfra.me/vocab/lite/dateStart': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'http://bibfra.me/vocab/marc/originPlace': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/lite/name': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/targetAudience': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/marc/term': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      _contributorReference: {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          id: {
            type: RecordModelType.string,
            value: RecordModelType.string,
          },
          roles: {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      _notes: {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          type: {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          value: {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/summary': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'http://bibfra.me/vocab/marc/tableOfContents': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'http://bibfra.me/vocab/marc/content': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/marc/code': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      'http://bibfra.me/vocab/lite/language': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/marc/code': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/marc/term': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/lite/link': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
    },
  },
};
