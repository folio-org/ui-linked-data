import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import './AdvancedSearchModal.scss';
import { Input } from '@components/Input';
import {
  DEFAULT_ADVANCED_SEARCH_QUERY,
  SELECT_IDENTIFIERS,
  SELECT_OPERATORS,
  SELECT_QUALIFIERS,
} from '@common/constants/search.constants';
import state from '@state';
import { useRecoilState } from 'recoil';
import { FC, memo, useState } from 'react';
import { formatRawQuery } from '@common/helpers/search.helper';
import { Select } from '@components/Select';

enum AdvancedSearchInputs {
  Operator = 'operator',
  Qualifier = 'qualifier',
  Index = 'index',
  Query = 'query',
}

type Props = {
  submitSearch: (q: string) => void;
  clearValues: VoidFunction;
};

export const AdvancedSearchModal: FC<Props> = memo(({ submitSearch, clearValues }) => {
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
    submitSearch(formatRawQuery(rawQuery));
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
                value={operator}
                options={SELECT_OPERATORS}
                className="cell-operator"
                onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Operator, rowIndex)}
                data-testid={`select-operators-${rowIndex}`}
              />
            )}
            <Input
              className="text-input cell-query"
              testid={`text-input-${rowIndex}`}
              value={query || ''}
              onChange={({ target: { value } }) => onChangeInput(value, AdvancedSearchInputs.Query, rowIndex)}
            />
            <Select
              value={qualifier}
              options={SELECT_QUALIFIERS}
              className="cell-qualifier"
              onChange={({ value }) => onChangeInput(value, AdvancedSearchInputs.Qualifier, rowIndex)}
              data-testid={`select-qualifiers-${rowIndex}`}
            />
            in
            <Select
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
