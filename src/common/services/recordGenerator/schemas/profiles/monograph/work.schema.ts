import { SIMPLE_LOOKUP_MAPPING, BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

export const monographWorkRecordSchema: RecordSchema = {
  [BFLITE_URIS.WORK]: {
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
      [BFLITE_URIS.TITLE]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.TITLE_CONTAINER]: {
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
              [BFLITE_URIS.NOTE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.DATE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.VARIANT_TYPE]: {
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
      [BFLITE_URIS.GOVERNMENT_PUBLICATION]: {
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
      [BFLITE_URIS.DATE_START]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.ORIGIN_PLACE]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.NAME]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          [BFLITE_URIS.LINK]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      [BFLITE_URIS.GEOGRAPHIC_COVERAGE]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          _geographicCoverageReference: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      [BFLITE_URIS.TARGET_AUDIENCE]: {
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
      [BFLITE_URIS.SUMMARY]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.SUBJECT]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          label: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      [BFLITE_URIS.TABLE_OF_CONTENTS]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      },
      [BFLITE_URIS.CLASSIFICATION]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        options: {
          flattenDropdown: true,
          sourceField: BFLITE_URIS.SOURCE,
        },
        fields: {
          lc: {
            type: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.CODE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.ITEM_NUMBER]: {
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
              _assigningSourceReference: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
            },
          },
          ddc: {
            type: RecordSchemaEntryType.object,
            fields: {
              [BFLITE_URIS.CODE]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.ITEM_NUMBER]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.EDITION]: {
                type: RecordSchemaEntryType.array,
                value: RecordSchemaEntryType.string,
              },
              [BFLITE_URIS.EDITION_NUMBER]: {
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
      [BFLITE_URIS.CONTENT]: {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        fields: {
          [BFLITE_URIS.CODE]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          [BFLITE_URIS.LINK]: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      },
      [BFLITE_URIS.LANGUAGE]: {
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
    },
  },
};
