import { FC, memo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
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
import { Select } from '@components/Select';
import state from '@state';
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
  const setSearchParams = useSearchParams()?.[1];
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useRecoilState(state.ui.isAdvancedSearchOpen);
  const [rawQuery, setRawQuery] = useState(DEFAULT_ADVANCED_SEARCH_QUERY);

  const closeModal = () => {
    setRawQuery(DEFAULT_ADVANCED_SEARCH_QUERY);
    setIsOpen(false);
  };

  // TODO: potentially optimize
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

  const onDoSearch = () => {
    clearValues();
    setSearchParams(generateSearchParamsState(formatRawQuery(rawQuery)) as unknown as URLSearchParams);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={formatMessage({ id: 'marva.advancedSearch' })}
      submitButtonLabel={formatMessage({ id: 'marva.search' })}
      cancelButtonLabel={formatMessage({ id: 'marva.cancel' })}
      onClose={closeModal}
      onSubmit={onDoSearch}
      onCancel={closeModal}
      shouldCloseOnEsc
      submitButtonDisabled={submitButtonDisabled}
    >
      <div className="advanced-search-container">
        {rawQuery.map(({ query, rowIndex, operator, qualifier, index }) => (
          <div key={rowIndex} className="search-row">
            {rowIndex === 0 ? (
              <div className="cell-bold">
                <FormattedMessage id="marva.searchFor" />
              </div>
            ) : (
              <Select
                withIntl
                value={operator}
                options={SELECT_OPERATORS}
                className="cell-operator"
                onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Operator, rowIndex)}
                data-testid={`select-operators-${rowIndex}`}
              />
            )}
            <Input
              className="text-input cell-query"
              data-testid={`text-input-${rowIndex}`}
              value={query || ''}
              onChange={({ target: { value } }) => onChangeInput(value, AdvancedSearchInputs.Query, rowIndex)}
            />
            <Select
              withIntl
              value={qualifier}
              options={SELECT_QUALIFIERS}
              className="cell-qualifier"
              onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Qualifier, rowIndex)}
              data-testid={`select-qualifiers-${rowIndex}`}
            />
            in
            <Select
              withIntl
              value={index}
              options={SELECT_IDENTIFIERS}
              className="cell-identifier"
              onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Index, rowIndex)}
              data-testid={`select-identifiers-${rowIndex}`}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
});
