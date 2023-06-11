import { atom } from 'recoil'

const profiles = atom<Array<ProfileEntry>>({
  key: 'config.profiles',
  default: [],
})

const selectedProfile = atom<ProfileEntry | null>({
  key: 'config.selectedProfile',
  default: null,
})

const startingPoints = atom<Array<any>>({
  key: 'config.startingPoints',
  default: [],
})

const preparedFields = atom<PreparedFields>({
  key: 'config.preparedFields',
  default: {},
})
export default {
  profiles,
  startingPoints,
  selectedProfile,
  preparedFields,
}
