import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { WEB_COMPONENT_NAME } from '@/common/constants/web-component';

export const getWrapperAsWebComponent = () => document.getElementsByTagName(WEB_COMPONENT_NAME)[0];

export const dispatchEventWrapper = (event?: string) =>
  IS_EMBEDDED_MODE && event && getWrapperAsWebComponent()?.dispatchEvent(new CustomEvent(event));
