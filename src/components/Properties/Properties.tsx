import { useRecoilValue } from "recoil"
import state from "../../state/state"
import './Properties.scss'

export const Properties = () => {
  const profiles = useRecoilValue(state.config.profiles)
  const profile = profiles
  ?.find((i) => i.name === "BIBFRAME 2.0 Monograph")
  ?.json["Profile"]

  const renderData = (data) => {
    return data?.map((e: PropertyTemplate) => {
      const els = [];

      if (e.valueConstraint.valueTemplateRefs.length > 0){
        const resourceTemplates = profiles.map(e=>e.json.Profile.resourceTemplates);
        const data = e.valueConstraint.valueTemplateRefs.map(id => resourceTemplates.flat().find(el => el.id === id).resourceLabel)
        els.push(data)
      }

      let ul;
      if (els.length > 0){
        const lis = els.flat().map(el => <li style={{
          marginLeft: 20
        }}>{el}</li>)

        ul = <ul  style={{borderTop: '1px solid #000'}} key={e.id}>{ lis }</ul>
      }
      return (
      <li 
        style={{
          border: '1px solid #000',
          marginBottom: 10,
          marginTop: 10
        }}
        key={e.id}
      >
        <span style={{
          padding: 5
        }}>
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
          profiles.length && aside.map(data => 
            <div>
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