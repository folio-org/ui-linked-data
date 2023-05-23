import { atom } from 'recoil'

const profiles = atom<Array<any>>({
  key: 'config.profiles',
  default: [],
})

const startingPoints = atom<Array<any>>({
  key: 'config.startingPoints',
  default: [],
})

export default {
  profiles,
  startingPoints
}
