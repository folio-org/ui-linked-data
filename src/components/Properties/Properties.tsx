import { useRecoilValue } from 'recoil';
import { RESOURCE_TEMPLATE_IDS } from '../../common/constants/bibframe.constants';
import state from '../../state/state';
import './Properties.scss';

export const Properties = () => {
  const selectedProfile = useRecoilValue(state.config.selectedProfile);
  const profiles = useRecoilValue(state.config.profiles);

  if (!selectedProfile) {
    return null;
  }

  const renderData = (data: PropertyTemplate[]) => {
    return data?.map((e: PropertyTemplate, index) => {
      const els = [];

      if (e.valueConstraint.valueTemplateRefs.length > 0) {
        const resourceTemplates = profiles.map(e => e.json.Profile.resourceTemplates);
        const data = e.valueConstraint.valueTemplateRefs.map(
          id => resourceTemplates.flat().find(el => el.id === id)?.resourceLabel,
        );
        els.push(data);
      }

      let ul;
      if (els.length > 0) {
        const lis = els.flat().map(el => (
          <li key={el} className="property-subitem">
            {el}
          </li>
        ));

        ul = (
          <ul className="property-subitems" key={e.id}>
            {lis}
          </ul>
        );
      }
      return (
        <li className="property" key={index}>
          <span>{e.propertyLabel}</span>
          {ul}
        </li>
      );
    });
  };

  const aside = [selectedProfile.json.Profile.resourceTemplates[0], selectedProfile.json.Profile.resourceTemplates[1]];

  return selectedProfile ? (
    <div className="properties">
      <ul>
        {aside.map((data: ResourceTemplate, index) => (
          <div key={index}>
            <strong>{RESOURCE_TEMPLATE_IDS[data.id]}</strong>
            {renderData(data.propertyTemplates)}
          </div>
        ))}
      </ul>
    </div>
  ) : null;
};
