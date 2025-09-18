import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { SchemaControlType } from '@common/constants/uiControls.constants';
import { getHtmlIdForSchemaControl } from '@common/helpers/schema.helper';
import { Tooltip } from '@components/Tooltip';
import InfoIcon from '@src/assets/info.svg?react';
import './MarcTooltip.scss';

export interface MarcMapping {
  [fieldName: string]: string;
}

export interface MarcTooltipProps {
  mapping: MarcMapping | undefined;
  className?: string;
  htmlId?: string;
}

export const MarcTooltip: FC<MarcTooltipProps> = ({ mapping, className, htmlId }) => {
  const { formatMessage } = useIntl();

  if (!mapping || Object.keys(mapping).length === 0) {
    return null;
  }

  const tooltipContent = (
    <>
      <h4 className="marc-tooltip-title">
        <FormattedMessage id="ld.marcFieldEquivalents" defaultMessage="MARC field equivalents" />
      </h4>
      {Object.entries(mapping).map(([field, marc]) => (
        <div key={field} className="marc-tooltip-row">
          <span className="marc-tooltip-field">{field}:</span>
          <span className="marc-tooltip-mapping">{marc}</span>
        </div>
      ))}
    </>
  );

  return (
    <Tooltip
      className={classNames(['marc-tooltip-wrapper', className])}
      contentClassName="marc-tooltip-content"
      triggerContent={<InfoIcon className="marc-tooltip-icon" />}
      triggerOpenAriaLabel={formatMessage({ id: 'ld.showMarcFieldEquivalents' })}
      triggerCloseAriaLabel={formatMessage({ id: 'ld.hideMarcFieldEquivalents' })}
      content={tooltipContent}
      data-testid={getHtmlIdForSchemaControl(SchemaControlType.ShowMarcEquivalents, htmlId)}
    />
  );
};
