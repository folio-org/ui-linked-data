import { useRecoilValue, useSetRecoilState } from "recoil"
import state from "../../state/state"
import { LiteralField } from "../LiteralField/LiteralField"

import './EditSection.scss'
import { replaceItemAtIndex } from "../../common/helpers/common.helper"

export const EditSection = () => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates
  const normalizedFields = useRecoilValue(state.config.normalizedFields)

  const setUserValue = useSetRecoilState(state.inputs.userValues);

  const changeValue = (value: RenderedFieldValue, fieldId: string) => {
    return setUserValue((oldValue)=>{
        const index = oldValue.findIndex(val => val.field === fieldId)
        const newValue = {
            field: fieldId,
            value: [value]
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

  const drawField = (group) => {
    const data = group[1]
    const value = data.value
    return value?.map(field => {
      if (data.type === 'LITERAL'){
        return <LiteralField 
          key={field.path}
          label={data.name} 
          id={data.path} 
          value={field} 
          onChange={changeValue}
        />
      } 

      return null
    })
  }

  return resourceTemplates ? (
    <div className="edit-section">
      {
        Array.from(normalizedFields.entries()).map(block => {
          return Array.from(block[1].fields?.entries())?.map((group) => {
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