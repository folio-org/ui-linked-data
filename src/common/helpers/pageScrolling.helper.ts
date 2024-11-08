import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { EMBEDDED_MODULE_CONTAINER_ID } from '@common/constants/uiElements.constants';

export const getScrollableEntity = () =>
  IS_EMBEDDED_MODE ? document.getElementById(EMBEDDED_MODULE_CONTAINER_ID) : window;

export const scrollEntity = (options: ScrollToOptions) => getScrollableEntity()?.scrollTo(options);


