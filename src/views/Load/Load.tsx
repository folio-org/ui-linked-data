import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getAllRecords } from '@common/api/records.api';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { Pagination } from '@components/Pagination';
import './Load.scss';
import { usePagination } from '@common/hooks/usePagination';

type AvailableRecords = Record<string, any>[] | null | undefined;

export const Load = () => {
  const [availableRecords, setAvailableRecords] = useState<AvailableRecords>(null);
  const { getPageMetadata, setPageMetadata, getCurrentPageNumber, onPrevPageClick, onNextPageClick } = usePagination({
    number: 0,
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

        const { content, number, total_elements, total_pages } = res;

        setAvailableRecords(content);
        setPageMetadata({ number, totalElements: total_elements, totalPages: total_pages });
      })
      .catch(err => console.error('Error fetching resource descriptions: ', err));
  }, [currentPageNumber]);

  // TODO: Workaroud for demo; define type and format for data received from API
  const generateButtonLabel = ({ id, label }: RecordData) => {
    const labelString = label?.length ? `${label}, ` : '';
    const idString = `Resource description ID: ${id}`;

    return `${labelString}${idString}`;
  };

  const renderRecords = (availableRecords?: AvailableRecords) =>
    availableRecords?.map(({ id, label }: RecordData) => (
      <Link key={id} to={generateEditResourceUrl(id)} className="button">
        {generateButtonLabel({ id, label })}
      </Link>
    ));

  return (
    <div data-testid="load" className="load">
      <strong>
        <FormattedMessage id="marva.other-available-rds" />
      </strong>
      <div className="button-group">
        {(
          <>
            {renderRecords(availableRecords)}
            {pageMetadata.totalElements > 0 && (
              <Pagination
                currentPage={currentPageNumber}
                totalPages={pageMetadata.totalPages}
                onPrevPageClick={onPrevPageClick}
                onNextPageClick={onNextPageClick}
              />
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
