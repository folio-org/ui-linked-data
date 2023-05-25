import { ChangeEvent, FC } from "react"

type InputProps = {
  placeholder?: string,
  onChange?: (v: ChangeEvent<HTMLInputElement>) => void
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
