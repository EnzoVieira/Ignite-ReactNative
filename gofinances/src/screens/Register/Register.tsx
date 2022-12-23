import { useState, useEffect } from "react"
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number()
    .typeError("Informe um valor numérico")
    .positive("O valor não pode ser negativo"),
})

export const Register = () => {
  const [transactionType, setTransactionType] = useState("")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const collectionKey = "@gofinances:transactions"

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

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

  const handleRegister = async (form: IFormData) => {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação")

    if (category.key === "category")
      return Alert.alert("Selecione o tipo da categoria")

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    }

    try {
      await AsyncStorage.setItem(collectionKey, JSON.stringify(data))
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível salvar")
    }
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(collectionKey)

      console.log(JSON.parse(data!))
    }

    loadData()
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name={"name"}
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && (errors.name.message as string)}
            />
            <InputForm
              name={"amount"}
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && (errors.amount.message as string)}
            />

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
    </TouchableWithoutFeedback>
  )
}
