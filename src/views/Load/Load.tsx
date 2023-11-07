import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getAllRecords } from '@common/api/records.api';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { Pagination } from '@components/Pagination';
import './Load.scss';

type AvailableRecords = Record<string, any>[] | null | undefined;
type PageMetadata = {
  number: number;
  totalElements: number;
  totalPages: number;
};

export const Load = () => {
  const [availableRecords, setAvailableRecords] = useState<AvailableRecords>(null);
  const [pageMetadata, setPageMetadata] = useState<PageMetadata>({ number: 0, totalElements: 0, totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getAllRecords({
      pageNumber: currentPage,
      type: TYPE_URIS.INSTANCE, // TODO: pass URI of the selected level of abstraction (Work, Instance, Item))
    })
      .then(res => {
        setAvailableRecords(res?.content);
        setPageMetadata({ number: res.number, totalElements: res.total_elements, totalPages: res.total_pages });
      })
      .catch(err => console.error('Error fetching resource descriptions: ', err));
  }, [currentPage]);

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

  const onPrevPageClick = () => {
    const prevPageNumber = currentPage - 1;

    if (prevPageNumber < 0) return;

    setCurrentPage(prevPageNumber);
  };

  const onNextPageClick = () => {
    const nextPageNumber = currentPage + 1;

    if (nextPageNumber > pageMetadata.totalPages - 1) return;

    setCurrentPage(nextPageNumber);
  };

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
                currentPage={currentPage}
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
