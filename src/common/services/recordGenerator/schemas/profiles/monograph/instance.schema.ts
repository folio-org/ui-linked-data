import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

export const monographInstanceRecordSchema: RecordSchema = {
  'http://bibfra.me/vocab/lite/Instance': {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntity: true,
      references: [
        {
          outputField: '_workReference',
        },
      ],
    },
    fields: {
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
                'http://bibfra.me/vocab/marc/subTitle': {
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
                'http://bibfra.me/vocab/bflc/nonSortNum': {
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
      'http://bibfra.me/vocab/marc/statementOfResponsibility': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'http://bibfra.me/vocab/marc/edition': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'https://bibfra.me/vocab/marc/provisionActivity': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
        fields: {
          'http://bibfra.me/vocab/marc/publication': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
            fields: {
              'http://bibfra.me/vocab/marc/date': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/name': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/providerDate': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/place': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/providerPlace': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  'http://bibfra.me/vocab/lite/name': {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  'http://bibfra.me/vocab/marc/code': {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  'http://bibfra.me/vocab/lite/label': {
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
          'http://bibfra.me/vocab/marc/distribution': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
            fields: {
              'http://bibfra.me/vocab/marc/date': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/name': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/providerDate': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/place': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/lite/providerPlace': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  'http://bibfra.me/vocab/lite/name': {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  'http://bibfra.me/vocab/marc/code': {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  'http://bibfra.me/vocab/lite/label': {
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
        },
      },
      'http://bibfra.me/vocab/marc/copyright': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          valueContainer: {
            field: 'http://bibfra.me/vocab/lite/date',
            type: 'array'
          }
        },
      },
      'http://bibfra.me/vocab/marc/issuance': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'http://library.link/vocab/map': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://library.link/identifier/LCCN': {
            type: RecordSchemaEntryType.object,
            fields: {
              'http://bibfra.me/vocab/lite/name': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/marc/status': {
                type: RecordSchemaEntryType.object,
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
            },
          },
          'http://library.link/identifier/ISBN': {
            type: RecordSchemaEntryType.object,
            fields: {
              'http://bibfra.me/vocab/lite/name': {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              'http://bibfra.me/vocab/marc/status': {
                type: RecordSchemaEntryType.object,
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
          },
          value: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/supplementaryContent': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://bibfra.me/vocab/lite/link': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/lite/name': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/media': {
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
      'http://bibfra.me/vocab/lite/extent': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'http://bibfra.me/vocab/marc/dimensions': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      'http://bibfra.me/vocab/marc/carrier': {
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
      'http://bibfra.me/vocab/marc/accessLocation': {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          'http://bibfra.me/vocab/lite/link': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          'http://bibfra.me/vocab/lite/note': {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      _workReference: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        options: {
          isReference: true,
        },
        fields: {
          id: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
    },
  },
};
