import { FC, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { AUTHORITATIVE_LABEL_URI, BLANK_NODE_TRAIT, ID_KEY, VALUE_KEY } from '../../constants';
import { aplhabeticSortLabel } from '../../common/helpers/common.helper';
import { loadSimpleLookup } from '../../common/helpers/api.helper';

interface Props {
    uri: string;
}

export const SimpleLookupField: FC<Props> = ({ uri }) => {
    const [options, setOptions] = useState<SelectOption[]>([])

    const getOptions = (data: LoadSimpleLookupResponseItem[], parentURI?: string): SelectOption[] => {
        const options = data.filter((dataItem)=>{
            const id = dataItem[ID_KEY];
            return id != parentURI && !id?.includes(BLANK_NODE_TRAIT)
        })
        .reduce<SelectOption[]>((arr, option) => {
            const id = option[ID_KEY];
            const label = option[AUTHORITATIVE_LABEL_URI][0][VALUE_KEY] ?? '';
            arr.push({
                value: { [id]: label },
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

    const getOptionLabel = (option: ReactSelectOption): string => {
        if (option.__isNew__){
          return `${option.label} (uncontrolled)`;
        } else {
          return option.label
        }
    }

    return (
        <CreatableSelect 
          isSearchable
          isClearable
          isMulti
          // TODO: Make a correct type
          options={options} 
          onMenuOpen={loadOptions}
          getOptionLabel={getOptionLabel}
        />
    )
}