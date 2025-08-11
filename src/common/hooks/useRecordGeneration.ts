import { useInputsState, useProfileState } from '@src/store';
import { useServicesContext } from './useServicesContext';
import { getSelectedRecordBlocks } from '@common/helpers/record.helper';
import { useSearchParams } from 'react-router-dom';
import { BibframeEntitiesMap } from '@common/constants/bibframe.constants';
import { ResourceType } from '@common/constants/record.constants';

const getReferenceIds = (record: RecordEntry, block: string, referenceKey: string) => {
  const typedReferenceBlock = record.resource?.[block]?.[referenceKey] as unknown as Record<string, RecordEntry>[];

  return typedReferenceBlock?.map(({ id }) => ({ id }));
};

export const useRecordGeneration = () => {
  const [searchParams] = useSearchParams();
  const { recordGeneratorService } = useServicesContext();
  const { record, userValues, selectedEntries, selectedRecordBlocks } = useInputsState();
  const { schema } = useProfileState();

  const updatedSelectedRecordBlocks = selectedRecordBlocks || getSelectedRecordBlocks(searchParams);
  const { block, reference } = updatedSelectedRecordBlocks;
  const referenceIds =
    record && block && reference
      ? (getReferenceIds(record, block, reference.key) as unknown as { id: string }[])
      : undefined;
  const entityType = !block
    ? ResourceType.work
    : (BibframeEntitiesMap[block as keyof typeof BibframeEntitiesMap] ?? ResourceType.work);

  const generateRecord = () =>
    recordGeneratorService?.generate({ schema, userValues, selectedEntries, referenceIds }, entityType);

  return { generateRecord };
};
