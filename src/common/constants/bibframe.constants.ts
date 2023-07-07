export const RESOURCE_TEMPLATE_IDS: Record<string, string> = {
  'lc:RT:bf2:Monograph:Work': 'Work',
  'lc:RT:bf2:Monograph:Instance': 'Instance',
};

export const PROFILE_NAMES = {
  MONOGRAPH: 'BIBFRAME 2.0 Monograph',
};

export const PROFILE_IDS = {
  MONOGRAPH: 'lc:profile:bf2:Monograph',
}

export const CONSTRAINTS: Constraints = {
  repeatable: false,
  editable: true,
  mandatory: false,
  defaults: [],
  useValuesFrom: [],
  valueDataType: {
    dataTypeURI: ''
  }
}
