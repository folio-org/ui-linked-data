type CommonParams = {
  id: string,
  contact: string,
  remark: string,
}

type BibframeProfile = CommonParams & {
  title: string,
  description: string,
  date: string,
  resourceTemplates: Array<ResourceTemplate>,
}

type ResourceTemplate = CommonParams & {
  resourceURI: URL,
  resourceLabel: string,
  propertyTemplates: Array<>,
}

type PropertyTemplate = Omit<CommonParams, 'contact'> & {
  propertyURI: string,
  propertyLabel: string,
  mandatory: boolean,
  repeatable: boolean,
  type: string | URL, // "literal" | "resource"
  valueConstraint: ValueConstraint,
}

type PropertyTemplateUserValue = PropertyTemplate & {
  userValue?: {
    '@type': string,
    '@value': string | undefined
  }
}

type ValueConstraint = {
  valueLanguage: string,
  languageURI: string,
  languageLabel: string,
  valueDataType: ValueDataType,
  valueTemplateRefs: Array<string>,
  useValuesFrom: Array<string>,
  editable: boolean,
  remark: string,
}

type ValueDataType = {
  dataTypeURI: string,
  dataTypeLabel: string,
  dataTypeLabelHint: string,
  remark: string,
}

type FieldType = "META" | "HIDE" | "REF" | "LITERAL" | "SIMPLE" | "COMPLEX";