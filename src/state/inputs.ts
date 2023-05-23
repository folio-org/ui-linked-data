import { atom } from 'recoil'
const userValues = atom<Array<{field: string, value: string}>>({
    key: 'config.userValues',
    default: [],
})


export default {
    userValues
}