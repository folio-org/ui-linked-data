type StatusType = keyof typeof import('../common/constants/status.constants').StatusType;

type StatusEntry = { type: StatusType; message: string };
