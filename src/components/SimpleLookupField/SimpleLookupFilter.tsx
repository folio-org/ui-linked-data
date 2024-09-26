import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage, useIntl } from 'react-intl';
import { ActionMeta, createFilter, GroupBase, MultiValue, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useSimpleLookupObserver } from '@common/hooks/useSimpleLookupObserver';
import { SIMPLE_LOOKUPS_ENABLED } from '@common/constants/feature.constants';
import { DropdownIndicator } from './DropdownIndicator';
import { MultiValueRemove } from './MultiValueRemove';
import { ClearIndicator } from './ClearIndicator';
import { OptionMultiline } from './OptionMultiline';
import { SimpleLookupFieldStyles } from './SimpleLookupField.styles';
import './SimpleLookupField.scss';
import state from '@state';

interface Props {
  facet?: string;
  isDisabled?: boolean;
  id?: string;
  hasMappedSourceData?: boolean;
  onChange: (facet?: string, contents?: Array<UserValueContents>) => void;
}

export const SimpleLookupFilter: FC<Props> = ({ facet, id, onChange, hasMappedSourceData, isDisabled = false }) => {
  const { simpleLookupRef, forceDisplayOptionsAtTheTop } = useSimpleLookupObserver();
  const sourceData = useRecoilValue(state.search.sourceData);
  const facetsData = useRecoilValue(state.search.facetsData);
  const { formatMessage } = useIntl();

  let options = [] as FilterLookupOption[];

  if (facet && facetsData && facetsData[facet]?.values) {
    options = facetsData[facet]?.values?.map(({ id, totalRecords }) => {
      const sourceElem = sourceData?.find(({ id: sourceDataId }) => sourceDataId === id);
      const label = (hasMappedSourceData ? sourceElem?.name : id) || formatMessage({ id: 'marva.notSpecified' });

      return {
        label,
        subLabel: `(${totalRecords})`,
        value: {
          id: id || '',
        },
      };
    });
  }

  const [localValue, setLocalValue] = useState<any[]>();

  const handleOnChange = (options: MultiValue<FilterLookupOption>) => {
    // TODO: implement the options selection
    const newValue = options.map<UserValueContents>(() => ({}));

    onChange(facet, newValue);
    setLocalValue([...options]);
  };

  // TODO: make the props reusable
  return (
    <CreatableSelect
      id={id}
      ref={simpleLookupRef}
      className="edit-section-field-input simple-lookup"
      classNamePrefix="simple-lookup"
      data-testid="simple-lookup"
      isSearchable
      isClearable
      openMenuOnFocus
      isMulti
      menuPlacement={forceDisplayOptionsAtTheTop ? 'top' : 'auto'}
      components={{ DropdownIndicator, MultiValueRemove, ClearIndicator, Option: OptionMultiline }}
      isDisabled={isDisabled || !SIMPLE_LOOKUPS_ENABLED}
      options={options}
      onChange={handleOnChange as unknown as (newValue: unknown, actionMeta: ActionMeta<unknown>) => void}
      value={localValue}
      placeholder={<FormattedMessage id="marva.select" />}
      inputId="creatable-select-input"
      styles={SimpleLookupFieldStyles as unknown as StylesConfig<unknown, boolean, GroupBase<unknown>>}
      filterOption={createFilter({
        ignoreCase: true,
        ignoreAccents: true,
        matchFrom: 'any',
        trim: true,
        stringify: ({ label }) => label,
      })}
    />
  );
};
