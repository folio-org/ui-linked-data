import { FC, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { AUTHORITATIVE_LABEL_URI, BLANK_NODE_TRAIT, ID_KEY, VALUE_KEY } from '../../constants';
import { aplhabeticSortLabel } from '../../common/helpers/common.helper';
import { loadSimpleLookup } from '../../common/helpers/api.helper';

interface Props {
    uri: string;
    label: string;
    id: string;
    value: RenderedFieldValue[],
    onChange: (value: RenderedFieldValue[], fieldId: string) => void,
}

export const SimpleLookupField: FC<Props> = ({ uri, label, id, value, onChange }) => {
    const [options, setOptions] = useState<MultiselectOption[]>([])
    const [localValue, setLocalValue] = useState<MultiselectOption[]>(value?.map((v) => ({
        label: v.label ?? '',
        value: {
            id: v.id ?? '',
            label: v.label ?? '',
            uri: v.uri,
        }
    })))

    const getOptions = (data: LoadSimpleLookupResponseItem[], parentURI?: string): MultiselectOption[] => {
        const options = data.filter((dataItem)=>{
            const id = dataItem[ID_KEY];
            return id != parentURI && !id?.includes(BLANK_NODE_TRAIT)
        })
        .reduce<MultiselectOption[]>((arr, option) => {
            const optionUri = option[ID_KEY];
            const label = option[AUTHORITATIVE_LABEL_URI][0][VALUE_KEY] ?? '';
            arr.push({
                value: { label, uri: optionUri },
                label
            })
    
            return arr;
        }, [])
    
        return options ?? []
    }

    const loadOptions = async (): Promise<void> => {
        if (options.length > 0) return

        const response = await loadSimpleLookup(uri)
        if (!response) return
        
        const optionsForDisplay = getOptions(response, uri).sort(aplhabeticSortLabel);
        setOptions(optionsForDisplay)
    }

    const getOptionLabel = (option: ReactMultiselectOption): string => {
        if (option.__isNew__){
          return `${option.label} (uncontrolled)`;
        } else {
          return option.label
        }
    }

    const handleOnChange = (options: MultiselectOption[]) => {
        const newValue = options.map<RenderedFieldValue>(e => ({
            id: null,
            uri: e.value?.uri,
            label: e.value.label
        }))

        onChange(newValue, id)
        setLocalValue(options)
    }

    const getNewOptionData = (inputValue: string) => {
        console.log(inputValue)

        return {
            label: inputValue,
            value: {
                uri: null,
                label: inputValue,
            },
            __isNew__: true
        }
    }

    useEffect(()=>{
        if (value){
            loadOptions()
            handleOnChange(localValue)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            {label}
            <CreatableSelect 
                isSearchable
                isClearable
                isMulti
                // TODO: Make a correct type
                options={options} 
                onMenuOpen={loadOptions}
                getOptionLabel={getOptionLabel}
                onChange={handleOnChange}
                getNewOptionData={getNewOptionData}
                value={localValue}
            />
        </div>
    )
}