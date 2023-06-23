import { FC } from 'react';

import './PropertyTemplate.scss';

import { LiteralField } from '../LiteralField/LiteralField';
import { SimpleLookupField } from '../SimpleLookupField/SimpleLookupField';
import { getComponentType } from '../../common/helpers/common.helper';

type PropertyTemplateProps = {
  entry: PropertyTemplate;
};

export const PropertyTemplate: FC<PropertyTemplateProps> = ({ entry }) => {
  const componentType = getComponentType(entry);

  const fieldComponent = () => {
    if (componentType === 'LITERAL') {
      return <LiteralField label={entry.propertyLabel} />;
    } else if (componentType === 'SIMPLE') {
      return <SimpleLookupField uri={entry.valueConstraint.useValuesFrom[0]} />;
    } else {
      return null;
    }
  };

  return (
    <div className="input-wrapper">
      <div>{entry.propertyLabel}</div>
      {fieldComponent()}
    </div>
  );
};
