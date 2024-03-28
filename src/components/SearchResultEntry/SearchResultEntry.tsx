import { FC, useState } from 'react';
import { WorkDetailsCard } from '@components/WorkDetailsCard';
import { Row, Table } from '@components/Table';
import { FormattedMessage } from 'react-intl';
import { formatItemSearchInstanceListData } from '@common/helpers/search.helper';
import { Button, ButtonType } from '@components/Button';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { Link, useNavigate } from 'react-router-dom';
import CommentIcon from '@src/assets/comment-lines-12.svg?react';
import { ROUTES } from '@common/constants/routes.constants';
import './SearchResultEntry.scss';
import { ResourceType } from '@common/constants/record.constants';

type SearchResultEntry = {
  id: string;
  contributors?: ContributorDTO[];
  languages?: { value?: string }[];
  classifications?: { number?: string; source?: string }[];
  instances?: InstanceAsSearchResultDTO[];
};

const instancesListHeader: Row = {
  selectCtl: {
    position: 0,
  },
  title: {
    label: <FormattedMessage id="marva.title" />,
    position: 1,
  },
  isbn: {
    label: <FormattedMessage id="marva.isbn" />,
    position: 2,
  },
  lccn: {
    label: <FormattedMessage id="marva.lccn" />,
    position: 3,
  },
  publisher: {
    label: <FormattedMessage id="marva.publisher" />,
    position: 4,
  },
  pubDate: {
    label: <FormattedMessage id="marva.pubDateShort" />,
    position: 5,
  },
  editCtl: {
    position: 6,
  },
};

export const SearchResultEntry: FC<SearchResultEntry> = ({ instances, ...restOfWork }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  const applyActionItems = (rows: Row[]): Row[] =>
    rows.map(row => ({
      ...row,
      title: {
        ...row.title,
        children: <Link to="#">{row.title.label}</Link>,
      },
      editCtl: {
        children: (
          <Button
            type={ButtonType.Primary}
            onClick={() => navigate(generateEditResourceUrl(row.__meta?.id))}
            data-testid={`edit-button-${row.__meta.id}`}
          >
            <FormattedMessage id="marva.edit" />
          </Button>
        ),
      },
      selectCtl: {
        children: (
          <div className="row-select-container">
            <input id={`row-select-ctl-${row.__meta?.key}`} type="checkbox" />
          </div>
        ),
      },
    }));

  const formattedInstances = applyActionItems(formatItemSearchInstanceListData(instances || []));

  return (
    <div className="search-result-entry-container">
      <WorkDetailsCard isOpen={isOpen} toggleIsOpen={toggleIsOpen} {...restOfWork} />
      {!!instances?.length && isOpen && (
        <Table header={instancesListHeader} data={formattedInstances} className="instance-list" />
      )}
      {!isOpen && (
        <div className="empty-or-closed">
          <CommentIcon />
          <span>
            <FormattedMessage id="marva.instances" />
          </span>
          <span>{instances?.length ?? 0}</span>
        </div>
      )}
      {!instances?.length && isOpen && (
        <div className="empty-or-closed">
          <span>
            <span>
              <FormattedMessage id="marva.noInstancesAvailable" />
            </span>
            <Link to={`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.instance}&ref=${restOfWork.id}`}>
              <FormattedMessage id="marva.addAnInstance" />
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};
