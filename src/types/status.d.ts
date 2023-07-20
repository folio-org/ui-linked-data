type StatusType = keyof typeof import('@constants/status.constants').StatusType;

type StatusEntry = {
  id?: string;
  type: StatusType;
  message: string;
};
