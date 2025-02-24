type StatusType = keyof typeof import('@common/constants/status.constants').StatusType;

type StatusEntry = {
  id?: string;
  type: StatusType;
  message: string | ReactElement<any>;
};
