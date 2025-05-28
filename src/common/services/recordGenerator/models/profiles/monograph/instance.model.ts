import { RecordModelType } from '@common/constants/recordModel.constants';

export const monographInstanceModel: RecordModel = {
  'http://bibfra.me/vocab/lite/Instance': {
    type: RecordModelType.object,
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
                'http://bibfra.me/vocab/marc/subTitle': {
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
                'http://bibfra.me/vocab/bflc/nonSortNum': {
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
      'http://bibfra.me/vocab/marc/statementOfResponsibility': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'http://bibfra.me/vocab/marc/edition': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'https://bibfra.me/vocab/marc/provisionActivity': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        options: {
          hiddenWrapper: true,
        },
        fields: {
          'http://bibfra.me/vocab/marc/publication': {
            type: RecordModelType.array,
            value: RecordModelType.object,
            fields: {
              'http://bibfra.me/vocab/marc/date': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/name': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/providerDate': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/place': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/providerPlace': {
                type: RecordModelType.array,
                value: RecordModelType.object,
                fields: {
                  'http://bibfra.me/vocab/lite/name': {
                    type: RecordModelType.array,
                    value: RecordModelType.string,
                  },
                  'http://bibfra.me/vocab/marc/code': {
                    type: RecordModelType.array,
                    value: RecordModelType.string,
                  },
                  'http://bibfra.me/vocab/lite/label': {
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
          'http://bibfra.me/vocab/marc/distribution': {
            type: RecordModelType.array,
            value: RecordModelType.object,
            fields: {
              'http://bibfra.me/vocab/marc/date': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/name': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/providerDate': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/place': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/lite/providerPlace': {
                type: RecordModelType.array,
                value: RecordModelType.object,
                fields: {
                  'http://bibfra.me/vocab/lite/name': {
                    type: RecordModelType.array,
                    value: RecordModelType.string,
                  },
                  'http://bibfra.me/vocab/marc/code': {
                    type: RecordModelType.array,
                    value: RecordModelType.string,
                  },
                  'http://bibfra.me/vocab/lite/label': {
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
        },
      },
      'http://bibfra.me/vocab/marc/copyright': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/marc/date': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/issuance': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'http://library.link/vocab/map': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://library.link/identifier/LCCN': {
            type: RecordModelType.object,
            fields: {
              'http://bibfra.me/vocab/lite/name': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/marc/status': {
                type: RecordModelType.object,
                fields: {
                  'http://bibfra.me/vocab/marc/label': {
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
          'http://library.link/identifier/ISBN': {
            type: RecordModelType.object,
            fields: {
              'http://bibfra.me/vocab/lite/name': {
                type: RecordModelType.array,
                value: RecordModelType.string,
              },
              'http://bibfra.me/vocab/marc/status': {
                type: RecordModelType.object,
                fields: {
                  'http://bibfra.me/vocab/marc/label': {
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
      'http://bibfra.me/vocab/marc/supplementaryContent': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/lite/link': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/lite/name': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      'http://bibfra.me/vocab/marc/media': {
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
      'http://bibfra.me/vocab/lite/extent': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'http://bibfra.me/vocab/marc/dimensions': {
        type: RecordModelType.array,
        value: RecordModelType.string,
      },
      'http://bibfra.me/vocab/marc/carrier': {
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
      'http://bibfra.me/vocab/marc/accessLocation': {
        type: RecordModelType.array,
        value: RecordModelType.object,
        fields: {
          'http://bibfra.me/vocab/lite/link': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
          'http://bibfra.me/vocab/lite/note': {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
      _workReference: {
        type: RecordModelType.array,
        value: RecordModelType.object,
        options: {
          isReference: true,
        },
        fields: {
          id: {
            type: RecordModelType.array,
            value: RecordModelType.string,
          },
        },
      },
    },
  },
};
