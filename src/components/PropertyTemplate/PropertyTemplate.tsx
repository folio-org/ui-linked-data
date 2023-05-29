import { FC } from "react"

import './PropertyTemplate.scss'

import { getComponentType } from "./PropertyTemplate.utils"

import { LiteralField } from "../LiteralField/LiteralField"
import { SimpleLookupField } from "../SimpleLookupField/SimpleLookupField";
import { replaceItemAtIndex } from "../../common/helpers/common.helper";

type PropertyTemplateProps = {
  entry: PropertyTemplate
}

export const PropertyTemplate: FC<PropertyTemplateProps> = ({
  entry
}) => {
  const componentType = getComponentType(entry);

  const fieldComponent = () => {
    if (componentType === 'LITERAL') {
      return <LiteralField label={entry.propertyLabel} />
    } else if (componentType === 'SIMPLE') {
      return <SimpleLookupField uri={entry.valueConstraint.useValuesFrom[0]} />
    } else {
      return null
    }
  }
  const manageSetUserValue = (value: any) => {
    return setUserValues((oldValue)=>{
      const index = oldValue.findIndex(val => val.field === entry.propertyLabel)

      const newValue = {
        field: entry.propertyLabel,
        value: (value.target as HTMLTextAreaElement)?.value
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
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      { fieldComponent() }
    </div>
  )
}