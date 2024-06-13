import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { WorkDetailsCard } from '@components/WorkDetailsCard';
import { Row, Table } from '@components/Table';
import { Button, ButtonType } from '@components/Button';
import { formatItemSearchInstanceListData } from '@common/helpers/search.helper';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { ROUTES } from '@common/constants/routes.constants';
import { ResourceType } from '@common/constants/record.constants';
import { IS_DISABLED_FOR_ALPHA } from '@common/constants/feature.constants';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import state from '@state';
import CommentIcon from '@src/assets/comment-lines-12.svg?react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import './SearchResultEntry.scss';

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
  const { navigateToEditPage } = useNavigateToEditPage();
  const navigationState = useRecoilValue(state.search.navigationState);
  const [isOpen, setIsOpen] = useState(true);
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);
  const previewContent = useRecoilValue(state.inputs.previewContent);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const { fetchRecord } = useRecordControls();

  const handleOpenPreview = async (id: string) => {
    try {
      setIsLoading(true);
      await fetchRecord(id, { singular: true });
    } catch (error) {
      console.error(error);

      setCommonStatus(prev => [
        ...prev,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.errorFetching'),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyActionItems = (rows: Row[]): Row[] =>
    rows.map(row => ({
      ...row,
      title: {
        ...row.title,
        children: (
          <Button type={ButtonType.Link} onClick={() => handleOpenPreview(row?.__meta?.id)}>
            {row.title.label}
          </Button>
        ),
      },
      editCtl: {
        children: (
          <Button
            type={ButtonType.Primary}
            onClick={() => navigateToEditPage(generateEditResourceUrl(row.__meta?.id))}
            data-testid={`edit-button-${row.__meta.id}`}
            className={classNames(['button-nowrap', 'button-capitalize'])}
          >
            <FormattedMessage id="marva.editInstance" />
          </Button>
        ),
      },
      selectCtl: {
        children: (
          <div className="row-select-container">
            <input id={`row-select-ctl-${row.__meta?.key}`} type="checkbox" disabled={IS_DISABLED_FOR_ALPHA} />
          </div>
        ),
      },
    }));

  const formattedInstances = applyActionItems(formatItemSearchInstanceListData(instances || []));

  return (
    <div className="search-result-entry-container">
      <WorkDetailsCard isOpen={isOpen} toggleIsOpen={toggleIsOpen} {...restOfWork} />
      {!!instances?.length && isOpen && (
        <Table
          header={instancesListHeader}
          data={formattedInstances}
          selectedRows={previewContent?.map(({ id }) => id)}
          className="instance-list"
        />
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
            <Link
              to={`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.instance}&ref=${restOfWork.id}`}
              state={navigationState}
            >
              <FormattedMessage id="marva.addAnInstance" />
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};
