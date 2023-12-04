import { WEB_COMPONENT_NAME } from '@common/constants/web-component';

export const getWrapperAsWebComponent = () => document.getElementsByTagName(WEB_COMPONENT_NAME)[0];
