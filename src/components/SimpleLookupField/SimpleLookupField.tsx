import { FC, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { FormattedMessage } from 'react-intl';
import { MultiValue } from 'react-select';
import { useSetRecoilState } from 'recoil';
import { useSimpleLookupData } from '@common/hooks/useSimpleLookupData';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import state from '@state';

interface Props {
  uri: string;
  displayName?: string;
  uuid: string;
  value?: UserValueContents[];
  parentUri?: string;
  isDisabled?: boolean;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

// TODO: add value subscription, add uncontrolled opts handling
export const SimpleLookupField: FC<Props> = ({
  uri,
  displayName = '',
  uuid,
  value,
  onChange,
  parentUri,
  isDisabled = false,
}) => {
  const { getLookupData, loadLookupData } = useSimpleLookupData();
  const options = getLookupData()?.[uri] || [];
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);

  const [localValue, setLocalValue] = useState<MultiselectOption[]>(
    value?.map(({ label = '', meta: { uri } = {} }) => ({
      value: { label, uri },
      label,
      __isNew__: false,
    })) || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = async (): Promise<void> => {
    if (options.length) return;

    setIsLoading(true);

    try {
      await loadLookupData(uri);
    } catch (error) {
      console.error('Cannot load data for the Lookup:', error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.cant-load-simple-lookup-data'),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: uncomment once uncontrolled options are required/supported
  // const getOptionLabel = (option: MultiselectOption): string =>
  //   option.__isNew__ ? `${option.label} (uncontrolled)` : option.label;

  const handleOnChange = (options: MultiValue<MultiselectOption>) => {
    const newValue = options.map<UserValueContents>(({ value }) => ({
      label: value.label,
      meta: {
        uri: value?.uri,
        parentUri,
      },
    }));

    onChange(uuid, newValue);
    setLocalValue([...options]);
  };

  return (
    <div id={uuid} data-testid="simple-lookup-container">
      {displayName.trim() ? <div data-testid="simple-lookup-label">{displayName}</div> : null}
      <CreatableSelect
        data-testid="simple-lookup"
        isSearchable
        isClearable
        openMenuOnFocus
        isLoading={isLoading}
        isMulti
        isDisabled={isDisabled}
        options={options}
        onMenuOpen={loadOptions}
        // TODO: uncomment once uncontrolled options are required/supported
        // getOptionLabel={getOptionLabel}
        // TODO: remove the line below once uncontrolled options are required/supported
        isValidNewOption={() => false}
        onChange={handleOnChange}
        value={localValue}
        placeholder={<FormattedMessage id="marva.select" />}
        loadingMessage={() => <FormattedMessage id="marva.loading" />}
      />
    </div>
  );
};
