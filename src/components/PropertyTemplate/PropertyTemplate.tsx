import { FC } from "react"
import { Input } from "../Input/Input"

import './PropertyTemplate.scss'

type PropertyTemplateProps = {
  entry: PropertyTemplate
}

export const PropertyTemplate: FC<PropertyTemplateProps> = ({
  entry
}) => {
  if (entry.type === 'literal') return (
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      <Input
        placeholder={entry.propertyLabel}
      />
      <div>
        {JSON.stringify(entry)}
      </div>
    </div>
  )

  return null && (
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      <div>(complex)</div>
    </div>
  )
}