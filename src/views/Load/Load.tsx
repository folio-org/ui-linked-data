import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { getAllRecords } from '@common/api/records.api';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { formatRecordsListData } from '@common/helpers/recordsList.helper';
import { usePagination } from '@common/hooks/usePagination';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { DEFAULT_PAGES_METADATA, MAX_LIMIT } from '@common/constants/api.constants';
import { Pagination } from '@components/Pagination';
import { Row, Table } from '@components/Table';
import state from '@state';
import './Load.scss';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';

type AvailableRecords = Record<string, any>[] | null | undefined;

const initHeader: Row = {
  actionItems: {
    label: <FormattedMessage id="marva.actions" />,
    className: 'action-items',
    position: 0,
  },
  title: {
    label: <FormattedMessage id="marva.title" />,
    position: 1,
  },
  id: {
    label: <FormattedMessage id="marva.resourceId" />,
    position: 2,
  },
};

const applyRowActionItems = (rows: Row[]): Row[] =>
  rows.map(row => {
    const rowId = (row.__meta as Record<string, any>).id;

    return {
      ...row,
      actionItems: {
        children: (
          <div className="action-items__container">
            <Link data-testid={`edit-button-${rowId}`} to={generateEditResourceUrl(rowId)} className="button">
              ✏️
            </Link>
          </div>
        ),
        className: 'action-items',
      },
    };
  });

export const Load = () => {
  const [availableRecords, setAvailableRecords] = useState<AvailableRecords>(null);
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const { getPageMetadata, setPageMetadata, getCurrentPageNumber, onPrevPageClick, onNextPageClick } =
    usePagination(DEFAULT_PAGES_METADATA);
  const currentPageNumber = getCurrentPageNumber();
  const pageMetadata = getPageMetadata();

  useEffect(() => {
    async function loadRecords() {
      setIsLoading(true);

      try {
        const response = await getAllRecords({
          pageNumber: currentPageNumber,
          type: TYPE_URIS.INSTANCE, // TODO: pass URI of the selected level of abstraction (Work, Instance, Item))
        });

        if (!response) return;

        const { content, total_elements, total_pages } = response;

        setAvailableRecords(applyRowActionItems(formatRecordsListData(content)));
        setPageMetadata({ totalElements: total_elements, totalPages: total_pages });
      } catch (error) {
        console.error('Error fetching resource descriptions: ', error);

        setStatusMessages(currentStatus => [
          ...currentStatus,
          UserNotificationFactory.createMessage(StatusType.error, 'marva.errorFetching'),
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecords();
  }, [currentPageNumber]);

  return (
    <div data-testid="load" className="load">
      <strong>
        <FormattedMessage id="marva.resources" />
      </strong>
      <div className="button-group">
        {(
          <>
            {availableRecords && (
              <>
                <Table header={initHeader} data={availableRecords} className="table-with-pagination" />
                {pageMetadata.totalElements > 0 && (
                  <Pagination
                    currentPage={currentPageNumber}
                    totalPages={pageMetadata.totalPages}
                    pageSize={MAX_LIMIT}
                    totalResultsCount={pageMetadata.totalElements}
                    onPrevPageClick={onPrevPageClick}
                    onNextPageClick={onNextPageClick}
                  />
                )}
              </>
            )}
          </>
        ) || (
          <div>
            <FormattedMessage id="marva.noAvailableRds" />
          </div>
        )}
      </div>
    </div>
  );
};
