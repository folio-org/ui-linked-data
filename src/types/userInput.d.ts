interface UserValue {
    field: string
    value: RenderedFieldValue[]
}

type RenderedFieldMap = Map<string, RenderedField>

type FieldRenderType = FieldType | 'block' | 'group' | 'hidden' | 'dropdown' | 'dropdownOption'
type RenderedFieldValue = {
    id?: Nullable<string>,
    label?: string,
    uri?: Nullable<string>,
}
type RenderedField = {
  type: FieldRenderType,
  fields?: RenderedFieldMap,
  path: string,
  name?: string,
  uri?: string,
  value?: RenderedFieldValue[],
  id?: string
}