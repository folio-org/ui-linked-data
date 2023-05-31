import { FC, SyntheticEvent } from "react"

type InputProps = {
  placeholder?: string,
  value: string,
  onChange?: (arg: SyntheticEvent) => void,
}

export const Input: FC<InputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  )  
}
