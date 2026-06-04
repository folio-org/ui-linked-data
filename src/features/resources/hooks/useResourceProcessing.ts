import { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { DUPLICATE_RESOURCE_TEMPLATE } from '@/common/constants/resourceTemplates.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import { getEditingRecordBlocks } from '@/common/helpers/record.helper';
import { applyIntlToTemplates } from '@/common/helpers/recordFormatting.helper';
import { generateLookupQueryOptions } from '@/common/queries/lookup.query';
import { createSchemaPipeline } from '@/common/services/pipeline';
import { SharedInfraContext } from '@/contexts';

import { useLoadProfile, useLoadProfileSettings } from '@/features/profiles';

import { buildProcessedResource } from '../helpers/buildProcessedResource';
import type { ProcessedResource } from '../types';

type ProcessResourceParams = {
  record?: RecordEntry;
  asClone?: boolean;
};

export const useResourceProcessing = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get(QueryParams.Type);
  const profileIdParam = searchParams.get(QueryParams.ProfileId);

  const sharedInfra = useContext(SharedInfraContext);
  const queryClient = useQueryClient();

  const { loadProfile } = useLoadProfile();
  const { loadProfileSettings } = useLoadProfileSettings();
  const { formatMessage } = useIntl();

  const processResource = useCallback(
    async ({ record, asClone = false }: ProcessResourceParams = {}): Promise<ProcessedResource | null> => {
      const loadLookup = (uri: string) => queryClient.ensureQueryData(generateLookupQueryOptions(uri));
      const pipeline = createSchemaPipeline(sharedInfra, loadLookup);

      const recordData = record?.resource ?? {};
      const editingRecordBlocks =
        recordData && Object.keys(recordData).length ? getEditingRecordBlocks(recordData as RecordEntry) : undefined;
      const block = editingRecordBlocks?.block;

      const templateMetadata =
        asClone && block
          ? applyIntlToTemplates({ templates: DUPLICATE_RESOURCE_TEMPLATE[block], format: formatMessage })
          : undefined;

      return buildProcessedResource({
        pipeline,
        record,
        profileIdParam,
        typeParam,
        asClone,
        templateMetadata,
        loadProfile,
        loadProfileSettings,
      });
    },
    [typeParam, profileIdParam, sharedInfra, queryClient, loadProfile, loadProfileSettings, formatMessage],
  );

  return { processResource };
};
