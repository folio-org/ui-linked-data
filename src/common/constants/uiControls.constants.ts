export const UI_BLOCKS: [string, string][] = [
    [
      'lc:RT:bf2:Monograph:Work', // id 
      'http://id.loc.gov/ontologies/bibframe/Work' // propertyURI
    ],
    [
      'lc:RT:bf2:Monograph:Instance', // id 
      'http://id.loc.gov/ontologies/bibframe/Instance' // propertyURI
    ],
  ]

export enum UIFieldRenderType {
  block = "block",
  group = "group",
  hidden = "hidden",
  dropdown = "dropdown",
  dropdownOption = "dropdownOption",
};
