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
  propertyURI: URL,
  propertyLabel: string,
  mandatory: boolean,
  repeatable: boolean,
  type: string | URL, // "literal" | "resource"
  valueConstraint: ValueConstraint,
}

type ValueConstraint = {
  valueLanguage: string,
  languageURI: URL,
  languageLabel: string,
  valueDataType: ValueDataType,
  valueTemplateRefs: Array<string>,
  useValuesFrom: Array<URL>,
  editable: boolean,
  remark: string,
}

type ValueDataType = {
  dataTypeURI: URL,
  dataTypeLabel: string,
  dataTypeLabelHint: string,
  remark: string,
}
