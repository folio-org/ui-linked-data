import { useRecoilState } from 'recoil'
import state from '../../state/state'
import { fetchProfiles, fetchStartingPoints } from '../api'

export default function useConfig() {
  const [, setProfiles] = useRecoilState(state.config.profiles)
  const [, setStartingPoints] = useRecoilState(state.config.startingPoints)

  const getProfiles = async (): Promise<any> => {
    const res = await fetchProfiles()

    setProfiles(res)

    return res
  }

  const getStartingPoints = async (): Promise<any> => {
    const res = await fetchStartingPoints()

    setStartingPoints(res)

    return res
  }

  return { getProfiles, getStartingPoints }
}
