import { atom } from 'recoil'

const profiles = atom<Array<any>>({
  key: 'config.profiles',
  default: [],
})

const startingPoints = atom<Array<any>>({
  key: 'config.startingPoints',
  default: [],
})

// const profilesToShow = atom<Array<string>>({})

export default {
  profiles,
  startingPoints,
}
