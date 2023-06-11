import { useRecoilValue, useSetRecoilState } from "recoil"
import state from "../../state/state"
import { LiteralField } from "../LiteralField/LiteralField"

import './EditSection.scss'
import { replaceItemAtIndex } from "../../common/helpers/common.helper"
import { DropdownField } from "../DropdownField/DropdownField"
import { SimpleLookupField } from "../SimpleLookupField/SimpleLookupField"

export const EditSection = () => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates
  const normalizedFields = useRecoilValue(state.config.normalizedFields)

  const setUserValue = useSetRecoilState(state.inputs.userValues);

  const changeValue = (value: RenderedFieldValue | RenderedFieldValue[], fieldId: string) => {
    return setUserValue((oldValue)=>{
        const index = oldValue.findIndex(val => val.field === fieldId)
        const newValue = {
            field: fieldId,
            value: value instanceof Array ? value : [value]
        }

        if (index === -1){
            return [
                ...oldValue,
                newValue
            ]
        } else {
            return replaceItemAtIndex(oldValue, index, newValue)
        }
    })
  }

  const drawField = (group: [string, RenderedField]) => {
    const data = group[1]
    const value = data.value

    if (group[1].type === 'SIMPLE' ) {
      return (
        <SimpleLookupField 
          label={group[1].name ?? ''} 
          uri={group[1].uri ?? ''} 
          id={group[1].path ?? ''} 
          value={group[1].value ?? []} 
          onChange={changeValue}
          key={group[1].path}
        /> 
      )
    }

    return value?.map(field => {
      if (data.type === 'LITERAL'){
        return <LiteralField 
          key={field.uri}
          label={data.name ?? ''} 
          id={data.path} 
          value={field} 
          onChange={changeValue}
        />
      } 

      if (data.fields?.size && data.fields.size > 0) {
        if (data.type === 'dropdown'){
          const options = Array.from(data.fields.entries()).map(option => {
            const { name, uri, id } = option[1]
            return {
              label: name ?? '',
              value: uri ?? '',
              uri: uri ?? '',
              id: id,
            }
          })
          return ( 
            <DropdownField 
              options={options}
              name={data.name ?? ''}
              id={data.path}
              onChange={changeValue}
              value={options.find(option => option.id === data.value?.[0])}
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
        Array.from(normalizedFields.entries()).map(block => {
          return Array.from<[string, RenderedField]>(block[1].fields?.entries())?.map((group) => {
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