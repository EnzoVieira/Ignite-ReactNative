import { useState } from "react"

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles"

import { Input } from "../../components/Forms/Inputs"
import { Button } from "../../components/Forms/Button"
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton"

export const Register = () => {
  const [transactionType, setTransactionType] = useState("")

  const handleTransactionTypeSelect = (type: "up" | "down") => {
    setTransactionType(type)
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />

          <TransactionTypes>
            <TransactionTypeButton
              title="Income"
              type="up"
              onPress={() => handleTransactionTypeSelect("up")}
              isActive={transactionType === "up"}
            />
            <TransactionTypeButton
              title="Outcome"
              type="down"
              onPress={() => handleTransactionTypeSelect("down")}
              isActive={transactionType === "down"}
            />
          </TransactionTypes>
        </Fields>

        <Button title="Enviar" />
      </Form>
    </Container>
  )
}
