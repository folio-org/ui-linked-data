import { useRecoilValue } from "recoil"
import state from "../../state/state"
import { PropertyTemplate } from "../PropertyTemplate/PropertyTemplate"

import './EditSection.scss'

export const EditSection = () => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates

  return resourceTemplates ? (
    <div className="edit-section">
      <div className="input-group">
        {
          resourceTemplates.find((i) => i.id === 'lc:RT:bf2:Monograph:Work')
            ?.propertyTemplates
            .map((e: PropertyTemplate) => <PropertyTemplate key={e.propertyLabel} entry={e} />)
        }
        <hr />
        {
          resourceTemplates.find((i) => i.id === 'lc:RT:bf2:Monograph:Instance')
            ?.propertyTemplates
            .map((e: PropertyTemplate) => <PropertyTemplate key={e.propertyLabel} entry={e} />)
        }
      </div>
    </div>
  ) : null
}