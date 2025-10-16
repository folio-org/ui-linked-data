import { PROPERTIES_FROM_FOLIO } from '@common/constants/bibframe.constants';

export const getPlaceholderForProperty = (uri?: string) => {
  let placeholder;

  for (const property of PROPERTIES_FROM_FOLIO) {
    if (uri === property) {
      placeholder = 'ld.placeholder.processing';
    }
  }

  return placeholder;
};
