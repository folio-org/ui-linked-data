import { FC, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';
import { DatePicker } from '@components/DatePicker';
import './DateRange.scss';

type DateRangeProps = {
  facet?: string;
  onSubmit?: (facet: string, value: any) => void;
};

export const DateRange: FC<DateRangeProps> = ({ facet, onSubmit }) => {
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const handleApplyClick = () => {
    if (!facet) return;

    onSubmit?.(facet, { dateStart, dateEnd });
  };

  const idStart = `${facet}-start`;
  const idEnd = `${facet}-end`;

  return (
    <div className="date-range">
      <div className="date-range-group">
        <p className="date-range-label">
          <FormattedMessage id="ld.from" />
        </p>
        <DatePicker
          id={idStart}
          data-testid={idStart}
          placeholder={'YYYY-MM-DD'}
          name="dateStart"
          value={dateStart}
          onChange={setDateStart}
        />
      </div>

      <div className="date-range-group">
        <p className="date-range-label">
          <FormattedMessage id="ld.to" />
        </p>
        <DatePicker
          id={idEnd}
          data-testid={idEnd}
          placeholder={'YYYY-MM-DD'}
          name="dateEnd"
          value={dateEnd}
          onChange={setDateEnd}
        />
      </div>

      <Button data-testid={`${facet}-apply`} type={ButtonType.Primary} onClick={handleApplyClick}>
        <FormattedMessage id="ld.apply" />
      </Button>
    </div>
  );
};
