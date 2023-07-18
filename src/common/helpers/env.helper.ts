export const getEnvVariable = (name: string) => {
  return import.meta.env?.[name];
}
