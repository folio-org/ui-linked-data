import { useRecoilState, useSetRecoilState } from 'recoil'
import state from '../../state/state'
import { fetchProfiles, fetchStartingPoints, fetchUserInputScheme } from '../api/profiles.api'
type RenderedFieldMap = Map<string, RenderedField>

type FieldRenderType = FieldType | 'block' | 'group'
type RenderedField = {
  type: FieldRenderType,
  fields?: RenderedFieldMap,
  path: string,
  name?: string,
  uri?: string,
  value?: {
    id?: string,
    label?: string,
    uri?: string,
  }[]
}

export default function useConfig() {
  const setProfiles = useSetRecoilState(state.config.profiles)
  const setStartingPoints = useSetRecoilState(state.config.startingPoints)
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile)
  const setUserInputScheme = useSetRecoilState(state.inputs.userInputScheme)
  const setPreparedFields = useSetRecoilState(state.config.preparedFields)
  const setNormalizedFields = useSetRecoilState(state.config.normalizedFields)
  
  const prepareFields = (profiles: ProfileEntry[]): PreparedFields => {
    const preparedFields = profiles.reduce<PreparedFields>((fields, profile) => {
      const resourceTemplate = profile.json.Profile.resourceTemplates.reduce<PreparedFields>((resObj, rt)=>{
        resObj[rt.id] = rt
        return resObj
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

  const parseUserInputScheme = (scheme: any, fields: PreparedFields): void => {
    // Going through all block that we need to render (work, instance, item)
    const blocksIds: [string, string][] = [
      [
        'lc:RT:bf2:Monograph:Work', // id 
        'http://id.loc.gov/ontologies/bibframe/Work' // propertyURI
      ],
    ]
  
    const schemeMap: RenderedFieldMap = new Map()

    // Iterate on bibframe profiles and the user input scheme at the same time.
    blocksIds.forEach(blockId => {
      const block = fields[blockId[0]]; // Data from the other profile
      const blockJson = scheme[blockId[1]] // Data from user input json
      const blockMap: RenderedFieldMap = new Map()
      
      schemeMap.set(block.resourceLabel, {
        type: 'block',
        fields: blockMap,
        path: block.resourceLabel
      })
      
      block.propertyTemplates.forEach(propertyTemplate => {
        // TODO: Parsing an each field
      })
    })

    setNormalizedFields(schemeMap)
  }
  
  const getUserInputScheme = async () => {
    const res = await fetchUserInputScheme();
    setUserInputScheme(res)
    return res
  }

  const getProfiles = async (): Promise<any> => {
    const userInput = await getUserInputScheme()
    const res = await fetchProfiles()
    const monograph = res.find((i: ProfileEntry) => i.name === 'BIBFRAME 2.0 Monograph')

    setProfiles(res)
    setSelectedProfile(monograph)
    parseUserInputScheme(userInput, prepareFields(res))

    return res
  }

  const getStartingPoints = async (): Promise<any> => {
    const res = await fetchStartingPoints()

    setStartingPoints(res)

    return res
  }

  return { getProfiles, getStartingPoints, prepareFields }
}