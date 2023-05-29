import { useSetRecoilState } from 'recoil'
import state from '../../state/state'
import { fetchProfiles, fetchStartingPoints } from '../api/profiles.api'

export default function useConfig() {
  const setProfiles = useSetRecoilState(state.config.profiles)
  const setStartingPoints = useSetRecoilState(state.config.startingPoints)
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile)

  const getProfiles = async (): Promise<any> => {
    const res = await fetchProfiles()
    const monograph = res.find((i: ProfileEntry) => i.name === 'BIBFRAME 2.0 Monograph')

    setProfiles(res)
    setSelectedProfile(monograph)

    return res
  }

  const getStartingPoints = async (): Promise<any> => {
    const res = await fetchStartingPoints()

    setStartingPoints(res)

    return res
  }

  return { getProfiles, getStartingPoints }
}
