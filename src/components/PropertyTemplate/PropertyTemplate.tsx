import { FC, useState } from "react"
import { Input } from "../Input/Input"

import './PropertyTemplate.scss'
import { useSetRecoilState } from "recoil"
import state from "../../state/state"
import { getComponentType } from "./PropertyTemplate.utils"
import { loadSimpleLookup } from "../../utils/network"

import CreatableSelect from 'react-select/creatable';

type PropertyTemplateProps = {
  entry: PropertyTemplate
}

export const PropertyTemplate: FC<PropertyTemplateProps> = ({
  entry
}) => {
  const setUserValue = useSetRecoilState(state.inputs.userValues);
  const componentType = getComponentType(entry);

  const getOptions = (data, parentURI?: string) => {
    const options = data.filter((option)=>{
      if (option['@id'] && option['@id'] != parentURI && !option['@id'].includes('_:')) {
        return true
      } else if (option['http://id.loc.gov/ontologies/RecordInfo#recordStatus']){
        return false
      } else {
        return false
      }
    }).reduce((arr, option) => {
      arr.push({
        value: {
          [option['@id']]: option['http://www.loc.gov/mads/rdf/v1#authoritativeLabel'][0]['@value']
        },
        label: option['http://www.loc.gov/mads/rdf/v1#authoritativeLabel'][0]['@value']
      })

      return arr
    }, [])

    console.log('fd', options);
    return options ?? []
  }


  const [options, setOptions] = useState([])
  const loadOptions = () => {
    if (options.length > 0) return
    const uri = entry.valueConstraint.useValuesFrom[0]
    loadSimpleLookup(uri).then(data => {
      const opts = getOptions(data, uri).sort(function (a, b) {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
      setOptions(opts)
    })
  }

  const getOptionLabel = (data) => {
    if (data.__isNew__){
      return `${data.label} (uncontrolled)`;
    } else {
      return data.label
    }
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
  } else if (componentType === 'SIMPLE') {
    return (
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      <CreatableSelect 
        isSearchable
        isClearable
        isMulti
        options={options} 
        onMenuOpen={loadOptions}
        getOptionLabel={getOptionLabel}
      />
    </div>
    )
  }
  
  return null && (
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      <div>(complex)</div>
    </div>
  )
}