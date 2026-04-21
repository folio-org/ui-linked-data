import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { Row } from '@/components/Table';

import { getEditingRecordBlocks, unwrapRecordValuesFromCommonContainer } from './record.helper';

const getReferenceIds = (record: RecordEntry, block: string, referenceKey: string) => {
  const typedReferenceBlock = record.resource?.[block]?.[referenceKey] as unknown as Record<string, RecordEntry>[];

  return typedReferenceBlock?.map(({ id }) => ({ id }));
};

export const applyIntlToTemplates = ({
  templates,
  format,
}: {
  templates: ResourceTemplateMetadata[];
  format: AbstractIntlFormatter;
}): ResourceTemplateMetadata[] =>
  templates.map(({ template, ...rest }) => ({
    ...rest,
    template: Object.fromEntries(Object.entries(template).map(([k, v]) => [k, format({ id: v })])),
  }));

export const formatDependeciesTable = (deps: Record<string, unknown>[]): Row[] => {
  return deps.map(({ id, ...rest }) => {
    const selectedPublication = (rest?.[BFLITE_URIS.PUBLICATION] as Record<string, unknown>)?.[0] as Record<
      string,
      unknown[]
    >;
    const titleContainer = rest?.[BFLITE_URIS.TITLE] as Record<string, unknown>[];
    const selectedTitle = titleContainer?.find(title => Object.hasOwn(title, BFLITE_URIS.TITLE_CONTAINER)) as Record<
      string,
      Record<string, unknown[]>
    >;

    return {
      __meta: {
        id,
        key: id,
        ...rest,
      },
      title: {
        label: selectedTitle?.[BFLITE_URIS.TITLE_CONTAINER]?.[BFLITE_URIS.MAIN_TITLE]?.[0],
        className: 'title',
      },
      publisher: {
        label: selectedPublication?.[BFLITE_URIS.NAME]?.[0],
        className: 'publisher',
      },
      pubDate: {
        label: selectedPublication?.[BFLITE_URIS.DATE]?.[0],
        className: 'publication-date',
      },
    };
  }) as Row[];
};

export const getReferenceIdsRaw = (record: RecordEntry) => {
  if (!record) return;

  const contents = unwrapRecordValuesFromCommonContainer(record);
  const { block, reference } = getEditingRecordBlocks(contents);

  if (block && reference) return getReferenceIds(record, block, reference?.key);
};
