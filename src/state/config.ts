import { atom } from 'recoil'

const profiles = atom<Array<any>>({
  key: 'config.profiles',
  default: [],
})

const userValues = atom<Array<{field: string, value: string}>>({
  key: 'config.userValues',
  default: [],
})

const startingPoints = atom<Array<any>>({
  key: 'config.startingPoints',
  default: [],
})

export default {
  profiles,
  startingPoints,
}
