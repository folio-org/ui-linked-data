import { useRecoilValue } from "recoil"
import state from "../../state/state"
import './Properties.scss'

export const Properties = () => {
  const profiles = useRecoilValue(state.config.profiles)

  return (
    <div className="properties">
      <div>BIBFRAME (Monograph) Profiles:</div>
      <ul>
      {
        profiles.length > 0 && profiles
          .find((i) => i.name === "BIBFRAME 2.0 Monograph")
          .json["Profile"]
          .resourceTemplates[0]
          .propertyTemplates
          .map((e: PropertyTemplate) => (
            <li>{e.propertyLabel}</li>
          ))
      }
      --------------------
      {
        profiles.length > 0 && profiles
          .find((i) => i.name === "BIBFRAME 2.0 Monograph")
          .json["Profile"]
          .resourceTemplates[1]
          .propertyTemplates
          .map((e: PropertyTemplate) => (
            <li>{e.propertyLabel}</li>
          ))
      }
      </ul>
    </div>
  )
}