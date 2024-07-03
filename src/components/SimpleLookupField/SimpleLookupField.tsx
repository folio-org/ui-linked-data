import { FC, useEffect, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { FormattedMessage } from 'react-intl';
import { ActionMeta, GroupBase, MultiValue, StylesConfig } from 'react-select';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useSimpleLookupData } from '@common/hooks/useSimpleLookupData';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import { filterLookupOptionsByParentBlock } from '@common/helpers/lookupOptions.helper';
import { SIMPLE_LOOKUPS_ENABLED } from '@common/constants/feature.constants';
import { DropdownIndicator } from './DropdownIndicator';
import { MultiValueRemove } from './MultiValueRemove';
import { ClearIndicator } from './ClearIndicator';
import state from '@state';
import { SimpleLookupFieldStyles } from './SimpleLookupField.styles';
import './SimpleLookupField.scss';
import Select from 'react-select/dist/declarations/src/Select';
import {
  CREATABLE_SELECT_OFFSET_PLACEMENT_TRIG,
  EDIT_SECTION_CONTAINER_ID,
} from '@common/constants/uiElements.constants';

interface Props {
  uri: string;
  uuid: string;
  value?: UserValueContents[];
  parentUri?: string;
  isDisabled?: boolean;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
  propertyUri?: string;
  parentBlockUri?: string;
}

// TODO: add value subscription, add uncontrolled opts handling
export const SimpleLookupField: FC<Props> = ({
  uri,
  uuid,
  value,
  onChange,
  parentUri,
  isDisabled = false,
  propertyUri,
  parentBlockUri,
}) => {
  const [lookupData, setLookupData] = useRecoilState(state.config.lookupData);
  const { getLookupData, loadLookupData } = useSimpleLookupData(lookupData, setLookupData);
  const simpleLookupRef = useRef<Select<unknown, boolean, GroupBase<unknown>>>(null);
  const [forceDisplayOptionsAtTheTop, setForceDisplayOptionsAtTheTop] = useState(false);
  const loadedOptions = getLookupData()?.[uri] || [];
  const options = filterLookupOptionsByParentBlock(loadedOptions, propertyUri, parentBlockUri);
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);

  const observer = new IntersectionObserver(
    ([entry]) => {
      setForceDisplayOptionsAtTheTop(!entry.isIntersecting && entry?.boundingClientRect?.bottom > window.innerHeight);
    },
    { root: document.getElementById(EDIT_SECTION_CONTAINER_ID), rootMargin: CREATABLE_SELECT_OFFSET_PLACEMENT_TRIG },
  );

  useEffect(() => {
    const elem = simpleLookupRef?.current?.inputRef;

    elem && observer.observe(elem);

    return () => {
      observer.disconnect();
    };
  }, [simpleLookupRef]);

  const [localValue, setLocalValue] = useState<MultiselectOption[]>(
    value?.map(({ label = '', meta: { uri } = {} }) => ({
      value: { label, uri },
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

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.cantLoadSimpleLookupData'),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: uncomment once uncontrolled options are required/supported
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
      // TODO: uncomment once uncontrolled options are required/supported
      // getOptionLabel={getOptionLabel}
      // TODO: remove the line below once uncontrolled options are required/supported
      isValidNewOption={() => false}
      onChange={handleOnChange as unknown as (newValue: unknown, actionMeta: ActionMeta<unknown>) => void}
      value={localValue}
      placeholder={<FormattedMessage id="marva.select" />}
      loadingMessage={() => <FormattedMessage id="marva.loading" />}
      inputId="creatable-select-input"
      styles={SimpleLookupFieldStyles as unknown as StylesConfig<unknown, boolean, GroupBase<unknown>>}
    />
  );
};
