import { FC } from "react"
import { Input } from "../Input/Input"

import './PropertyTemplate.scss'
import { useSetRecoilState } from "recoil"
import state from "../../state/state"
import { getComponentType } from "./PropertyTemplate.utils"

type PropertyTemplateProps = {
  entry: PropertyTemplate
}

export const PropertyTemplate: FC<PropertyTemplateProps> = ({
  entry
}) => {
  const setUserValue = useSetRecoilState(state.inputs.userValues);
  const replaceItemAtIndex = (arr, index, newValue) => {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  const componentType = getComponentType(entry);
  }

  if (componentType === 'LITERAL') {
    return (
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      <Input
        placeholder={entry.propertyLabel}
        onChange={(v) => setUserValue((oldValue)=>{
          const index = oldValue.findIndex(val => val.field === entry.propertyLabel)

          const newValue = {
            field: entry.propertyLabel,
            value: v.target.value
          }

          if (index === -1){
            return [
              ...oldValue,
              newValue
            ]
          }
          
          return replaceItemAtIndex(oldValue, index, newValue)
        })}
      />
      {/* <div>
        {JSON.stringify(entry)}
      </div> */}
    </div>
  )

    )
  }
  return null && (
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      <div>(complex)</div>
    </div>
  )
}