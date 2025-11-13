import { FC } from 'react';

type ValuesProps = {
  userValues: UserValues;
  uuid: string;
  shouldRenderPlaceholders: boolean;
  isDependentDropdown: boolean;
  htmlId?: string;
};

export const Values: FC<ValuesProps> = ({
  userValues,
  uuid,
  shouldRenderPlaceholders,
  isDependentDropdown,
  htmlId,
}) => {
  return userValues[uuid]
    ? userValues[uuid]?.contents?.map(({ label, meta: { uri, parentUri, basicLabel } = {} } = {}) => {
        if (!label && !basicLabel) return;

        let selectedLabel = basicLabel ?? label;

        if (
          htmlId &&
          htmlId?.indexOf('__hubs') >= 0 &&
          selectedLabel &&
          selectedLabel?.indexOf('http://bibfra.me/vocab') >= 0
        ) {
          selectedLabel = '';
        }

        return (
          selectedLabel && (
            <div key={`${selectedLabel}${uri}`}>
              {uri || parentUri ? (
                <a className="preview-value-link" target="blank" href={uri ?? parentUri}>
                  {selectedLabel}
                </a>
              ) : (
                <>{selectedLabel}</>
              )}
            </div>
          )
        );
      })
    : shouldRenderPlaceholders && !isDependentDropdown && (
        <div id={htmlId} className="value-group-wrapper">
          -
        </div>
      );
};
