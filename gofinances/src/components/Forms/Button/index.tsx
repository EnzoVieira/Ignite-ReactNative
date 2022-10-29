import { TouchableOpacityProps } from "react-native"

import { Container, Title } from "./styles"

interface IProps extends TouchableOpacityProps {
  title: string
}

export const Button = ({ title, ...rest }: IProps) => {
  return (
    <Container {...rest}>
      <Title>{title}</Title>
    </Container>
  )
}
