import { RectButtonProps } from "react-native-gesture-handler"

import { Container, Title } from "./styles"

interface IProps extends RectButtonProps {
  title: string
  onPress: () => void
}

export const Button = ({ title, onPress, ...rest }: IProps) => {
  return (
    <Container onPress={onPress} {...rest}>
      <Title>{title}</Title>
    </Container>
  )
}
