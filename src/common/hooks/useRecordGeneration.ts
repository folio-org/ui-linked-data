import { useSearchParams } from 'react-router-dom';

import { BibframeEntitiesMap } from '@/common/constants/bibframe.constants';
import { ResourceType } from '@/common/constants/record.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import { getSelectedRecordBlocks } from '@/common/helpers/record.helper';
import { getDefaultProfileId } from '@/configs/resourceTypes';

import { useInputsState, useProfileState } from '@/store';

import { useServicesContext } from './useServicesContext';

const getReferenceIds = (record: RecordEntry, block: string, referenceKey: string) => {
  const typedReferenceBlock = record.resource?.[block]?.[referenceKey] as unknown as Record<string, RecordEntry>[];

  return typedReferenceBlock?.map(({ id }) => ({ id }));
};

export const useRecordGeneration = () => {
  const [searchParams] = useSearchParams();
  const { recordGeneratorService } = useServicesContext();
  const { record, userValues, selectedEntries, selectedRecordBlocks } = useInputsState([
    'record',
    'userValues',
    'selectedEntries',
    'selectedRecordBlocks',
  ]);
  const { schema } = useProfileState(['schema']);

  const updatedSelectedRecordBlocks = selectedRecordBlocks || getSelectedRecordBlocks(searchParams);
  const { block, reference } = updatedSelectedRecordBlocks;
  const referenceIds =
    record && block && reference
      ? (getReferenceIds(record, block, reference.key) as unknown as { id: string }[])
      : undefined;
  const entityType = !block
    ? ResourceType.work
    : (BibframeEntitiesMap[block as keyof typeof BibframeEntitiesMap] ?? ResourceType.work);

  const generateRecord = ({ profileId }: { profileId?: string | null }) => {
    const recordProfileId = record?.resource?.[block as keyof typeof BibframeEntitiesMap]?.profileId as
      | string
      | null
      | undefined;
    const profileIdParam = searchParams.get(QueryParams.ProfileId);

    // TODO: UILD-628 - Remove using defaultProfileIds after implementing profile selection for Work
    const selectedProfileId = profileId ?? profileIdParam ?? recordProfileId ?? String(getDefaultProfileId(entityType));

    return recordGeneratorService?.generate(
      { schema, userValues, selectedEntries, referenceIds, profileId: selectedProfileId },
      entityType,
    );
  };

  return { generateRecord };
};
