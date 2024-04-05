import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { Button, ButtonType } from '@components/Button';
import CaretDown from '@src/assets/caret-down.svg?react';
import Lightbulb from '@src/assets/lightbulb-shining-16.svg?react';
import { Classifications, TitleTypes } from '@common/constants/search.constants';
import './WorkDetailsCard.scss';

type WorkDetailsCard = Omit<WorkAsSearchResultDTO, 'instances'> & {
  isOpen?: boolean;
  toggleIsOpen?: VoidFunction;
};

export const WorkDetailsCard: FC<WorkDetailsCard> = ({
  id,
  contributors,
  languages,
  classifications,
  isOpen,
  toggleIsOpen,
  titles,
}) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const title =
    !!titles?.length &&
    titles
      ?.filter(({ type }) => type === TitleTypes.Main || type === TitleTypes.Sub)
      ?.map(({ value }) => value)
      ?.join(formatMessage({ id: 'marva.spaceInBrackets' }));
  const creatorName = contributors?.find(({ isCreator }) => isCreator)?.name;
  const langCode = languages?.find(({ value }) => value)?.value;
  const classificationNumber = classifications?.find(({ number, source }) => number && source === Classifications.DDC)
    ?.number;

  return (
    <div className="work-details-card">
      <div className="heading">
        <Button type={ButtonType.Ghost} onClick={toggleIsOpen} data-testid="work-details-card-toggle">
          <CaretDown className={classNames({ ['icon-collapsed']: !isOpen }, 'toggle-icon')} />
        </Button>
        <div className="title">
          <Lightbulb />
          <span>
            <FormattedMessage id="marva.work" />
          </span>
        </div>
        <Button
          type={ButtonType.Primary}
          onClick={() => navigate(generateEditResourceUrl(id))}
          data-testid="edit-button"
          className={classNames(['edit-button', 'button-nowrap', 'button-capitalize'])}
        >
          <FormattedMessage id="marva.editWork" />
        </Button>
      </div>
      <div className="details">
        <div className="title">{title || <FormattedMessage id="marva.noTitleInBrackets" />}</div>
        {creatorName && (
          <div className="details-item">
            <span>
              <FormattedMessage id="marva.creator" />
            </span>
            <span>
              <Link to="#">{creatorName}</Link>
            </span>
          </div>
        )}
        {langCode && (
          <div className="details-item">
            <span>
              <FormattedMessage id="marva.language" />
            </span>
            <span>{langCode}</span>
          </div>
        )}
        {classificationNumber && (
          <div className="details-item">
            <span>
              <FormattedMessage id="marva.classificationNumber" />
            </span>
            <span>{classificationNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};
