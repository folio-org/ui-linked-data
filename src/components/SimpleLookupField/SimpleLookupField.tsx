import { FC, useState } from 'react';
import CreatableSelect, { MultiValue } from 'react-select';
import { AUTHORITATIVE_LABEL_URI, BLANK_NODE_TRAIT, ID_KEY, VALUE_KEY } from '@constants/lookup.constants';
import { aplhabeticSortLabel } from '@helpers/common.helper';
import { loadSimpleLookup } from '@helpers/api.helper';

interface Props {
  uri: string;
  displayName: string;
  uuid: string;
  value?: UserValueContents[];
  parentUri?: string;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

// TODO: add value subscription, add uncontrolled opts handling
export const SimpleLookupField: FC<Props> = ({ uri, displayName, uuid, value, onChange, parentUri }) => {
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
      .reduce<MultiselectOption[]>((arr, option) => {
        const optionUri = option[ID_KEY];
        const label = option[AUTHORITATIVE_LABEL_URI]?.[0]?.[VALUE_KEY] ?? '';

        arr.push({
          value: { label, uri: optionUri },
          label,
          __isNew__: false,
        });

        return arr;
      }, []);

    return options ?? [];
  };

  const loadOptions = async (): Promise<void> => {
    if (options.length > 0) return;

    setIsLoading(true);

    const response = await loadSimpleLookup(uri);

    if (!response) return;

    const optionsForDisplay = getOptions(response, uri).sort(aplhabeticSortLabel);

    setOptions(optionsForDisplay);
    setIsLoading(false);
  };

  const getOptionLabel = (option: MultiselectOption): string =>
    option.__isNew__ ? `${option.label} (uncontrolled)` : option.label;

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
    <div id={uuid}>
      {displayName}
      <CreatableSelect
        isSearchable
        isClearable
        isLoading={isLoading}
        isMulti
        options={options}
        onMenuOpen={loadOptions}
        getOptionLabel={getOptionLabel}
        onChange={handleOnChange}
        value={localValue}
      />
    </div>
  );
};
