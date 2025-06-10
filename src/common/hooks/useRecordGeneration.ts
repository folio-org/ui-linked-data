import { useInputsState, useProfileState } from '@src/store';
import { useServicesContext } from './useServicesContext';
import { getSelectedRecordBlocks } from '@common/helpers/record.helper';
import { useSearchParams } from 'react-router-dom';
import { CUSTOM_PROFILE_ENABLED } from '@common/constants/feature.constants';
import { BibframeEntitiesMap } from '@common/constants/bibframe.constants';

const getReferenceIds = (record: RecordEntry, block: string, referenceKey: string) => {
  const typedReferenceBlock = record.resource?.[block]?.[referenceKey] as unknown as Record<string, RecordEntry>[];

  return typedReferenceBlock?.map(({ id }) => ({ id }));
};

export const useRecordGeneration = () => {
  const [searchParams] = useSearchParams();
  const { recordGeneratorServiceLegacy, recordGeneratorService } = useServicesContext();
  const { record, userValues, selectedEntries, selectedRecordBlocks } = useInputsState();
  const { selectedProfile, schema, initialSchemaKey } = useProfileState();
  let generateRecord;

  if (CUSTOM_PROFILE_ENABLED) {
    const updatedSelectedRecordBlocks = selectedRecordBlocks || getSelectedRecordBlocks(searchParams);
    const { block, reference } = updatedSelectedRecordBlocks;
    const referenceIds =
      record && block && reference
        ? (getReferenceIds(record, block, reference.key) as unknown as { id: string }[])
        : undefined;
    const entityType = !block ? 'work' : (BibframeEntitiesMap[block as keyof typeof BibframeEntitiesMap] ?? 'work');

    generateRecord = () =>
      recordGeneratorService?.generate(
        { schema, userValues, referenceIds },
        (selectedProfile?.id as ProfileType) ?? 'Monograph',
        entityType,
      );
  } else {
    generateRecord = () => {
      recordGeneratorServiceLegacy?.init({
        schema,
        initKey: initialSchemaKey,
        userValues,
        selectedEntries,
      });

      return recordGeneratorServiceLegacy?.generate();
    };
  }

  return { generateRecord };
};
