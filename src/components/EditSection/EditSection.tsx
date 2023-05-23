import { useRecoilValue } from "recoil"
import state from "../../state/state"
import { PropertyTemplate } from "../PropertyTemplate/PropertyTemplate"

import './EditSection.scss'

export const EditSection = () => {
  const profiles = useRecoilValue(state.config.profiles)

  return (
    <div>
      <div style={{fontWeight: 'bold'}}>Edit pane</div>
      <div className="input-group">
        {
          profiles.length > 0 && profiles
            .find((i) => i.name === "BIBFRAME 2.0 Monograph")
            .json["Profile"]
            .resourceTemplates[0]
            .propertyTemplates
            .map((e: PropertyTemplate) => <PropertyTemplate key={e.propertyLabel} entry={e} />)
        }
        -------------
        {
          profiles.length > 0 && profiles
            .find((i) => i.name === "BIBFRAME 2.0 Monograph")
            .json["Profile"]
            .resourceTemplates[1]
            .propertyTemplates
            .map((e: PropertyTemplate) => <PropertyTemplate key={e.propertyLabel} entry={e} />)
        }
      </div>
    </div>
  )
}