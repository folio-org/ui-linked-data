import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useIntl } from 'react-intl';
import { DUPLICATE_RESOURCE_TEMPLATE } from '@common/constants/resourceTemplates.constants';
import {
  getAdjustedRecordContents,
  getEditingRecordBlocks,
  wrapRecordValuesWithCommonContainer,
} from '@common/helpers/record.helper';
import { applyIntlToTemplates } from '@common/helpers/recordFormatting.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import state from '@state';
import { useServicesContext } from './useServicesContext';
import { useStatusStore } from '@src/store';

type IGetProcessedRecordAndSchema = {
  baseSchema: Schema;
  record: Record<string, unknown> | Array<unknown>;
  userValues: UserValues;
  asClone?: boolean;
};

export const useProcessedRecordAndSchema = () => {
  const setRecord = useSetRecoilState(state.inputs.record);
  const { addStatusMessages } = useStatusStore();
  const { formatMessage } = useIntl();
  const { userValuesService, schemaWithDuplicatesService, recordNormalizingService, recordToSchemaMappingService } =
    useServicesContext() as Required<ServicesParams>;

  const getProcessedRecordAndSchema = useCallback(
    async ({ baseSchema, record, userValues, asClone = false }: IGetProcessedRecordAndSchema) => {
      let updatedSchema = baseSchema;
      let updatedUserValues = userValues;
      let selectedRecordBlocks = undefined;

      try {
        if (record && Object.keys(record).length) {
          const typedRecord = record as RecordEntry;
          const { block, reference } = getEditingRecordBlocks(typedRecord);
          const { record: adjustedRecord } = getAdjustedRecordContents({
            record: typedRecord,
            block,
            reference,
            asClone,
          });
          const recordBlocks = [block, reference?.uri] as RecordBlocksList;
          const addDuplicateTemplate = asClone && block;
          const template = addDuplicateTemplate
            ? applyIntlToTemplates({
                templates: DUPLICATE_RESOURCE_TEMPLATE[block],
                format: formatMessage,
              })
            : undefined;

          setRecord(wrapRecordValuesWithCommonContainer(adjustedRecord));
          selectedRecordBlocks = { block, reference };
          schemaWithDuplicatesService.set(baseSchema);
          recordNormalizingService.init(adjustedRecord, block, reference);

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
        console.error(error);

        addStatusMessages(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingResource'));
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
      setRecord,
      addStatusMessages,
      userValuesService,
    ],
  );

  return { getProcessedRecordAndSchema };
};
