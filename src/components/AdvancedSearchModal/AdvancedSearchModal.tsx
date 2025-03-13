import { FC, memo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import { Input } from '@components/Input';
import {
  DEFAULT_ADVANCED_SEARCH_QUERY,
  SELECT_IDENTIFIERS,
  SELECT_OPERATORS,
  SELECT_QUALIFIERS,
} from '@common/constants/search.constants';
import { formatRawQuery, generateSearchParamsState } from '@common/helpers/search.helper';
import { useFetchSearchData } from '@common/hooks/useFetchSearchData';
import { Select } from '@components/Select';
import { useSearchState, useUIState } from '@src/store';
import { AriaModalKind } from '@common/constants/uiElements.constants';
import './AdvancedSearchModal.scss';

enum AdvancedSearchInputs {
  Operator = 'operator',
  Qualifier = 'qualifier',
  Index = 'index',
  Query = 'query',
}

type Props = {
  clearValues: VoidFunction;
};

export const AdvancedSearchModal: FC<Props> = memo(({ clearValues }) => {
  const [, setSearchParams] = useSearchParams();
  const { formatMessage } = useIntl();
  const { isAdvancedSearchOpen: isOpen, setIsAdvancedSearchOpen: setIsOpen } = useUIState();
  const { setForceRefresh: setForceRefreshSearch } = useSearchState();
  const { fetchData } = useFetchSearchData();
  const [rawQuery, setRawQuery] = useState(DEFAULT_ADVANCED_SEARCH_QUERY);

  const closeModal = () => {
    setRawQuery(DEFAULT_ADVANCED_SEARCH_QUERY);
    setIsOpen(false);
  };

  // potentially optimize
  const submitButtonDisabled = !rawQuery.filter(
    ({ rowIndex, operator, index, qualifier, query }) =>
      (rowIndex !== 0 ? operator : true) && index && qualifier && query,
  ).length;

  const onChangeInput = (value: string, name: string, rowIndex?: number) => {
    setRawQuery(
      rawQuery.map(rawQueryItem =>
        rawQueryItem.rowIndex === rowIndex ? { ...rawQueryItem, [name]: value } : rawQueryItem,
      ),
    );
  };

  const onDoSearch = async () => {
    clearValues();

    const formattedQuery = formatRawQuery(rawQuery);
    setSearchParams(generateSearchParamsState(formattedQuery) as unknown as URLSearchParams);
    setForceRefreshSearch(true);

    await fetchData({
      query: formattedQuery,
      searchBy: undefined,
    });

    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={formatMessage({ id: 'ld.advancedSearch' })}
      submitButtonLabel={formatMessage({ id: 'ld.search' })}
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      onClose={closeModal}
      onSubmit={onDoSearch}
      onCancel={closeModal}
      shouldCloseOnEsc
      submitButtonDisabled={submitButtonDisabled}
      ariaModalKind={AriaModalKind.AdvancedSearch}
    >
      <div className="advanced-search-container">
        {rawQuery.map(({ query, rowIndex, operator, qualifier, index }) => (
          <div key={rowIndex} className="search-row">
            {rowIndex === 0 ? (
              <div className="cell-bold">
                <FormattedMessage id="ld.searchFor" />
              </div>
            ) : (
              <Select
                withIntl
                value={operator}
                options={SELECT_OPERATORS}
                className="cell-operator"
                onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Operator, rowIndex)}
                ariaLabel={formatMessage({ id: 'ld.aria.advancedSearch.operator' })}
                data-testid={`select-operators-${rowIndex}`}
              />
            )}
            <Input
              className="text-input cell-query"
              data-testid={`text-input-${rowIndex}`}
              value={query ?? ''}
              onChange={({ target: { value } }) => onChangeInput(value, AdvancedSearchInputs.Query, rowIndex)}
              ariaLabel={formatMessage({ id: 'ld.aria.advancedSearch.queryInput' })}
            />
            <Select
              withIntl
              value={qualifier}
              options={SELECT_QUALIFIERS}
              className="cell-qualifier"
              onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Qualifier, rowIndex)}
              ariaLabel={formatMessage({ id: 'ld.aria.advancedSearch.qualifier' })}
              data-testid={`select-qualifiers-${rowIndex}`}
            />
            in
            <Select
              withIntl
              value={index}
              options={SELECT_IDENTIFIERS}
              className="cell-identifier"
              onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Index, rowIndex)}
              ariaLabel={formatMessage({ id: 'ld.aria.advancedSearch.identifier' })}
              data-testid={`select-identifiers-${rowIndex}`}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
});
