import { FC } from 'react';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { Button, ButtonType } from '@/components/Button';

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  isDragActive: boolean;
}

export const Drop: FC<Props> = ({ getRootProps, getInputProps, isDragActive }) => {
  return (
    <div
      className={classNames(['dropzone', { dragging: isDragActive }, { waiting: !isDragActive }])}
      {...getRootProps()}
      data-testid="dropzone"
    >
      <input {...getInputProps()} data-testid="dropzone-file-input" />
      {isDragActive ? (
        <div>
          <FormattedMessage id="ld.importFileDrop" />
        </div>
      ) : (
        <div>
          <FormattedMessage id="ld.importFileInstructions" />
          <div className="choose">
            <Button type={ButtonType.Highlighted} onClick={() => {}}>
              <FormattedMessage id="ld.importFileChoose" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
