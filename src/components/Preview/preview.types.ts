import { ReactNode } from 'react';

export type FieldProps = {
  uuid: string;
  base: Schema;
  paths: Array<string>;
  level: number;
  altSchema?: Schema;
  altUserValues?: UserValues;
  altSelectedEntries?: Array<string>;
  altDisplayNames?: Record<string, string>;
  hideEntities?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
};

export type ChildFieldsProps = {
  schema: Schema;
  entryChildren?: string[];
  level: number;
  paths: Array<string>;
  altSchema?: Schema;
  altUserValues?: UserValues;
  altSelectedEntries?: Array<string>;
  altDisplayNames?: Record<string, string>;
  hideEntities?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
  isGroupable?: boolean;
  isGroup?: boolean;
  renderField: (props: FieldProps) => ReactNode;
};
