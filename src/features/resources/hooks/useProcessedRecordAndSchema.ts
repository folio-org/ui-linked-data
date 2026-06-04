import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { DUPLICATE_RESOURCE_TEMPLATE } from '@/common/constants/resourceTemplates.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getAdjustedRecordContents, wrapRecordValuesWithCommonContainer } from '@/common/helpers/record.helper';
import { applyIntlToTemplates } from '@/common/helpers/recordFormatting.helper';
import { useSchemaPipeline } from '@/common/hooks/useSchemaPipeline';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useInputsState, useStatusState } from '@/store';

type IGetProcessedRecordAndSchema = {
  baseSchema: Schema;
  record: Record<string, unknown> | Array<unknown>;
  editingRecordBlocks?: SelectedRecordBlocks;
  userValues: UserValues;
  asClone?: boolean;
  noStateUpdate?: boolean;
};

export const useProcessedRecordAndSchema = () => {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { setRecord } = useInputsState(['setRecord']);
  const { formatMessage } = useIntl();
  const { userValuesService, schemaWithDuplicatesService, recordNormalizingService, recordToSchemaMappingService } =
    useSchemaPipeline();

  const getProcessedRecordAndSchema = useCallback(
    async ({
      baseSchema,
      record,
      editingRecordBlocks,
      userValues,
      asClone = false,
      noStateUpdate,
    }: IGetProcessedRecordAndSchema) => {
      let updatedSchema = baseSchema;
      let updatedUserValues = userValues;
      let selectedRecordBlocks = undefined;

      try {
        if (record && Object.keys(record).length) {
          const typedRecord = record as RecordEntry;
          const { block, reference } = editingRecordBlocks ?? { block: undefined, reference: undefined };
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

          if (!noStateUpdate) {
            setRecord(wrapRecordValuesWithCommonContainer(adjustedRecord));
          }
        }
      } catch (error) {
        logger.error('Failed to load a resource', error);

        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingResource'));
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
      addStatusMessagesItem,
      userValuesService,
    ],
  );

  return { getProcessedRecordAndSchema };
};
