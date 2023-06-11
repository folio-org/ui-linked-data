interface ReactSelectOption { 
    label: string
    value: string
    uri: string
    id?: string
}

interface ReactMultiselectOption { 
    label: string 
    __isNew__: boolean 
}

interface MultiselectOption { 
    label: string 
    value: {
        [key: string]: unknown
    }
}