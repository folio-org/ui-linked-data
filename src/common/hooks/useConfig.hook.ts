import { useRecoilState, useSetRecoilState } from 'recoil'
import state from '../../state/state'
import { fetchProfiles, fetchStartingPoints, fetchUserInputScheme } from '../api/profiles.api'

export default function useConfig() {
  const setProfiles = useSetRecoilState(state.config.profiles)
  const setStartingPoints = useSetRecoilState(state.config.startingPoints)
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile)
  const setUserInputScheme = useSetRecoilState(state.inputs.userInputScheme)
  const setPreparedFields = useSetRecoilState(state.config.preparedFields)
  
  const getUserInputScheme = async () => {
    const res = await fetchUserInputScheme();
    setUserInputScheme(res)
  }

  const getProfiles = async (): Promise<any> => {
  await getUserInputScheme()
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
    const res = await fetchProfiles()
    const monograph = res.find((i: ProfileEntry) => i.name === 'BIBFRAME 2.0 Monograph')

    setProfiles(res)
    setSelectedProfile(monograph)
    prepareFields(res)

    return res
  }

  const getStartingPoints = async (): Promise<any> => {
    const res = await fetchStartingPoints()

    setStartingPoints(res)

    return res
  }

  return { getProfiles, getStartingPoints, prepareFields }
}
