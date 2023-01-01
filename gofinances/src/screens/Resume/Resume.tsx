import { Container, Header, Title } from "./styles"

import { HistoryCard } from "../../components/HistoryCard"

export const Resume = () => {
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <HistoryCard title="Compras" amount="R$ 150,00" color="red" />
    </Container>
  )
}
