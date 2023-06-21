interface UserValue {
  field: string;
  value: RenderedFieldValue[];
  hasChildren?: boolean;
}

type RenderedFieldMap = Map<string, RenderedField>;

type FieldRenderType = FieldType | 'block' | 'group' | 'groupComplex' | 'hidden' | 'dropdown' | 'dropdownOption';
type RenderedFieldValue = {
  id?: Nullable<string>;
  label?: string;
  uri?: Nullable<string>;
};
type RenderedField = {
  type: FieldRenderType;
  fields?: RenderedFieldMap;
  path: string;
  name?: string;
  uri?: string;
  value?: RenderedFieldValue[];
  id?: string;
};

type PreviewMap = Map<string, PreviewBlock>;

type PreviewBlock = {
  title: string;
  groups: Map<string, PreviewGroup>;
};

type PreviewGroup = {
  title: string;
  value: PreviewFieldValue[];
};

type PreviewFieldValue = Partial<RenderedFieldValue> & { field: string };
