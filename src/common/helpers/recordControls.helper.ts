export const checkButtonDisabledState = ({
  resourceRoutePattern,
  isInitiallyLoaded,
  isEdited,
}: {
  resourceRoutePattern?: string;
  isInitiallyLoaded: boolean;
  isEdited: boolean;
}) => resourceRoutePattern && (isInitiallyLoaded || isEdited);
