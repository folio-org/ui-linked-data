import { useRecoilValue } from 'recoil';
import { postRecord } from '../../common/api/records.api';
import state from '../../state/state';
import './Preview.scss';

export const Preview = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile);
  const userValues = useRecoilValue(state.inputs.userValues);

  const generateJsonFor = (propertyTemplates: PropertyTemplate[]) => {
    const labels = userValues.map(({ field }) => field);
    return propertyTemplates.reduce<PropertyTemplate[]>((arr, currentValue) => {
      const updatedValue = { ...currentValue };

      if (labels.includes(currentValue.propertyLabel)) {
        updatedValue.userValue = {
          '@type': updatedValue.propertyURI,
          '@value': userValues.find(({ field }) => field === currentValue.propertyLabel)?.value,
        };
      }

      arr.push(updatedValue);

      return arr;
    }, []);
  };

  const generateJson = () => {
    if (!selectedProfile) {
      return;
    }

    const [workPropertyTemplate, instancePropertyTemplate] = selectedProfile.json['Profile'].resourceTemplates;
    const workJson = generateJsonFor(workPropertyTemplate.propertyTemplates);
    const instanceJson = generateJsonFor(instancePropertyTemplate.propertyTemplates);

    const recordEntry: RecordEntry = {
      graphName: String(Math.ceil(Math.random() * 100000)),
      configuration: {
        instanceValues: instanceJson,
        workValues: workJson,
      },
    };

    postRecord(recordEntry);

    // take selected profile
    // insert workJson, instanceJson in their respectable positions in the selected ptofile
    // post the selected profile with rt.pt inserted

    return;
  };

  const getTitleFromId = (fieldId: string) => {
    const parts = fieldId.split('_');
    return parts[parts.length - 1];
  };

  return (
    <div className="preview-panel">
      <strong>Preview pane</strong>
      {userValues.map(
        ({ value, field }) =>
          value?.length > 0 && (
            <div key={field} className="preview-block">
              <strong>{getTitleFromId(field)}</strong>
              {value?.map(({ uri, label }) =>
                uri ? (
                  <div key={uri}>
                    <a href={uri} target="__blank">
                      {label}
                    </a>
                  </div>
                ) : (
                  <div key={uri}>{label}</div>
                ),
              )}
            </div>
          ),
      )}
      <br />
      <button onClick={generateJson}>Post Record</button>
    </div>
  );
};
