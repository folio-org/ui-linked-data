import { ReactNode } from 'react';
import classNames from 'classnames';

export const getPreviewWrapper =
  ({
    isBlock,
    wrapEntities,
    isBlockContents,
  }: {
    isBlock: boolean;
    isBlockContents: boolean;
    wrapEntities?: boolean;
  }) =>
  ({ children }: { children: ReactNode }) => (
    <div
      className={classNames({
        'preview-block': isBlock,
        'preview-entity': wrapEntities,
        'preview-block-contents': isBlockContents,
      })}
      data-testid="preview-fields"
    >
      {children}
    </div>
  );

export const getValueGroupWrapper =
  ({ schemaEntry }: { schemaEntry?: SchemaEntry }) =>
  ({ children }: { children: ReactNode }) =>
    children ? (
      <div id={schemaEntry?.htmlId} className="value-group-wrapper">
        {children}
      </div>
    ) : null;
