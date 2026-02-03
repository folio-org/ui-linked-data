import { FC, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ActionMeta, GroupBase, MultiValue, StylesConfig, createFilter } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { SIMPLE_LOOKUPS_ENABLED } from '@/common/constants/feature.constants';
import { StatusType } from '@/common/constants/status.constants';
import { filterLookupOptionsByParentBlock } from '@/common/helpers/lookupOptions.helper';
import { useSimpleLookupData } from '@/common/hooks/useSimpleLookupData';
import { useSimpleLookupObserver } from '@/common/hooks/useSimpleLookupObserver';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

import { ClearIndicator } from './ClearIndicator';
import { DropdownIndicator } from './DropdownIndicator';
import { MultiValueRemove } from './MultiValueRemove';
import { SimpleLookupFieldStyles } from './SimpleLookupField.styles';

import './SimpleLookupField.scss';

interface Props {
  uri: string;
  uuid: string;
  value?: UserValueContents[];
  htmlId?: string;
  parentUri?: string;
  isDisabled?: boolean;
  isMulti?: boolean;
  id?: string;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
  propertyUri?: string;
  parentBlockUri?: string;
  parentGroupUri?: string;
}

const LoadingMessage: FC = () => <FormattedMessage id="ld.loading" />;

export const SimpleLookupField: FC<Props> = ({
  uri,
  uuid,
  id,
  value,
  htmlId,
  onChange,
  parentUri,
  parentGroupUri,
  isDisabled = false,
  isMulti = true,
  propertyUri,
  parentBlockUri,
}) => {
  const { getLookupData, loadLookupData } = useSimpleLookupData();
  const loadedOptions = getLookupData()?.[uri] || [];
  const options = filterLookupOptionsByParentBlock(loadedOptions, propertyUri, parentBlockUri, parentGroupUri);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { simpleLookupRef, forceDisplayOptionsAtTheTop } = useSimpleLookupObserver();

  const userValuesToMultiselect = (value: UserValueContents[] | undefined) => {
    return value?.map(({ label = '', meta: { uri, basicLabel } = {} }) => ({
      value: { label: basicLabel ?? label, uri },
      label,
      __isNew__: false,
    }));
  };

  const multiselectToUserValues = (option: MultiselectOption) => {
    return {
      label: option.label,
      meta: {
        uri: option.value?.uri,
        parentUri,
        basicLabel: option.value?.label,
      },
    };
  };

  const [localValueMulti, setLocalValueMulti] = useState<MultiselectOption[]>(userValuesToMultiselect(value) || []);

  const [localValueSingle, setLocalValueSingle] = useState<MultiselectOption | undefined>(
    userValuesToMultiselect(value)?.[0],
  );

  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = async (): Promise<void> => {
    if (options?.length) return;

    setIsLoading(true);

    try {
      await loadLookupData(uri, propertyUri, parentGroupUri);
    } catch (error) {
      console.error('Cannot load data for the Lookup:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadSimpleLookupData'));
    } finally {
      setIsLoading(false);
    }
  };

  // Uncomment if uncontrolled options are required/supported
  // const getOptionLabel = (option: MultiselectOption): string =>
  //   option.__isNew__ ? `${option.label} (uncontrolled)` : option.label;

  const handleOnChangeMulti = (options: MultiValue<MultiselectOption>) => {
    const newValue = options.map<UserValueContents>(option => multiselectToUserValues(option));
    onChange(uuid, newValue);
    setLocalValueMulti([...options]);
  };

  const handleOnChangeSingle = (option: MultiselectOption) => {
    const newValue = [multiselectToUserValues(option)];
    onChange(uuid, newValue);
    setLocalValueSingle(option);
  };

  return (
    <CreatableSelect
      id={id}
      aria-labelledby={htmlId}
      ref={simpleLookupRef}
      className="edit-section-field-input simple-lookup"
      classNamePrefix="simple-lookup"
      data-testid="simple-lookup"
      isSearchable
      isClearable
      openMenuOnFocus
      isLoading={isLoading}
      isMulti={isMulti}
      menuPlacement={forceDisplayOptionsAtTheTop ? 'top' : 'auto'}
      components={{ DropdownIndicator, MultiValueRemove, ClearIndicator }}
      isDisabled={isDisabled || !SIMPLE_LOOKUPS_ENABLED}
      options={options}
      onMenuOpen={loadOptions}
      // Uncomment if uncontrolled options are required/supported
      // getOptionLabel={getOptionLabel}
      // Remove the line below once uncontrolled options are required/supported
      isValidNewOption={() => false}
      onChange={
        (isMulti ? handleOnChangeMulti : handleOnChangeSingle) as unknown as (
          newValue: unknown,
          actionMeta: ActionMeta<unknown>,
        ) => void
      }
      value={isMulti ? localValueMulti : localValueSingle}
      placeholder={<FormattedMessage id="ld.select" />}
      loadingMessage={() => <LoadingMessage />}
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
