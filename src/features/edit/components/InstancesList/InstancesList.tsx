import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { formatDependeciesTable } from '@/common/helpers/recordFormatting.helper';
import { useNavigateToCreatePage } from '@/common/hooks/useNavigateToCreatePage';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { Button, ButtonType } from '@/components/Button';
import { Row, Table } from '@/components/Table';

import './InstancesList.scss';

type IInstancesList = {
  contents?: { keys: { key?: string; uri?: string }; entries: Record<string, unknown>[] };
  type?: string;
  refId?: string;
  onSelectInstance?: (id: string) => void;
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

export const InstancesList: FC<IInstancesList> = ({ contents: { entries } = {}, type, refId, onSelectInstance }) => {
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
      const rowMeta = row.__meta;
      const onClickPreview = () => rowMeta?.id && onSelectInstance?.(rowMeta.id);

      const onClickEdit = () => navigateToEditPage(generateEditResourceUrl(rowMeta?.id));

      return {
        ...row,
        title: {
          ...row.title,
          children: (
            <Button type={ButtonType.Link} onClick={onClickPreview} data-testid={`preview-button__${rowMeta?.id}`}>
              {row.title.label}
            </Button>
          ),
        },
        editCtl: {
          className: 'edit-ctl',
          children: (
            <Button type={ButtonType.Primary} onClick={onClickEdit} data-testid={`edit-button__${rowMeta?.id}`}>
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
