import { FC } from "react"

type InputProps = {
  placeholder?: string,
  onChange?: VoidFunction
}

export const Input: FC<InputProps> = ({
  placeholder,
  onChange
}) => {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
    />
  )  
}
