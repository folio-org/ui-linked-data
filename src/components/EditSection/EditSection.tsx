import { useRecoilValue, useSetRecoilState } from 'recoil';
import state from '../../state/state';
import { LiteralField } from '../LiteralField/LiteralField';

import './EditSection.scss';
import { replaceItemAtIndex } from '../../common/helpers/common.helper';
import { DropdownField } from '../DropdownField/DropdownField';
import { SimpleLookupField } from '../SimpleLookupField/SimpleLookupField';
import { FieldType } from '../../common/constants/bibframe.constants';
import { UIFieldRenderType } from '../../common/constants/uiControls.constants';

export const EditSection = () => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates;
  const normalizedFields = useRecoilValue(state.config.normalizedFields);

  const userValue = useRecoilValue(state.inputs.userValues);
  const setUserValue = useSetRecoilState(state.inputs.userValues);

  const changeValue = (value: RenderedFieldValue | RenderedFieldValue[], fieldId: string) => {
    return setUserValue(oldValue => {
      const index = oldValue.findIndex(({ field }) => field === fieldId);
      const newValue = {
        field: fieldId,
        value: value instanceof Array ? value : [value],
      };

      return index === -1 ? [...oldValue, newValue] : replaceItemAtIndex(oldValue, index, newValue);
    });
  };

  const drawDependentFields = (group: RenderedField, userValue: UserValue[]) => {
    const selectedUserValue = userValue.find(({ field }) => field === group.path)?.['value']?.[0];
    const selectedFields = group.fields?.get(selectedUserValue?.uri);
    let dependingFields = null;

    if (selectedFields?.fields) {
      const selectedFieldsList: RenderedField[] = Array.from(selectedFields?.fields?.values());

      dependingFields = selectedFieldsList.map(field => <div key={field.id}>{drawField(field)}</div>);
    }

    return dependingFields;
  };

  const drawField = (group: RenderedField) => {
    const value = group.value;
    const isLiteralGroupType = group.type === FieldType.LITERAL;

    if (group.type === FieldType.SIMPLE) {
      return (
        <SimpleLookupField
          label={group.name ?? ''}
          uri={group.uri ?? ''}
          id={group.path ?? ''}
          value={value ?? []}
          onChange={changeValue}
          key={group.path}
        />
      );
    }

    if (isLiteralGroupType && !value) {
      return <LiteralField label={group.name ?? ''} id={group.path} onChange={changeValue} />;
    }

    return value?.map(field => {
      if (isLiteralGroupType) {
        return (
          <LiteralField key={field.uri} label={group.name ?? ''} id={group.path} value={field} onChange={changeValue} />
        );
      }

      if (group.fields?.size && group.fields.size > 0) {
        if (group.type === UIFieldRenderType.dropdown) {
          const options = Array.from(group.fields.values()).map(({ name, uri, id }) => ({
            label: name ?? '',
            value: uri ?? '',
            uri: uri ?? '',
            id,
          }));

          const selectedOption = options.find(({ id }) => id === value?.[0]) || options[0];

          return (
            <>
              <DropdownField
                options={options}
                name={group.name ?? ''}
                id={group.path}
                onChange={changeValue}
                value={selectedOption}
                key={group.path}
              />
              {drawDependentFields(group, userValue)}
            </>
          );
        }
      }

      return null;
    });
  };

  return resourceTemplates ? (
    <div className="edit-section">
      {Array.from(normalizedFields.values()).map(block =>
        Array.from<RenderedField>(block.fields?.values())?.map(group => (
          <div className="group" key={group.name}>
            <h3>{group.name}</h3>
            {drawField(group)}
          </div>
        )),
      )}
    </div>
  ) : null;
};
