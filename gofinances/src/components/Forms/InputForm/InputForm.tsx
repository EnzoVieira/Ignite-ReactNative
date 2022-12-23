import { TextInputProps } from "react-native"
import { Control, Controller } from "react-hook-form"

import { Input } from "../Inputs"

import { Container, Error } from "./style"

interface IProps extends TextInputProps {
  control: Control
  name: string
  error?: string
}

export const InputForm = ({ control, name, error, ...rest }: IProps) => {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input onChangeText={onChange} value={value} {...rest} />
        )}
        name={name}
      />

      {error && <Error>{error}</Error>}
    </Container>
  )
}
