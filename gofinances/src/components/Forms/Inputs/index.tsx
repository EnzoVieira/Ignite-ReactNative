import { TextInputProps } from "react-native"

import { Container } from "./styles"

interface IProps extends TextInputProps {}

export const Input = ({ ...rest }: IProps) => {
  return <Container {...rest} />
}
