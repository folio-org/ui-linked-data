export const checkIsDisabledButton = ({
  resourceRoutePattern,
  isInitiallyLoaded,
  isEdited,
}: {
  resourceRoutePattern?: string;
  isInitiallyLoaded: boolean;
  isEdited: boolean;
}) => resourceRoutePattern && (isInitiallyLoaded || isEdited);
