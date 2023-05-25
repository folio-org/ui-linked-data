import { ChangeEvent, FC } from "react"
import { Input } from "../Input/Input"
import { useSetRecoilState } from "recoil"
import state from "../../state/state"
import { replaceItemAtIndex } from "../../utils"

interface Props {
    label: string
}

export const LiteralField: FC<Props> = ({ label }) => {
    const setUserValue = useSetRecoilState(state.inputs.userValues);
    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        return setUserValue((oldValue)=>{
            const index = oldValue.findIndex(val => val.field === label)
    
            const newValue: UserValue = {
                field: label,
                value: event.target.value
            }
    
            if (index === -1){
                return [
                    ...oldValue,
                    newValue
                ]
            }
            
            return replaceItemAtIndex(oldValue, index, newValue)
        })
    }
    return (
        <Input
            placeholder={label}
            onChange={handleOnChange}
        />
    )
}