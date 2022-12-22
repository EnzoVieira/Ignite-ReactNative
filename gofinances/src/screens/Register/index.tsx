import { useState } from "react"
import { Modal } from "react-native"

import { CategorySelect } from "../CategorySelect"

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
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton"

export const Register = () => {
  const [transactionType, setTransactionType] = useState("")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  })

  const handleTransactionTypeSelect = (type: "up" | "down") => {
    setTransactionType(type)
  }

  const handleCloseSelectCategoryModal = () => {
    setIsCategoryModalOpen(false)
  }

  const handleOpenSelectCategoryModal = () => {
    setIsCategoryModalOpen(true)
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

          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategoryModal}
          />
        </Fields>

        <Button title="Enviar" />
      </Form>

      <Modal visible={isCategoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  )
}
