import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import GeneralSearch from '@src/assets/general-search.svg?react';
import './SearchEmptyPlaceholder.scss';
import classNames from 'classnames';

type EmptyPlaceholderProps = {
  labelId?: string;
  className?: string;
};

export const EmptyPlaceholder: FC<EmptyPlaceholderProps> = ({ labelId = '', className }) => (
  <div className={classNames(['empty-placeholder', className])}>
    <GeneralSearch />
    <FormattedMessage id={labelId} />
  </div>
);
