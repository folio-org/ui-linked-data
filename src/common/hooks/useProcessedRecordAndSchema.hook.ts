import { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import { DUPLICATE_RESOURCE_TEMPLATE } from '@common/constants/resourceTemplates.constants';
import { getEditingRecordBlocks } from '@common/helpers/record.helper';
import { applyIntlToTemplates } from '@common/helpers/recordFormatting.helper';
import { ServicesContext } from '@src/contexts';

type IGetProcessedRecordAndSchema = {
  baseSchema: Map<string, SchemaEntry>;
  record: Record<string, unknown> | Array<unknown>;
  userValues: UserValues;
  asClone?: boolean;
};

export const useProcessedRecordAndSchema = () => {
  const { formatMessage } = useIntl();
  const {
    userValuesService: baseUserValuesService,
    schemaWithDuplicatesService: baseSchemaWithDuplicatesService,
    recordNormalizingService: baseRecordNormalizingService,
    recordToSchemaMappingService: baseRecordToSchemaMappingService,
  } = useContext(ServicesContext);
  const userValuesService = baseUserValuesService as IUserValues;
  const schemaWithDuplicatesService = baseSchemaWithDuplicatesService as ISchemaWithDuplicates;
  const recordNormalizingService = baseRecordNormalizingService as IRecordNormalizingService;
  const recordToSchemaMappingService = baseRecordToSchemaMappingService as IRecordToSchemaMapping;

  const getProcessedRecordAndSchema = useCallback(
    async ({ baseSchema, record, userValues, asClone = false }: IGetProcessedRecordAndSchema) => {
      let updatedSchema = baseSchema;
      let updatedUserValues = userValues;
      let selectedRecordBlocks = undefined;

      try {
        if (record && Object.keys(record).length) {
          const typedRecord = record as RecordEntry;
          const { block, reference } = getEditingRecordBlocks(typedRecord);
          const recordBlocks = [block, reference?.uri] as RecordBlocksList;
          const addDuplicateTemplate = asClone && block;
          const template = addDuplicateTemplate
            ? applyIntlToTemplates({
                templates: DUPLICATE_RESOURCE_TEMPLATE[block],
                format: formatMessage,
              })
            : undefined;

          selectedRecordBlocks = { block, reference };
          schemaWithDuplicatesService.set(baseSchema);

          recordNormalizingService.init(typedRecord, block, reference);
          const normalizedRecord = recordNormalizingService.get();

          await recordToSchemaMappingService.init({
            schema: baseSchema,
            record: normalizedRecord,
            recordBlocks,
            templateMetadata: template,
          });

          updatedSchema = recordToSchemaMappingService.get();
          updatedUserValues = userValuesService.getAllValues();
        }
      } catch (error) {
        // TODO: display an user error
        console.error(error);
      }

      return {
        updatedSchema,
        updatedUserValues,
        selectedRecordBlocks,
      };
    },
    [
      formatMessage,
      recordNormalizingService,
      recordToSchemaMappingService,
      schemaWithDuplicatesService,
      userValuesService,
    ],
  );

  return { getProcessedRecordAndSchema };
};
