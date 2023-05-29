import { useRecoilValue } from "recoil"
import { postRecord } from "../../common/api/records.api"
import state from "../../state/state"
import "./Preview.scss"

export const Preview = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile)
  const userValues = useRecoilValue(state.inputs.userValues)

  const generateJsonFor = (propertyTemplates: PropertyTemplate[]) => {
      const labels = userValues.map(uv => uv.field);
      return propertyTemplates.reduce<PropertyTemplate[]>((arr, val) => {
        const v = {...val}

        if (labels.includes(val.propertyLabel)){
          v.userValue = {
            '@type': v.propertyURI,
            '@value': userValues.find(uv => uv.field === val.propertyLabel)?.value
          }
        }

        arr.push(v)
        return arr
      }, [])
  }

  const generateJson = () => {
    if (!selectedProfile) {
      return
    }

    const [
      workPropertyTemplate,
      instancePropertyTemplate,
    ] = selectedProfile.json["Profile"].resourceTemplates
    const workJson = generateJsonFor(workPropertyTemplate.propertyTemplates)
    const instanceJson = generateJsonFor(instancePropertyTemplate.propertyTemplates)

    const recordEntry: RecordEntry = {
      graphName: String(Math.ceil(Math.random() * 100000)),
      configuration: {
        instanceValues: instanceJson,
        workValues: workJson,
      }
    }

    postRecord(recordEntry)

    // take selected profile
    // insert workJson, instanceJson in their respectable positions in the selected ptofile
    // post the selected profile with rt.pt inserted

    return
  }

  return (
    <div className="preview-panel">
      <strong>Preview pane</strong>
      {
        userValues.map((val, i) => Boolean(val.value) && <div key={i}>
          <div>{val.field}</div>
          <strong>{val.value}</strong>
        </div>)
      }
      <br />
      <button onClick={generateJson}>Post Record</button>
    </div>
  )
}