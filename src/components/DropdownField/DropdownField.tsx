import { FC, useEffect, useState } from "react"
import Select from "react-select"

interface Props {
    options: ReactSelectOption[],
    name: string,
    id: string,
    onChange: (value: RenderedFieldValue, fieldId: string) => void,
    value?: RenderedFieldValue
}

export const DropdownField: FC<Props> = ({ options, name, id, onChange, value }) => {
    const [localValue, setLocalValue] = useState<RenderedFieldValue | undefined>(value) 

    const handleOnChange = (option: ReactSelectOption) => {
        const newValue = {
            id: option.id,
            label: option.label,
            uri: option.value
        }
        onChange(newValue, id)
        setLocalValue(newValue)
    }

    useEffect(()=>{
        // ToDo: workaround for setting a default value and should be re-written.
        if (value) {
            onChange({
                uri: value.uri,
                label: value.label,
                id: value.id
            }, id)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        {name} <br />
        <Select 
            options={options} 
            isSearchable={false} 
            onChange={handleOnChange}
            value={localValue}
        />
    </div>
}
