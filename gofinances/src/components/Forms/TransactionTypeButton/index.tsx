import { RectButtonProps } from "react-native-gesture-handler"

import { Container, Icon, Title } from "./styles"

interface IProps extends RectButtonProps {
  title: string
  type: "up" | "down"
  isActive: boolean
}

const icons = {
  up: "arrow-up-circle",
  down: "arrow-down-circle",
}

export const TransactionTypeButton = ({
  title,
  type,
  isActive,
  ...rest
}: IProps) => {
  return (
    <Container isActive={isActive} type={type} {...rest}>
      <Icon name={icons[type]} type={type} />

      <Title>{title}</Title>
    </Container>
  )
}
