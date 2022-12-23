import { useState } from "react"
import { Modal } from "react-native"
import { useForm } from "react-hook-form"

import { CategorySelect } from "../CategorySelect"

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles"

import { InputForm } from "../../components/Forms/InputForm"
import { Button } from "../../components/Forms/Button"
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton"
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton"

interface IFormData {
  name: string
  amount: string
}

export const Register = () => {
  const [transactionType, setTransactionType] = useState("")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const { control, handleSubmit } = useForm()

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

  const handleRegister = (form: IFormData) => {
    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    }

    console.log(data)
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm name={"name"} control={control} placeholder="Nome" />
          <InputForm name={"amount"} control={control} placeholder="Preço" />

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

        <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
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
