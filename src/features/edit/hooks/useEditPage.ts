import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { BibframeEntities } from '@/common/constants/bibframe.constants';
import { BLOCKS_BFLITE } from '@/common/constants/bibframeMapping.constants';
import { QueryParams, ROUTES } from '@/common/constants/routes.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getPrimaryEntitiesFromRecord } from '@/common/helpers/record.helper';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { getProfileBfid, getReference, hasReference, mapToResourceType } from '@/configs/resourceTypes';

import { type ProcessedResource, resourceQueryOptions, useResourceProcessing } from '@/features/resources/';

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        setCurrentlyPreviewedEntityBfid(new Set(getPrimaryEntitiesFromRecord(record, false)));
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

  const initNewResource = useCallback(
    async (isCancelled: () => boolean = () => false) => {
      try {
        setIsLoading(true);
        const result = await processResource({});

        if (isCancelled()) return;

        if (result) applyToStores(result, null);
      } catch {
        if (!isCancelled()) {
          addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
        }
      } finally {
        if (!isCancelled()) setIsLoading(false);
      }
    },
    [processResource, applyToStores, setIsLoading, addStatusMessagesItem],
  );

  const fetchRefRecord = useCallback(
    async (recordId: string, entityId: BibframeEntities) => {
      try {
        const record = await queryClient.ensureQueryData(resourceQueryOptions(recordId));
        const blockConfig = BLOCKS_BFLITE[entityId];

        if (!blockConfig?.reference) {
          return { resource: record?.resource };
        }

        const uriSelector = blockConfig.reference.uri;
        const contents = record?.resource?.[uriSelector];

        if (!contents) {
          addStatusMessagesItem?.(
            UserNotificationFactory.createMessage(StatusType.error, 'ld.cantSelectReferenceContents'),
          );

          return navigate(ROUTES.RESOURCE_CREATE.uri);
        }

        const selectedContents = {
          ...contents,
          [blockConfig.reference.key]: undefined,
        };

        return {
          resource: {
            [blockConfig.uri]: {
              [blockConfig.reference.key]: [selectedContents],
            },
          },
        };
      } catch (error) {
        logger.error('Error fetching record and selecting entity values: ', error);

        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
      }
    },
    [navigate, addStatusMessagesItem, queryClient],
  );

  const loadResource = useCallback(
    async (
      resourceId: string | null | undefined,
      options?: LoadResourceOptions,
      isCancelled: () => boolean = () => false,
    ) => {
      const { asClone = false, ref } = options ?? {};

      try {
        setIsLoading(true);

        let record: RecordEntry | null | undefined;

        if (resourceId) {
          record = await queryClient.ensureQueryData(resourceQueryOptions(resourceId));
        } else if (ref) {
          record = (await fetchRefRecord(ref, resourceType.toUpperCase() as BibframeEntities)) as RecordEntry | null;

          if (!record) return;

          applyEntityBfids(null);
        }

        const result = await processResource({ record: record ?? undefined, asClone });

        if (isCancelled() || !result) return;

        applyToStores(result, record);

        if (resourceId && !asClone) setIsEdited(false);
      } catch {
        if (!isCancelled()) {
          addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingResource'));
        }
      } finally {
        if (!isCancelled()) setIsLoading(false);
      }
    },
    [
      processResource,
      applyToStores,
      applyEntityBfids,
      resourceType,
      fetchRefRecord,
      queryClient,
      setIsLoading,
      addStatusMessagesItem,
      setIsEdited,
    ],
  );

  return { initNewResource, loadResource };
};
