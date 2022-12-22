import { Container, Category, Icon } from "./styles"

interface IProps {
  title: string
}

export const CategorySelect = ({ title }: IProps) => {
  return (
    <Container>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  )
}
