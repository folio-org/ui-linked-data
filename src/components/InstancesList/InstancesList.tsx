import { FormattedMessage } from 'react-intl';
import { FC } from 'react';
import { Row, Table } from '@components/Table';
import { Button, ButtonType } from '@components/Button';
import { formatDependeciesTable } from '@common/helpers/recordFormatting.helper';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useNavigateToCreatePage } from '@common/hooks/useNavigateToCreatePage';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { wrapRecordValuesWithCommonContainer } from '@common/helpers/record.helper';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import './InstancesList.scss';

type IInstancesList = {
  contents?: { keys: { key?: string; uri?: string }; entries: Record<string, unknown>[] };
  type?: string;
  refId?: string;
};

const instancesListHeader: Row = {
  title: {
    label: <FormattedMessage id="ld.title" />,
    position: 0,
  },
  publisher: {
    label: <FormattedMessage id="ld.publisher" />,
    position: 1,
  },
  pubDate: {
    label: <FormattedMessage id="ld.year" />,
    position: 2,
  },
  editCtl: {
    position: 3,
  },
};

export const InstancesList: FC<IInstancesList> = ({ contents: { keys, entries } = {}, type, refId }) => {
  const { getRecordAndInitializeParsing } = useRecordControls();
  const { navigateToEditPage } = useNavigateToEditPage();
  const { onCreateNewResource } = useNavigateToCreatePage();

  const onClickNewInstance = () => {
    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.INSTANCE as ResourceTypeURL,
      queryParams: {
        type,
        refId,
      },
    });
  };

  const applyActionItems = (rows: Row[]): Row[] =>
    rows.map(row => {
      const onClickPreview = () =>
        keys?.uri &&
        getRecordAndInitializeParsing({
          recordId: row.__meta.id,
          cachedRecord: wrapRecordValuesWithCommonContainer({ [keys?.uri]: row.__meta }),
          previewParams: { singular: true, noStateUpdate: true },
        });

      const onClickEdit = () => navigateToEditPage(generateEditResourceUrl(row.__meta?.id));

      return {
        ...row,
        title: {
          ...row.title,
          children: (
            <Button type={ButtonType.Link} onClick={onClickPreview} data-testid={`preview-button__${row.__meta.id}`}>
              {row.title.label}
            </Button>
          ),
        },
        editCtl: {
          className: 'edit-ctl',
          children: (
            <Button type={ButtonType.Primary} onClick={onClickEdit} data-testid={`edit-button__${row.__meta.id}`}>
              <FormattedMessage id="ld.edit" />
            </Button>
          ),
        },
      };
    });

  const formattedInstances = applyActionItems(formatDependeciesTable(entries ?? []));

  return (
    <div className="instances-list" data-testid="instances-list">
      <div className="instances-list-header">
        <h3>
          <FormattedMessage id="ld.instances" />
        </h3>
        <Button type={ButtonType.Primary} onClick={onClickNewInstance} disabled={!refId} data-testid="new-instance">
          <FormattedMessage id="ld.newInstance" />
        </Button>
      </div>
      {entries?.length ? (
        <Table header={instancesListHeader} data={formattedInstances} />
      ) : (
        <div className="no-instances">
          <FormattedMessage id="ld.noInstancesAdded" />
        </div>
      )}
    </div>
  );
};
