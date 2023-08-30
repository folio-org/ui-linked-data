import { Row } from '@components/Table';

export const swapRowPositions = (header: Row, row1: string, row2: string) => {
  return {
    ...header,
    [row1]: {
      ...header[row1],
      position: header[row2].position,
    },
    [row2]: {
      ...header[row2],
      position: header[row1].position,
    },
  };
};
