interface ReactSelectOption { 
    label: string 
    __isNew__: boolean 
}

interface SelectOption { 
    label: string 
    value: {
        [key: string]: unknown
    }
}