import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
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
import { useLoadingState, useStatusState } from '@src/store';
import './SearchResultEntry.scss';

type SearchResultEntry = {
  id: string;
  contributors?: ContributorDTO[];
  languages?: string[];
  classifications?: { number?: string; source?: string }[];
  instances?: InstanceAsSearchResultDTO[];
};

const instancesListHeader: Row = {
  selectCtl: {
    position: 0,
  },
  title: {
    label: <FormattedMessage id="ld.title" />,
    position: 1,
  },
  isbn: {
    label: <FormattedMessage id="ld.isbn" />,
    position: 2,
  },
  lccn: {
    label: <FormattedMessage id="ld.lccn" />,
    position: 3,
  },
  publisher: {
    label: <FormattedMessage id="ld.publisher" />,
    position: 4,
  },
  pubDate: {
    label: <FormattedMessage id="ld.pubDateShort" />,
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
  const { setIsLoading } = useLoadingState();
  const { addStatusMessage } = useStatusState();
  const previewContent = useRecoilValue(state.inputs.previewContent);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const { fetchRecord } = useRecordControls();

  const handleOpenPreview = async (id: string) => {
    try {
      setIsLoading(true);
      await fetchRecord(id, { singular: true });
    } catch (error) {
      console.error(error);

      addStatusMessage?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
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
          <Button
            type={ButtonType.Link}
            onClick={() => handleOpenPreview(row?.__meta?.id)}
            data-testid={`preview-button__${row.__meta.id}`}
          >
            {row.title.label}
          </Button>
        ),
      },
      editCtl: {
        children: (
          <Button
            type={ButtonType.Primary}
            onClick={() => navigateToEditPage(generateEditResourceUrl(row.__meta?.id))}
            data-testid={`edit-button__${row.__meta.id}`}
            className={classNames(['button-nowrap', 'button-capitalize'])}
          >
            <FormattedMessage id="ld.editInstance" />
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
      <WorkDetailsCard
        isOpen={isOpen}
        toggleIsOpen={toggleIsOpen}
        handleOpenPreview={handleOpenPreview}
        {...restOfWork}
      />
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
            <FormattedMessage id="ld.instances" />
          </span>
          <span>{instances?.length ?? 0}</span>
        </div>
      )}
      {!instances?.length && isOpen && (
        <div className="empty-or-closed">
          <span>
            <span>
              <FormattedMessage id="ld.noInstancesAvailable" />
            </span>
            <Link
              to={`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.instance}&ref=${restOfWork.id}`}
              state={navigationState}
            >
              <FormattedMessage id="ld.addAnInstance" />
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};
