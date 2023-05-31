import { atom } from 'recoil'
const userValues = atom<UserValue[]>({
    key: 'config.userValues',
    default: [],
})

export default {
    userValues
}