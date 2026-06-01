import { BibframeEntitiesMap } from '@/common/constants/bibframe.constants';
import { mapToResourceType } from '@/configs/resourceTypes';

type ExtractProfileParams = {
  recordData: RecordData;
  profileIdParam: string | null;
  typeParam: string | null;
  editingRecordBlocks?: SelectedRecordBlocks;
};

export const extractProfileParams = ({
  recordData,
  profileIdParam,
  typeParam,
  editingRecordBlocks,
}: ExtractProfileParams) => {
  if (recordData && Object.keys(recordData).length) {
    const block = editingRecordBlocks?.block as keyof typeof BibframeEntitiesMap;
    const reference = editingRecordBlocks?.reference?.key;
    const recordProfileId = recordData[block]?.profileId as string | number | null | undefined;

    // Use record's profileId if present;
    // only fall back to URL param if there is no profileId (valid for the Create resource page)
    const profileId = recordProfileId ?? profileIdParam;
    const referenceProfileId = (recordData[block]?.[reference as string] as unknown as RecursiveRecordSchema[])?.[0]
      ?.profileId as string;
    const resourceTypeValue = BibframeEntitiesMap[block];
    const mappedResourceType = mapToResourceType(resourceTypeValue);

    return {
      profileId,
      referenceProfileId,
      resourceType: mappedResourceType,
    };
  }

  return {
    profileId: profileIdParam,
    resourceType: mapToResourceType(typeParam),
  };
};
