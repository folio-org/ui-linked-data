import { useNavigate, useSearchParams } from 'react-router-dom';

import { ExternalResourceIdType } from '@/common/constants/api.constants';
import { BibframeEntities } from '@/common/constants/bibframe.constants';
import { BLOCKS_BFLITE } from '@/common/constants/bibframeMapping.constants';
import { QueryParams, ROUTES } from '@/common/constants/routes.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getPrimaryEntitiesFromRecord } from '@/common/helpers/record.helper';
import { PreviewParams, useConfig } from '@/common/hooks/useConfig.hook';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { getRecord } from '@/features/resources';

import { useInputsState, useLoadingState, useStatusState, useUIState } from '@/store';

type IBaseFetchRecord = {
  recordId?: string;
  cachedRecord?: RecordEntry;
  idType?: ExternalResourceIdType;
  errorMessage?: string;
  previewParams?: PreviewParams;
  signal?: AbortSignal;
  skipProfileProcessing?: boolean;
};

export const useRecordControls = () => {
  const [queryParams] = useSearchParams();
  const { setRecord } = useInputsState(['setRecord']);
  const { setCurrentlyEditedEntityBfid, setCurrentlyPreviewedEntityBfid } = useUIState([
    'setCurrentlyEditedEntityBfid',
    'setCurrentlyPreviewedEntityBfid',
  ]);
  const { setIsRecordEdited: setIsEdited, addStatusMessagesItem } = useStatusState([
    'setIsRecordEdited',
    'addStatusMessagesItem',
  ]);
  const { getProfiles } = useConfig();
  const navigate = useNavigate();
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const isClone = queryParams.get(QueryParams.CloneOf);

  const getRecordAndInitializeParsing = async ({
    recordId,
    cachedRecord,
    idType,
    previewParams,
    errorMessage,
    signal,
    skipProfileProcessing = false,
  }: IBaseFetchRecord) => {
    if (!recordId && !cachedRecord) return;

    try {
      const recordData: RecordEntry = cachedRecord ?? (recordId && (await getRecord({ recordId, idType, signal })));

      if (!skipProfileProcessing) {
        await getProfiles({
          record: recordData,
          recordId,
          previewParams,
        });
      }

      return recordData;
    } catch (err) {
      console.error('Error initializing record parsing:', err);
      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, errorMessage ?? 'ld.errorFetching'),
      );
    }
  };

  const fetchRecord = async (recordId: string, previewParams?: PreviewParams, signal?: AbortSignal) => {
    const recordData = await getRecordAndInitializeParsing({ recordId, signal, skipProfileProcessing: true });

    if (!recordData) return;

    if (!previewParams) {
      setCurrentlyEditedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData)));
      setRecord(recordData);
    }

    setCurrentlyPreviewedEntityBfid(new Set(getPrimaryEntitiesFromRecord(recordData, !!previewParams)));

    await getProfiles({
      record: recordData,
      recordId,
      previewParams,
      asClone: Boolean(isClone),
    });

    setIsEdited(false);
  };

  const fetchExternalRecordForPreview = async (recordId?: string, idType = ExternalResourceIdType.Inventory) => {
    if (!recordId) return;

    setIsLoading(true);

    await getRecordAndInitializeParsing({
      recordId,
      idType,
      errorMessage: 'ld.errorFetchingExternalResourceForPreview',
    });

    setIsLoading(false);
  };

  const fetchRecordAndSelectEntityValues = async (recordId: string, entityId: BibframeEntities) => {
    try {
      const record = await getRecord({ recordId });
      const blockConfig = BLOCKS_BFLITE[entityId];

      // If this entity type doesn't have a reference (like Hub), return early
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
    } catch (e) {
      console.error('Error fetching record and selecting entity values: ', e);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    }
  };

  return {
    fetchRecord,
    getRecordAndInitializeParsing,
    fetchExternalRecordForPreview,
    fetchRecordAndSelectEntityValues,
  };
};
