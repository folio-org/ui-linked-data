import { lookupConfig } from "../../constants"

export const getComponentType = (propertyTemplate: PropertyTemplate): FieldType | null => {
    // these meta componets are structural things, like add new instances/items. etc
    if (propertyTemplate.propertyURI === "http://id.loc.gov/ontologies/bibframe/hasInstance") {
      return "META"
    }

    if (propertyTemplate.propertyURI === "http://id.loc.gov/ontologies/bibframe/instanceOf") {
      return "META"
    }
    
    // we handle this structural thing elsewhere
    if (propertyTemplate.propertyURI === "http://id.loc.gov/ontologies/bibframe/hasItem") {
      return "HIDE"
    }   
  
    if (propertyTemplate.valueConstraint.valueTemplateRefs.length > 0){
      return 'REF'
    }

    if (propertyTemplate.type === 'literal'){
      return 'LITERAL'
    }
    
    let type: FieldType = 'SIMPLE'
    if (propertyTemplate.valueConstraint.useValuesFrom.length==0) return null

    propertyTemplate.valueConstraint.useValuesFrom.forEach((cs)=>{
      if (lookupConfig[cs] && lookupConfig[cs].type.toLowerCase() == 'complex'){
        type='COMPLEX'
      }
    })
    return type
}