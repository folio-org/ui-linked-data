import { FC } from "react"

type InputProps = {
  placeholder: string,
}

export const Input: FC<InputProps> = ({
  placeholder,
}) => {
  return (
    <input
      placeholder={placeholder}
    />
  )  
}
