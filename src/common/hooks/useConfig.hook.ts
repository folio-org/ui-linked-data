import { useSetRecoilState } from 'recoil'
import state from '../../state/state'
import { fetchProfiles, fetchStartingPoints, fetchUserInputScheme } from '../api/profiles.api'
import { getComponentType } from '../helpers/common.helper'
import { FieldType, PROFILE_NAMES } from '../constants/bibframe.constants'
import { UIFieldRenderType, UI_BLOCKS } from '../constants/uiControls.constants'

export default function useConfig() {
  const setProfiles = useSetRecoilState(state.config.profiles)
  const setStartingPoints = useSetRecoilState(state.config.startingPoints)
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile)
  const setUserInputScheme = useSetRecoilState(state.inputs.userInputScheme)
  const setPreparedFields = useSetRecoilState(state.config.preparedFields)
  const setNormalizedFields = useSetRecoilState(state.config.normalizedFields)
  
  const prepareFields = (profiles: ProfileEntry[]): PreparedFields => {
    const preparedFields = profiles.reduce<PreparedFields>((fields, profile) => {
      const resourceTemplate = profile.json.Profile.resourceTemplates.reduce<PreparedFields>((resourceObject, resourceTemplate)=>{
        resourceObject[resourceTemplate.id] = resourceTemplate;

        return resourceObject
      }, {})

      fields = {
        ...fields,
        ...resourceTemplate
      }

      return fields
    }, {})
    
    setPreparedFields(preparedFields)

    return preparedFields
  }

  const parseField = (
    {
      propertyTemplate, 
      fields, 
      parent, 
      path, 
      level,
      json
    } : {
      propertyTemplate: PropertyTemplate; 
      fields: PreparedFields;
      parent: RenderedFieldMap; 
      path: string; 
      level: number;
      json?: any;
      }
    ) => {
    let pathToField = `${path}_${propertyTemplate.propertyLabel}`
    const fieldType = getComponentType(propertyTemplate)
    const groupMap: RenderedFieldMap = parent.get(propertyTemplate.propertyURI)?.fields ?? new Map()
    const groupJson = json?.[propertyTemplate.propertyURI]

    if (!groupMap.size) {
      parent.set(propertyTemplate.propertyURI, {
        type: level === 1 ? UIFieldRenderType.group : (fieldType ?? FieldType.UNKNOWN),
        path: pathToField,
        fields: groupMap,
        name: propertyTemplate.propertyLabel,
      })
    }

    if (fieldType === FieldType.LITERAL || fieldType === FieldType.SIMPLE){
      parent.set(propertyTemplate.propertyURI, {
        type: fieldType,
        path: pathToField,
        name: propertyTemplate.propertyLabel,
        uri: propertyTemplate.valueConstraint?.useValuesFrom[0],
        value: groupJson
      })
    } else if (fieldType === FieldType.REF){
      // Dropdown
      if (propertyTemplate.valueConstraint.valueTemplateRefs.length > 1){
        const options = propertyTemplate.valueConstraint.valueTemplateRefs;
        parent.set(propertyTemplate.propertyURI, {
          type: UIFieldRenderType.dropdown,
          path: pathToField,
          fields: groupMap,
          name: propertyTemplate.propertyLabel,
          value: [groupJson?.[0].id] // Dropdown always has only one answer
        })

        options.forEach((ref)=>{
          const resourceTemplate = fields[ref]
          pathToField = `${pathToField}_${resourceTemplate.resourceLabel}`
          const fieldsMap: RenderedFieldMap = groupMap.get?.(resourceTemplate.resourceURI)?.fields ?? new Map()
          
          if (fieldsMap.size === 0) {
            groupMap.set?.(resourceTemplate.resourceURI, {
              fields: fieldsMap,
              name: resourceTemplate.resourceLabel,
              id: resourceTemplate.id,
              path: pathToField,
              type: UIFieldRenderType.dropdownOption,
              uri: resourceTemplate.resourceURI
            }) 
          }

          resourceTemplate.propertyTemplates.forEach(optionPropertyTemplate => {
            // Option has no value, only parent dropdown has this one, so json argument is undefined
            parseField(
              {
                propertyTemplate: optionPropertyTemplate, 
                fields, 
                parent: fieldsMap, 
                path: pathToField, 
                level: level + 1
              })
          })
        })
      }
    }
  }

  const parseUserInputScheme = (scheme: any, fields: PreparedFields): void => {
    // Going through all block that we need to render (work, instance, item)  
    const schemeMap: RenderedFieldMap = new Map()

    // Iterate on bibframe profiles and the user input scheme at the same time.
    UI_BLOCKS.forEach(blockId => {
      const block = fields[blockId[0]]; // Data from the other profile
      const blockJson = scheme[blockId[1]] // Data from user input json
      const blockMap: RenderedFieldMap = new Map()
      
      schemeMap.set(block.resourceLabel, {
        type: UIFieldRenderType.block,
        fields: blockMap,
        path: block.resourceLabel
      })
      
      block.propertyTemplates.forEach(propertyTemplate => {
        parseField({
          propertyTemplate, 
          fields, 
          parent: blockMap, 
          path: block.resourceLabel, 
          level: 1,
          json: blockJson
        })
      })
    })

    setNormalizedFields(schemeMap)
  }
  
  const getUserInputScheme = async () => {
    const response = await fetchUserInputScheme();
    setUserInputScheme(response)
    
    return response
  }

  const getProfiles = async (): Promise<any> => {
    const userInput = await getUserInputScheme()
    const response = await fetchProfiles()
    const monograph = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH)

    setProfiles(response)
    setSelectedProfile(monograph)
    parseUserInputScheme(userInput, prepareFields(response))

    return response
  }

  const getStartingPoints = async (): Promise<any> => {
    const response = await fetchStartingPoints()

    setStartingPoints(response)

    return response
  }

  return { getProfiles, getStartingPoints, prepareFields }
}