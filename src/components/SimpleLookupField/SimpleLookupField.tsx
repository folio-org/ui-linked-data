import { FC, useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ActionMeta,
  CSSObjectWithLabel,
  GroupBase,
  MultiValue,
  OptionProps,
  StylesConfig,
  createFilter,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { useQuery } from '@tanstack/react-query';

import { SIMPLE_LOOKUPS_ENABLED } from '@/common/constants/feature.constants';
import { StatusType } from '@/common/constants/status.constants';
import {
  filterLookupOptionsByMappedValue,
  filterLookupOptionsByParentBlock,
} from '@/common/helpers/lookupOptions.helper';
import { useSimpleLookupObserver } from '@/common/hooks/useSimpleLookupObserver';
import { generateLookupQueryOptions } from '@/common/queries/lookup.query';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

import { ClearIndicator } from './ClearIndicator';
import { DropdownIndicator } from './DropdownIndicator';
import { MultiValueRemove } from './MultiValueRemove';

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

const getLoadingMessage = () => <LoadingMessage />;

// Most of react-select can be styled from CSS, but :focus on the pill removal button
// cannot, so remove most styling with `unstyled` but do define this one state.
// Uses $blue-400 and $button-standard for the boxShadow.
const customStyles = {
  multiValueRemove: (base: CSSObjectWithLabel, state: OptionProps<unknown, boolean, GroupBase<unknown>>) => ({
    ...base,
    ...(state.isFocused && {
      background: 'transparent',
      boxShadow: '0 0 0 1px inset #6591d9, 0 0 0 2px inset #1960a4',
    }),
  }),
};

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
  const [menuOpened, setMenuOpened] = useState(false);
  const {
    data: rawOptions = [],
    isFetching: isLoading,
    isError,
  } = useQuery({ ...generateLookupQueryOptions(uri), enabled: menuOpened });
  const loadedOptions = filterLookupOptionsByMappedValue(rawOptions, propertyUri, parentGroupUri);
  const options = filterLookupOptionsByParentBlock(loadedOptions, propertyUri, parentBlockUri, parentGroupUri);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { simpleLookupRef, forceDisplayOptionsAtTheTop } = useSimpleLookupObserver();

  const handleMenuOpen = useCallback(() => setMenuOpened(true), []);

  useEffect(() => {
    if (isError) {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadSimpleLookupData'));
    }
  }, [isError, addStatusMessagesItem]);

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
      isLoading={isLoading}
      isMulti={isMulti}
      menuPlacement={forceDisplayOptionsAtTheTop ? 'top' : 'auto'}
      components={{ DropdownIndicator, MultiValueRemove, ClearIndicator }}
      isDisabled={isDisabled || !SIMPLE_LOOKUPS_ENABLED}
      options={options}
      onMenuOpen={handleMenuOpen}
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
      loadingMessage={getLoadingMessage}
      inputId="creatable-select-input"
      unstyled
      styles={customStyles as unknown as StylesConfig<unknown, boolean, GroupBase<unknown>>}
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
