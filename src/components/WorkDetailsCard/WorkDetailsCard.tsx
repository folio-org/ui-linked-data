import { FC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { Button, ButtonType } from '@components/Button';
import CaretDown from '@src/assets/caret-down.svg?react';
import Lightbulb from '@src/assets/lightbulb-shining-16.svg?react';
import { Classifications } from '@common/constants/search.constants';
import { IS_DISABLED_FOR_ALPHA } from '@common/constants/feature.constants';
import { getTitle } from '@common/helpers/search.helper';
import './WorkDetailsCard.scss';

type WorkDetailsCard = Omit<WorkAsSearchResultDTO, 'instances'> & {
  isOpen?: boolean;
  toggleIsOpen?: VoidFunction;
  handleOpenPreview?: (id: string) => void;
};

export const WorkDetailsCard: FC<WorkDetailsCard> = ({
  id,
  contributors,
  languages,
  classifications,
  isOpen,
  toggleIsOpen,
  handleOpenPreview,
  titles,
}) => {
  const { formatMessage } = useIntl();
  const { navigateToEditPage } = useNavigateToEditPage();
  const title = getTitle(titles);
  const creatorName = contributors?.find(({ isCreator }) => isCreator)?.name;
  const langCode = languages?.find(value => value);
  const classificationNumber = classifications?.find(
    ({ number, source }) => number && (source === Classifications.DDC || source === Classifications.LC),
  )?.number;

  return (
    <div className="work-details-card">
      <div className="heading">
        <Button
          type={ButtonType.Icon}
          onClick={toggleIsOpen}
          data-testid="work-details-card-toggle"
          ariaLabel={formatMessage({ id: isOpen ? 'ld.aria.listEntry.close' : 'ld.aria.listEntry.open' })}
        >
          <CaretDown className={classNames({ ['icon-collapsed']: !isOpen }, 'toggle-icon')} />
        </Button>
        <div className="title">
          <Lightbulb />
          <span>
            <FormattedMessage id="ld.work" />
          </span>
        </div>
        <Button
          type={ButtonType.Primary}
          onClick={() => navigateToEditPage(generateEditResourceUrl(id))}
          data-testid={`edit-button__${id}`}
          className={classNames(['edit-button', 'button-nowrap', 'button-capitalize'])}
        >
          <FormattedMessage id="ld.editWork" />
        </Button>
      </div>
      <div className="details">
        <Button
          type={ButtonType.Link}
          onClick={() => handleOpenPreview?.(id)}
          className="title"
          data-testid={`preview-button__${id}`}
        >
          {title || (
            <>
              &lt;
              <FormattedMessage id="ld.noTitleInBrackets" />
              &gt;
            </>
          )}
        </Button>
        {creatorName && (
          <div className="details-item">
            <span>
              <FormattedMessage id="ld.creator" />
            </span>
            <span>{IS_DISABLED_FOR_ALPHA ? creatorName : <Link to="#">{creatorName}</Link>}</span>
          </div>
        )}
        {langCode && (
          <div className="details-item">
            <span>
              <FormattedMessage id="ld.language" />
            </span>
            <span>{langCode}</span>
          </div>
        )}
        {classificationNumber && (
          <div className="details-item">
            <span>
              <FormattedMessage id="ld.classificationNumber" />
            </span>
            <span>{classificationNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};
