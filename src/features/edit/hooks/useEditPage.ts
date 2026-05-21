import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { BibframeEntities } from '@/common/constants/bibframe.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getPrimaryEntitiesFromRecord } from '@/common/helpers/record.helper';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { getProfileBfid, getReference, hasReference, mapToResourceType } from '@/configs/resourceTypes';

import { getRecord } from '@/features/resources/api/records.api';
import { useResourceProcessing } from '@/features/resources/hooks/useResourceProcessing';
import type { ProcessedResource } from '@/features/resources/types';

import { useInputsState, useLoadingState, useProfileState, useStatusState, useUIState } from '@/store';

type LoadResourceOptions = {
  asClone?: boolean;
  ref?: string | null;
};

export const useEditPage = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get(QueryParams.Type);
  const resourceType = mapToResourceType(typeParam);

  const { processResource } = useResourceProcessing();
  const { fetchRecordAndSelectEntityValues } = useRecordControls();

  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { setSelectedProfile, setInitialSchemaKey, setSchema } = useProfileState([
    'setSelectedProfile',
    'setInitialSchemaKey',
    'setSchema',
  ]);
  const { setUserValues, setSelectedRecordBlocks, setSelectedEntries, setRecord } = useInputsState([
    'setUserValues',
    'setSelectedRecordBlocks',
    'setSelectedEntries',
    'setRecord',
  ]);
  const { setIsRecordEdited: setIsEdited, addStatusMessagesItem } = useStatusState([
    'setIsRecordEdited',
    'addStatusMessagesItem',
  ]);
  const { setCurrentlyEditedEntityBfid, setCurrentlyPreviewedEntityBfid } = useUIState([
    'setCurrentlyEditedEntityBfid',
    'setCurrentlyPreviewedEntityBfid',
  ]);

  const applyEntityBfids = useCallback(
    (record?: RecordEntry | null) => {
      if (record) {
        setCurrentlyEditedEntityBfid(new Set(getPrimaryEntitiesFromRecord(record)));
        setCurrentlyPreviewedEntityBfid(new Set(getPrimaryEntitiesFromRecord(record, true)));
      } else {
        const editedEntityBfId = getProfileBfid(resourceType);

        setCurrentlyEditedEntityBfid(new Set([editedEntityBfId]));

        if (hasReference(resourceType)) {
          const ref = getReference(resourceType);

          setCurrentlyPreviewedEntityBfid(new Set([getProfileBfid(ref?.targetType)]));
        } else {
          setCurrentlyPreviewedEntityBfid(new Set());
        }
      }
    },
    [resourceType, setCurrentlyEditedEntityBfid, setCurrentlyPreviewedEntityBfid],
  );

  const applyToStores = useCallback(
    (result: ProcessedResource, record?: RecordEntry | null) => {
      setSelectedProfile(result.selectedProfile ?? null);
      setSchema(result.schema);
      setInitialSchemaKey(result.initKey);
      setUserValues(result.userValues);
      setSelectedEntries(result.selectedEntries);
      setSelectedRecordBlocks(result.selectedRecordBlocks);
      if (record !== undefined) setRecord(record);
      applyEntityBfids(record);
    },
    [
      setSelectedProfile,
      setSchema,
      setInitialSchemaKey,
      setUserValues,
      setSelectedEntries,
      setSelectedRecordBlocks,
      setRecord,
      applyEntityBfids,
    ],
  );

  const initNewResource = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await processResource({});

      if (result) applyToStores(result, null);
    } catch {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    } finally {
      setIsLoading(false);
    }
  }, [processResource, applyToStores, setIsLoading, addStatusMessagesItem]);

  const loadResource = useCallback(
    async (resourceId: string | null | undefined, options?: LoadResourceOptions) => {
      const { asClone = false, ref } = options ?? {};

      try {
        setIsLoading(true);

        let record: RecordEntry | null | undefined;

        if (resourceId) {
          record = (await getRecord({ recordId: resourceId })) as RecordEntry | null;
        } else if (ref) {
          record = (await fetchRecordAndSelectEntityValues(
            ref,
            resourceType.toUpperCase() as BibframeEntities,
          )) as RecordEntry | null;

          if (!record) return;

          applyEntityBfids(null);
        }

        const result = await processResource({ record: record ?? undefined, asClone });

        if (!result) return;

        applyToStores(result, record);

        if (resourceId && !asClone) setIsEdited(false);
      } catch {
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingResource'));
      } finally {
        setIsLoading(false);
      }
    },
    [
      processResource,
      applyToStores,
      applyEntityBfids,
      resourceType,
      fetchRecordAndSelectEntityValues,
      setIsLoading,
      addStatusMessagesItem,
      setIsEdited,
    ],
  );

  return { initNewResource, loadResource };
};
