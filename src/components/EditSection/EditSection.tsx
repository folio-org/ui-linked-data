import { useRecoilValue, useSetRecoilState } from 'recoil';
import state from '../../state/state';
import { LiteralField } from '../LiteralField/LiteralField';

import './EditSection.scss';
import { replaceItemAtIndex } from '../../common/helpers/common.helper';
import { DropdownField } from '../DropdownField/DropdownField';
import { SimpleLookupField } from '../SimpleLookupField/SimpleLookupField';
import { FieldType } from '../../common/constants/bibframe.constants';
import { UIFieldRenderType } from '../../common/constants/uiControls.constants';
import { ComplexLookupField } from '../ComplexLookupField/ComplexLookupField';
import { getUserValueByPath } from '../../common/helpers/uiControls.helper';

export const EditSection = () => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates;
  const normalizedFields = useRecoilValue(state.config.normalizedFields);
  const userValue = useRecoilValue(state.inputs.userValues);
  const setUserValue = useSetRecoilState(state.inputs.userValues);

  const changeValue = (value: RenderedFieldValue | RenderedFieldValue[], fieldId: string, isDynamicField?: boolean) => {
    return setUserValue(oldValue => {
      const index = oldValue.findIndex(({ field }) => field === fieldId);
      const newValue: UserValue = {
        field: fieldId,
        value: value instanceof Array ? value : [value],
      };

      if (isDynamicField) {
        newValue.hasChildren = true;
      }

      return index === -1 ? [...oldValue, newValue] : replaceItemAtIndex(oldValue, index, newValue);
    });
  };

  const drawDependentFields = (group: RenderedField, userValue: UserValue[]) => {
    // Dropdown can have only one selected option
    const selectedUserValue = getUserValueByPath(userValue, group.path)?.[0];
    const selectedFields = group.fields?.get(selectedUserValue?.uri);
    let dependingFields = null;

    if (selectedFields?.fields) {
      const selectedFieldsList: RenderedField[] = Array.from(selectedFields?.fields?.values());

      dependingFields = selectedFieldsList.map(field => drawField(field));
    }

    return dependingFields;
  };

  const drawComplexGroup = (group: RenderedField) => {
    const groupFields = group.fields;

    if (!groupFields) {
      return null;
    }

    return Array.from(groupFields.values()).reduce((accum: unknown[], { type, fields }) => {
      if (type === UIFieldRenderType.hidden && fields) {
        Array.from(fields.values()).forEach(entry => {
          accum.push(drawField(entry, entry.path));
        });
      }

      return accum;
    }, []);
  };

  const drawField = (group: RenderedField, key?: string) => {
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
          key={key || group.path}
        />
      );
    }

    if (group.type === FieldType.COMPLEX) {
      return (
        <ComplexLookupField
          key={key || group.path}
          label={group.name ?? ''}
          id={group.path ?? ''}
          value={value?.[0]}
          onChange={changeValue}
        />
      );
    }

    if (group.type === UIFieldRenderType.groupComplex) {
      return drawComplexGroup(group);
    }

    if (isLiteralGroupType && !value) {
      // Literal can have only one value
      const literalValue = getUserValueByPath(userValue, group.path)?.[0];

      return (
        <LiteralField
          key={key || group.path}
          label={group.name ?? ''}
          id={group.path}
          value={literalValue}
          onChange={changeValue}
        />
      );
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
            <div key={group.path}>
              <DropdownField
                options={options}
                name={group.name ?? ''}
                id={group.path}
                onChange={changeValue}
                value={selectedOption}
              />
              {drawDependentFields(group, userValue)}
            </div>
          );
        }
      }

      return null;
    });
  };

  return resourceTemplates ? (
    <div className="edit-section">
      {Array.from(normalizedFields.values()).map(block => (
        <div key={block.path}>
          {Array.from<RenderedField>(block.fields?.values())?.map(group => (
            <div className="group" key={group.path}>
              <h3>{group.name}</h3>
              <>{drawField(group)}</>
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : null;
};
