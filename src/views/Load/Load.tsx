import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getAllRecords } from '@common/api/records.api';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { formatRecordsListData } from '@common/helpers/recordsList.helper';
import { usePagination } from '@common/hooks/usePagination';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { Pagination } from '@components/Pagination';
import { Row, Table } from '@components/Table';
import './Load.scss';

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
    label: <FormattedMessage id="marva.resource-id" />,
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
  const { getPageMetadata, setPageMetadata, getCurrentPageNumber, onPrevPageClick, onNextPageClick } = usePagination({
    totalElements: 0,
    totalPages: 0,
  });
  const currentPageNumber = getCurrentPageNumber();
  const pageMetadata = getPageMetadata();

  useEffect(() => {
    getAllRecords({
      pageNumber: currentPageNumber,
      type: TYPE_URIS.INSTANCE, // TODO: pass URI of the selected level of abstraction (Work, Instance, Item))
    })
      .then(res => {
        if (!res) return;

        const { content, total_elements, total_pages } = res;

        setAvailableRecords(applyRowActionItems(formatRecordsListData(content)));
        setPageMetadata({ totalElements: total_elements, totalPages: total_pages });
      })
      .catch(err => console.error('Error fetching resource descriptions: ', err));
  }, [currentPageNumber]);

  return (
    <div data-testid="load" className="load">
      <strong>
        <FormattedMessage id="marva.other-available-rds" />
      </strong>
      <div className="button-group">
        {(
          <>
            {availableRecords && (
              <>
                <div className="dashboard-table">
                  <Table header={initHeader} data={availableRecords} />
                </div>
                {pageMetadata.totalElements > 0 && (
                  <Pagination
                    currentPage={currentPageNumber}
                    totalPages={pageMetadata.totalPages}
                    onPrevPageClick={onPrevPageClick}
                    onNextPageClick={onNextPageClick}
                  />
                )}
              </>
            )}
          </>
        ) || (
          <div>
            <FormattedMessage id="marva.no-available-rds" />
          </div>
        )}
      </div>
    </div>
  );
};
