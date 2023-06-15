import { ChangeEvent, FC, useEffect, useState } from "react"
import { Input } from "../Input/Input"

interface Props {
    label: string,
    id: string,
    value?: RenderedFieldValue,
    onChange: (value: RenderedFieldValue, fieldId: string) => void
}

export const LiteralField: FC<Props> = ({ label, id, value = undefined, onChange  }) => {
    const [localValue, setLocalValue] = useState<RenderedFieldValue | undefined>(value) 

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = {
            id: null,
            label: event.target.value,
            uri: null
        }
        onChange(newValue, id)
        setLocalValue(newValue)
    }

    useEffect(()=>{
        if (value) onChange(value, id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <div>
                {label}
            </div>
            <Input
                placeholder={label}
                onChange={handleOnChange}
                value={localValue?.label ?? ''}
            />
        </div>
    )
}