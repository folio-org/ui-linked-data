import { FC, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { AUTHORITATIVE_LABEL_URI, BLANK_NODE_TRAIT, ID_KEY, VALUE_KEY } from '@common/constants/lookup.constants';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { loadSimpleLookup } from '@common/helpers/api.helper';
import { FormattedMessage } from 'react-intl';
import { MultiValue } from 'react-select';

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
  const [options, setOptions] = useState<MultiselectOption[]>([]);
  const [localValue, setLocalValue] = useState<MultiselectOption[]>(
    value?.map(({ label = '', meta: { uri } = {} }) => ({
      value: { label, uri },
      label,
      __isNew__: false,
    })) || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const getOptions = (data: LoadSimpleLookupResponseItem[], parentURI?: string): MultiselectOption[] => {
    const options = data
      .filter(dataItem => {
        const id = dataItem[ID_KEY];
        return id != parentURI && !id?.includes(BLANK_NODE_TRAIT);
      })
      .map<MultiselectOption>(option => {
        const optionUri = option[ID_KEY];
        const label = option[AUTHORITATIVE_LABEL_URI]?.[0]?.[VALUE_KEY] ?? '';

        return {
          value: { label, uri: optionUri },
          label,
          __isNew__: false,
        };
      });

    return options;
  };

  const loadOptions = async (): Promise<void> => {
    if (options.length) return;

    setIsLoading(true);

    const response = await loadSimpleLookup(uri);

    if (!response) return;

    const optionsForDisplay = getOptions(response, uri).sort(alphabeticSortLabel);

    setOptions(optionsForDisplay);
    setIsLoading(false);
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
