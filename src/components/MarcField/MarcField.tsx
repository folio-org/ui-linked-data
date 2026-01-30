import { FC, Fragment } from 'react';

import './MarcField.scss';

type MarcField = {
  field: MarcDTOParsedRecordContentField;
};

const normalizeIndicator = (indicator?: string) => indicator?.replace(/\\/g, ' ');

export const MarcField: FC<MarcField> = ({ field }) => {
  const fieldTag = Object.keys(field)[0];
  const hasIndicators = typeof field[fieldTag] !== 'string';
  const typedSelectedFieldTag = field[fieldTag] as MarcDTOParsedRecordContentSubfield;
  const subFields = hasIndicators
    ? typedSelectedFieldTag.subfields?.map((subFieldTag, index) => {
        const subKey = Object.keys(subFieldTag)[0];

        const subfieldValue = typedSelectedFieldTag.isHighlighted ? (
          <mark>{subFieldTag[subKey]}</mark>
        ) : (
          subFieldTag[subKey]
        );

        return (
          <Fragment key={`subfield-${index}-${subKey}`}>
            <span>$</span>
            {subKey} {subfieldValue}{' '}
          </Fragment>
        );
      })
    : normalizeIndicator(field[fieldTag] as string);

  return (
    <tr className="marc-field" data-test-instance-marc-field>
      <td className="field-code">{fieldTag}</td>
      {hasIndicators && (
        <td className="field-indicators">{`${normalizeIndicator(typedSelectedFieldTag?.ind1)} ${normalizeIndicator(
          typedSelectedFieldTag?.ind2,
        )}`}</td>
      )}
      <td className="field-contents" colSpan={hasIndicators ? 2 : 3}>
        {subFields}
      </td>
    </tr>
  );
};
