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

  const drawField = (group: [string, RenderedField]) => {
    const data = group[1]
    const value = data.value

    if (group[1].type === FieldType.SIMPLE) {
      return (
        <SimpleLookupField
          label={data.name ?? ''} 
          uri={data.uri ?? ''} 
          id={data.path ?? ''} 
          value={data.value ?? []} 
          onChange={changeValue}
          key={data.path}
        /> 
      )
    }

    return value?.map(field => {
      if (data.type === FieldType.LITERAL) {
        return <LiteralField 
          key={field.uri}
          label={data.name ?? ''} 
          id={data.path} 
          value={field} 
          onChange={changeValue}
        />
      } 

      if (data.fields?.size && data.fields.size > 0) {
        if (data.type === UIFieldRenderType.dropdown){
          const options = Array.from(data.fields.values()).map(({ name, uri, id }) => ({
            label: name ?? '',
            value: uri ?? '',
            uri: uri ?? '',
            id,
          }));

          return ( 
            <DropdownField 
              options={options}
              name={data.name ?? ''}
              id={data.path}
              onChange={changeValue}
              value={options.find(({ id }) => id === data.value?.[0])}
              key={group[1].path}
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
        Array.from(normalizedFields.values()).map(block => {
          return Array.from<[string, RenderedField]>(block.fields?.entries())?.map((group) => {
            return (
              <div className="group" key={group[1].name}>
                <h3>{ group[1].name }</h3>
                { drawField(group) }
              </div>
            )
          })
        })
      }
    </div>
  ) : null
}