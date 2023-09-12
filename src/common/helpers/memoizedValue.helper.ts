export const useMemoizedValue = () => {
  let value = false;

  const getValue = () => value;
  const setValue = (newValue: boolean) => (value = newValue);

  return { getValue, setValue };
};
