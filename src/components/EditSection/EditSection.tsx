import { useRecoilValue, useSetRecoilState } from "recoil"
import state from "../../state/state"
import { LiteralField } from "../LiteralField/LiteralField"

import './EditSection.scss'
import { replaceItemAtIndex } from "../../common/helpers/common.helper"
import { DropdownField } from "../DropdownField/DropdownField"
import { SimpleLookupField } from "../SimpleLookupField/SimpleLookupField"
import { FieldType } from "../../common/constants/bibframe.constants"
import { UIFieldRenderType } from "../../common/constants/uiControls.constants"

export const EditSection = () => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates
  const normalizedFields = useRecoilValue(state.config.normalizedFields)

  const setUserValue = useSetRecoilState(state.inputs.userValues);

  const changeValue = (value: RenderedFieldValue | RenderedFieldValue[], fieldId: string) => {
    return setUserValue((oldValue)=>{
        const index = oldValue.findIndex(({ field }) => field === fieldId)
        const newValue = {
            field: fieldId,
            value: value instanceof Array ? value : [value]
        }

        return index === -1 
          ? [
              ...oldValue,
              newValue
            ]
          : replaceItemAtIndex(oldValue, index, newValue);
    })
  }

  const drawField = (group: RenderedField) => {
    const value = group.value

    if (group.type === FieldType.SIMPLE) {
      return (
        <SimpleLookupField
          label={group.name ?? ''} 
          uri={group.uri ?? ''} 
          id={group.path ?? ''} 
          value={value ?? []} 
          onChange={changeValue}
          key={group.path}
        /> 
      )
    }

    return value?.map(field => {
      if (group.type === FieldType.LITERAL) {
        return <LiteralField 
          key={field.uri}
          label={group.name ?? ''} 
          id={group.path} 
          value={field} 
          onChange={changeValue}
        />
      } 

      if (group.fields?.size && group.fields.size > 0) {
        if (group.type === UIFieldRenderType.dropdown){
          const options = Array.from(group.fields.values()).map(({ name, uri, id }) => ({
            label: name ?? '',
            value: uri ?? '',
            uri: uri ?? '',
            id,
          }));

          return ( 
            <DropdownField 
              options={options}
              name={group.name ?? ''}
              id={group.path}
              onChange={changeValue}
              value={options.find(({ id }) => id === value?.[0])}
              key={group.path}
            />
          )
        }
      }

      return null
    })
  }

  return resourceTemplates ? (
    <div className="edit-section">
      {
        Array.from(normalizedFields.values()).map(block => (
          Array.from<RenderedField>(block.fields?.values())?.map((group) => (
            <div className="group" key={group.name}>
              <h3>{ group.name }</h3>
              { drawField(group) }
            </div>
          ))))
      }
    </div>
  ) : null
}