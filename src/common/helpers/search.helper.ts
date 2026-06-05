import { TitleTypes } from '@/common/constants/search.constants';

export const getTitle = (titles: GenericStructDTO<TitleType>[] | undefined) => {
  const mainTitle = titles?.find(({ type }) => type === TitleTypes.Main)?.value;
  const subTitle = titles?.find(({ type }) => type === TitleTypes.Sub)?.value;

  return [mainTitle, subTitle].filter(t => !!t).join(' ');
};
