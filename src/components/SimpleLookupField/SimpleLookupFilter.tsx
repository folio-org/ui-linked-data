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
import { SimpleLookupFieldStyles } from './SimpleLookupField.styles';
import './SimpleLookupField.scss';
import state from '@state';

interface Props {
  facet?: string;
  value?: UserValueContents[];
  isDisabled?: boolean;
  id?: string;
  hasMappedSourceData?: boolean;
  onChange: (facet?: string, contents?: Array<UserValueContents>) => void;
}

export const SimpleLookupFilter: FC<Props> = ({
  facet,
  id,
  value,
  onChange,
  hasMappedSourceData,
  isDisabled = false,
}) => {
  const { simpleLookupRef, forceDisplayOptionsAtTheTop } = useSimpleLookupObserver();
  const sourceData = useRecoilValue(state.search.sourceData);
  const facetsData = useRecoilValue(state.search.facetsData);
  const { formatMessage } = useIntl();

  let options = [] as SimpleLookupFilterOption[];

  if (facet && facetsData && facetsData[facet]?.values) {
    options = facetsData[facet]?.values?.map(option => {
      const sourceElem = sourceData?.find(({ id }) => id === option.id);
      const title = (hasMappedSourceData ? sourceElem?.name : option.id) || formatMessage({ id: 'marva.notSpecified' });

      return {
        label: `${title} (${option.totalRecords})`,
        value: id || '',
      };
    });
  }

  const [localValue, setLocalValue] = useState<any[]>(
    // TODO: implement the options data structure
    value?.map(({ label = '', meta: { uri, basicLabel } = {} }) => ({
      value: { label: basicLabel || label, uri },
      label,
    })) || [],
  );

  const handleOnChange = (options: MultiValue<MultiselectOption>) => {
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
      components={{ DropdownIndicator, MultiValueRemove, ClearIndicator }}
      isDisabled={isDisabled || !SIMPLE_LOOKUPS_ENABLED}
      options={options}
      onChange={handleOnChange as unknown as (newValue: unknown, actionMeta: ActionMeta<unknown>) => void}
      value={localValue}
      placeholder={<FormattedMessage id="marva.select" />}
      loadingMessage={() => <FormattedMessage id="marva.loading" />}
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
