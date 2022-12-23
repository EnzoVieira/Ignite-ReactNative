import { TextInputProps } from "react-native"
import { Control, Controller } from "react-hook-form"

import { Input } from "../Inputs"

import { Container } from "./style"

interface IProps extends TextInputProps {
  control: Control
  name: string
}

export const InputForm = ({ control, name, ...rest }: IProps) => {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input onChangeText={onChange} value={value} {...rest} />
        )}
        name={name}
      />
    </Container>
  )
}
