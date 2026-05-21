import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import { DUPLICATE_RESOURCE_TEMPLATE } from '@/common/constants/resourceTemplates.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import { getProfileConfig } from '@/common/helpers/profile.helper';
import {
  getAdjustedRecordContents,
  getEditingRecordBlocks,
  getPrimaryEntitiesFromRecord,
  getRecordTitle,
} from '@/common/helpers/record.helper';
import { applyIntlToTemplates, getReferenceIdsRaw } from '@/common/helpers/recordFormatting.helper';
import { useSchemaPipeline } from '@/common/hooks/useSchemaPipeline';
import { getUri } from '@/configs/resourceTypes';

import { useLoadProfile, useLoadProfileSettings } from '@/features/profiles';

import { extractProfileParams } from '../helpers/resourceParams';
import type { ProcessedResource } from '../types';

type ProcessResourceParams = {
  record?: RecordEntry;
  asClone?: boolean;
};

export const useResourceProcessing = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get(QueryParams.Type);
  const profileIdParam = searchParams.get(QueryParams.ProfileId);

  const {
    userValuesService,
    selectedEntriesService,
    schemaGeneratorService,
    schemaWithDuplicatesService,
    recordNormalizingService,
    recordToSchemaMappingService,
  } = useSchemaPipeline();

  const { loadProfile } = useLoadProfile();
  const { loadProfileSettings } = useLoadProfileSettings();
  const { formatMessage } = useIntl();

  const processResource = useCallback(
    async ({ record, asClone = false }: ProcessResourceParams = {}): Promise<ProcessedResource | null> => {
      const recordData = record?.resource ?? {};

      const editingRecordBlocks =
        recordData && Object.keys(recordData).length ? getEditingRecordBlocks(recordData as RecordEntry) : undefined;

      const { profileId, referenceProfileId, resourceType } = extractProfileParams({
        recordData,
        profileIdParam,
        typeParam,
        editingRecordBlocks,
      });

      const profileConfig = getProfileConfig({ resourceType, profileId, referenceProfileId });

      const loadedProfiles = await Promise.all(profileConfig.ids.map(id => loadProfile(id)));
      const selectedProfile = profileConfig.rootEntry
        ? ([profileConfig.rootEntry, ...loadedProfiles.flat()] as Profile)
        : loadedProfiles[0];

      if (!selectedProfile) return null;

      const profileSettings = await loadProfileSettings(
        String(profileConfig.ids?.[0]),
        selectedProfile,
        getUri(resourceType),
      );

      const initKey = uuidv4();
      const userValues: UserValues = {};

      userValuesService.set(userValues);
      selectedEntriesService.set([]);
      schemaGeneratorService.init(selectedProfile, profileSettings);
      schemaGeneratorService.generate(initKey);

      let updatedSchema = schemaGeneratorService.get();
      let updatedUserValues = userValues;
      let selectedRecordBlocks: SelectedRecordBlocks | undefined;

      if (recordData && Object.keys(recordData).length) {
        const { block, reference } = editingRecordBlocks ?? {};
        const { record: adjustedRecord } = getAdjustedRecordContents({
          record: recordData as RecordEntry,
          block,
          reference,
          asClone,
        });

        const recordBlocks = [block, reference?.uri] as RecordBlocksList;

        const template =
          asClone && block
            ? applyIntlToTemplates({ templates: DUPLICATE_RESOURCE_TEMPLATE[block], format: formatMessage })
            : undefined;

        selectedRecordBlocks = { block, reference };
        schemaWithDuplicatesService.set(updatedSchema);
        recordNormalizingService.init(adjustedRecord, block, reference);

        const normalizedRecord = recordNormalizingService.get();

        await recordToSchemaMappingService.init({
          schema: updatedSchema,
          record: normalizedRecord,
          recordBlocks,
          templateMetadata: template,
        });

        updatedSchema = recordToSchemaMappingService.get();
        updatedUserValues = userValuesService.getAllValues();
      }

      return {
        schema: updatedSchema,
        userValues: updatedUserValues,
        initKey,
        selectedEntries: selectedEntriesService.get(),
        selectedRecordBlocks,
        selectedProfile,
        title: getRecordTitle(recordData as RecordEntry),
        entities: getPrimaryEntitiesFromRecord(record as RecordEntry),
        referenceIds: getReferenceIdsRaw(record as RecordEntry),
      };
    },
    [
      typeParam,
      profileIdParam,
      userValuesService,
      selectedEntriesService,
      schemaGeneratorService,
      schemaWithDuplicatesService,
      recordNormalizingService,
      recordToSchemaMappingService,
      loadProfile,
      loadProfileSettings,
      formatMessage,
    ],
  );

  return { processResource };
};
