type Nullish = null | undefined;

type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
