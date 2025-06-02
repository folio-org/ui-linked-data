import { BFLITE_URIS, SIMPLE_LOOKUP_MAPPING } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

export const monographInstanceRecordSchema: RecordSchema = {
  [BFLITE_URIS.INSTANCE]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
      references: [
        {
          outputField: '_workReference',
        },
      ],
    },
    fields: {
      [BFLITE_URIS.TITLE]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.TITLE]: {
            type: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.MARC_PART_NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_PART_NUMBER]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MAIN_TITLE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_SUB_TITLE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.BFLC_NON_SORT_NUM]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
            },
          },
          [BFLITE_URIS.MARC_VARIANT_TITLE]: {
            type: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.MARC_PART_NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_PART_NUMBER]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MAIN_TITLE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_SUB_TITLE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.BFLC_NON_SORT_NUM]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
            },
          },
          [BFLITE_URIS.MARC_PARALLEL_TITLE]: {
            type: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.MARC_PART_NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_PART_NUMBER]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MAIN_TITLE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_SUB_TITLE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.NOTE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
            },
          },
        },
      },
      [BFLITE_URIS.MARC_STATEMENT_OF_RESPONSIBILITY]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.EDITION]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.PROVISION_ACTIVITY]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: true,
        },
        fields: {
          [BFLITE_URIS.PUBLICATION]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.MARC_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PROVIDER_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.PROVIDER_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  [BFLITE_URIS.NAME]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LABEL]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LINK]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                },
              },
            },
          },
          [BFLITE_URIS.DISTRIBUTION]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.MARC_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PROVIDER_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.PROVIDER_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  [BFLITE_URIS.NAME]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LABEL]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LINK]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                },
              },
            },
          },
          [BFLITE_URIS.MANUFACTURE]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.MARC_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PROVIDER_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.PROVIDER_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  [BFLITE_URIS.NAME]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LABEL]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LINK]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                },
              },
            },
          },
          [BFLITE_URIS.PRODUCTION]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.MARC_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PROVIDER_DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.LITE_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.PROVIDER_PLACE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  [BFLITE_URIS.NAME]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LABEL]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LINK]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                },
              },
            },
          },
        },
      },
      [BFLITE_URIS.COPYRIGHT]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          valueContainer: {
            field: BFLITE_URIS.DATE,
            type: 'array',
          },
        },
      },
      [BFLITE_URIS.ISSUANCE]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.MAP]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.IDENTIFIER_LCCN]: {
            type: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_STATUS]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  [BFLITE_URIS.MARC_LABEL]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LINK]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                },
              },
            },
          },
          [BFLITE_URIS.IDENTIFIER_ISBN]: {
            type: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.NAME]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.MARC_STATUS]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.object,
                fields: {
                  [BFLITE_URIS.MARC_LABEL]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                  [BFLITE_URIS.LINK]: {
                    type: RecordSchemaEntryType.array,
                    value: RecordSchemaEntryType.string,
                  },
                },
              },
            },
          },
        },
      },
      [BFLITE_URIS.NOTES]: {
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
      [BFLITE_URIS.MARC_SUPPLEMENTARY_CONTENT]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.LINK]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          [BFLITE_URIS.NAME]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      [BFLITE_URIS.MARC_MEDIA]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.CODE]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          [BFLITE_URIS.TERM]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          [BFLITE_URIS.LINK]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      [BFLITE_URIS.EXTENT]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.MARC_DIMENSIONS]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.MARC_CARRIER]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.TERM]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          [BFLITE_URIS.LINK]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      [BFLITE_URIS.MARC_ACCESS_LOCATION]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.LINK]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          [BFLITE_URIS.NOTE]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
    },
  },
};