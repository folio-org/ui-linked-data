import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import GeneralSearch from '@/assets/general-search.svg?react';
import './SearchEmptyPlaceholder.scss';
import classNames from 'classnames';

type EmptyPlaceholderProps = {
  labelId?: string;
  className?: string;
};

export const SearchEmptyPlaceholder: FC<EmptyPlaceholderProps> = ({ labelId = '', className }) => (
  <div className={classNames(['empty-placeholder', className])}>
    <GeneralSearch />
    <FormattedMessage id={labelId} />
  </div>
);
