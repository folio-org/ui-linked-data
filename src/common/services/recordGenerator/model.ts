export const model: RecordModel = {
  'http://bibfra.me/vocab/lite/Instance': {
    type: 'object',
    fields: {
      'http://bibfra.me/vocab/marc/title': {
        type: 'array',
        value: {
          type: 'object',
          fields: {
            'http://bibfra.me/vocab/marc/Title': {
              type: 'object',
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/subTitle': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/bflc/nonSortNum': {
                  type: 'array',
                  value: 'string',
                },
              },
            },
            'http://bibfra.me/vocab/marc/VariantTitle': {
              type: 'object',
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/subTitle': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/bflc/nonSortNum': {
                  type: 'array',
                  value: 'string',
                },
              },
            },
            'http://bibfra.me/vocab/marc/ParallelTitle': {
              type: 'object',
              fields: {
                'http://bibfra.me/vocab/marc/partName': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/partNumber': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/mainTitle': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/marc/subTitle': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/lite/note': {
                  type: 'array',
                  value: 'string',
                },
                'http://bibfra.me/vocab/lite/date': {
                  type: 'array',
                  value: 'string',
                },
              },
            },
          },
        },
      },
      'http://bibfra.me/vocab/marc/edition': {
        type: 'array',
        value: 'string',
      },
      'http://bibfra.me/vocab/marc/publisher': {
        type: 'array',
        value: 'string',
      },
      'http://bibfra.me/vocab/marc/dimensions': {
        type: 'array',
        value: 'string',
      },
      'http://bibfra.me/vocab/marc/media': {
        type: 'array',
        value: 'object',
        fields: {
          'http://bibfra.me/vocab/marc/code': {
            type: 'array',
            value: 'string',
          },
          'http://bibfra.me/vocab/marc/term': {
            type: 'array',
            value: 'string',
          },
          'http://bibfra.me/vocab/lite/link': {
            type: 'array',
            value: 'string',
          },
        },
      },
      'http://bibfra.me/vocab/marc/carrier': {
        type: 'array',
        value: 'object',
        fields: {
          'http://bibfra.me/vocab/marc/code': {
            type: 'array',
            value: 'string',
          },
          'http://bibfra.me/vocab/marc/term': {
            type: 'array',
            value: 'string',
          },
          'http://bibfra.me/vocab/lite/link': {
            type: 'array',
            value: 'string',
          },
        },
      },
      'http://library.link/vocab/map': {
        type: 'array',
        value: 'object',
        fields: {
          'http://library.link/identifier/LCCN': {
            type: 'object',
            fields: {
              'http://bibfra.me/vocab/lite/name': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/marc/status': {
                type: 'object',
                fields: {
                  'http://bibfra.me/vocab/marc/label': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/lite/link': {
                    type: 'array',
                    value: 'string',
                  },
                },
              },
            },
          },
          'http://library.link/identifier/ISBN': {
            type: 'object',
            fields: {
              'http://bibfra.me/vocab/lite/name': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/marc/status': {
                type: 'object',
                fields: {
                  'http://bibfra.me/vocab/marc/label': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/lite/link': {
                    type: 'array',
                    value: 'string',
                  },
                },
              },
            },
          },
        },
      },
      'https://bibfra.me/vocab/marc/provisionActivity': {
        type: 'array',
        value: 'object',
        options: {
          hiddenWrapper: true,
        },
        fields: {
          'http://bibfra.me/vocab/marc/publication': {
            type: 'array',
            value: 'object',
            fields: {
              'http://bibfra.me/vocab/marc/date': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/name': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/providerDate': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/place': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/providerPlace': {
                type: 'array',
                value: 'object',
                fields: {
                  'http://bibfra.me/vocab/lite/name': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/marc/code': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/lite/label': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/lite/link': {
                    type: 'array',
                    value: 'string',
                  },
                },
              },
            },
          },
          'http://bibfra.me/vocab/marc/distribution': {
            type: 'array',
            value: 'object',
            fields: {
              'http://bibfra.me/vocab/marc/date': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/name': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/providerDate': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/place': {
                type: 'array',
                value: 'string',
              },
              'http://bibfra.me/vocab/lite/providerPlace': {
                type: 'array',
                value: 'object',
                fields: {
                  'http://bibfra.me/vocab/lite/name': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/marc/code': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/lite/label': {
                    type: 'array',
                    value: 'string',
                  },
                  'http://bibfra.me/vocab/lite/link': {
                    type: 'array',
                    value: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
