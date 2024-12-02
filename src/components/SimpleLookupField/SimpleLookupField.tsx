import { FC, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { FormattedMessage } from 'react-intl';
import { ActionMeta, createFilter, GroupBase, MultiValue, StylesConfig } from 'react-select';
import { useSimpleLookupData } from '@common/hooks/useSimpleLookupData';
import { useSimpleLookupObserver } from '@common/hooks/useSimpleLookupObserver';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import { filterLookupOptionsByParentBlock } from '@common/helpers/lookupOptions.helper';
import { SIMPLE_LOOKUPS_ENABLED } from '@common/constants/feature.constants';
import { DropdownIndicator } from './DropdownIndicator';
import { MultiValueRemove } from './MultiValueRemove';
import { ClearIndicator } from './ClearIndicator';
import { SimpleLookupFieldStyles } from './SimpleLookupField.styles';
import './SimpleLookupField.scss';
import { useStatusState } from '@src/store';

interface Props {
  uri: string;
  uuid: string;
  value?: UserValueContents[];
  parentUri?: string;
  isDisabled?: boolean;
  id?: string;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
  propertyUri?: string;
  parentBlockUri?: string;
}

const LoadingMessage: FC = () => <FormattedMessage id="ld.loading" />;

export const SimpleLookupField: FC<Props> = ({
  uri,
  uuid,
  id,
  value,
  onChange,
  parentUri,
  isDisabled = false,
  propertyUri,
  parentBlockUri,
}) => {
  const { getLookupData, loadLookupData } = useSimpleLookupData();
  const loadedOptions = getLookupData()?.[uri] || [];
  const options = filterLookupOptionsByParentBlock(loadedOptions, propertyUri, parentBlockUri);
  const { addStatusMessage } = useStatusState();
  const { simpleLookupRef, forceDisplayOptionsAtTheTop } = useSimpleLookupObserver();

  const [localValue, setLocalValue] = useState<MultiselectOption[]>(
    value?.map(({ label = '', meta: { uri, basicLabel } = {} }) => ({
      value: { label: basicLabel ?? label, uri },
      label,
      __isNew__: false,
    })) || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = async (): Promise<void> => {
    if (options?.length) return;

    setIsLoading(true);

    try {
      await loadLookupData(uri, propertyUri);
    } catch (error) {
      console.error('Cannot load data for the Lookup:', error);

      addStatusMessage?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadSimpleLookupData'));
    } finally {
      setIsLoading(false);
    }
  };

  // Uncomment if uncontrolled options are required/supported
  // const getOptionLabel = (option: MultiselectOption): string =>
  //   option.__isNew__ ? `${option.label} (uncontrolled)` : option.label;

  const handleOnChange = (options: MultiValue<MultiselectOption>) => {
    const newValue = options.map<UserValueContents>(({ label, value }) => ({
      label,
      meta: {
        uri: value?.uri,
        parentUri,
        basicLabel: value.label,
      },
    }));

    onChange(uuid, newValue);
    setLocalValue([...options]);
  };

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
      isLoading={isLoading}
      isMulti
      menuPlacement={forceDisplayOptionsAtTheTop ? 'top' : 'auto'}
      components={{ DropdownIndicator, MultiValueRemove, ClearIndicator }}
      isDisabled={isDisabled || !SIMPLE_LOOKUPS_ENABLED}
      options={options}
      onMenuOpen={loadOptions}
      // Uncomment if uncontrolled options are required/supported
      // getOptionLabel={getOptionLabel}
      // Remove the line below once uncontrolled options are required/supported
      isValidNewOption={() => false}
      onChange={handleOnChange as unknown as (newValue: unknown, actionMeta: ActionMeta<unknown>) => void}
      value={localValue}
      placeholder={<FormattedMessage id="ld.select" />}
      loadingMessage={LoadingMessage}
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
