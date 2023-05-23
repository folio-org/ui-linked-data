import { useRecoilValue } from "recoil"
import state from "../../state/state"
import './Properties.scss'

export const Properties = () => {
  const profiles = useRecoilValue(state.config.profiles)
  const profile = profiles
  ?.find((i) => i.name === "BIBFRAME 2.0 Monograph")
  ?.json["Profile"]

  const renderData = (data: PropertyTemplate[]) => {
    return data?.map((e: PropertyTemplate, index) => {
      const els = [];

      if (e.valueConstraint.valueTemplateRefs.length > 0){
        const resourceTemplates = profiles.map(e=>e.json.Profile.resourceTemplates);
        const data = e.valueConstraint.valueTemplateRefs.map(id => resourceTemplates.flat().find(el => el.id === id).resourceLabel)
        els.push(data)
      }

      let ul;
      if (els.length > 0){
        const lis = els.flat().map(el => <li key={el} className="property-subitem">{el}</li>)

        ul = <ul className="property-subitems" key={e.id}>{ lis }</ul>
      }
      return (
      <li 
        className="property"
        key={index}
      >
        <span>
          {e.propertyLabel}
          </span>
        {ul}
      </li>
      )
    })
  }

  const aside = [
    profile?.resourceTemplates[0].propertyTemplates,
    profile?.resourceTemplates[1].propertyTemplates
  ]

  return (
    <div className="properties">
      <div>BIBFRAME (Monograph) Profiles:</div>
      <ul>
        {
          profiles.length && aside.map((data, index) => 
            <div key={index}>
              {
                renderData(data)
              }
              -----------------
            </div>
          )
      }
      </ul>
    </div>
  )
}