import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { Container, Header, Title, Content } from "./styles"

import { HistoryCard } from "../../components/HistoryCard"

import { categories } from "../../utils/categories"

interface ITransactionData {
  type: "negative" | "positive"
  name: string
  amount: string
  category: string
  data: string
}

interface ICategoryData {
  key: string
  name: string
  color: string
  total: string
}

export const Resume = () => {
  const [totalByCateogories, setTotalByCateogories] = useState<ICategoryData[]>(
    []
  )

  const loadData = async () => {
    const collectionKey = "@gofinances:transactions"

    const response = await AsyncStorage.getItem(collectionKey)
    const responseFormatted: ITransactionData[] = response
      ? JSON.parse(response)
      : []

    const expensives = responseFormatted.filter(
      (expense) => expense.type === "negative"
    )

    const totalByCategory: ICategoryData[] = []

    categories.forEach((category) => {
      let categorySum = 0

      expensives.forEach((expense) => {
        if (expense.category === category.key)
          categorySum += Number(expense.amount)
      })

      if (categorySum > 0) {
        const total = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total,
        })
      }
    })

    setTotalByCateogories(totalByCategory)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        {totalByCateogories.map((item) => (
          <HistoryCard
            key={item.key}
            title={item.name}
            amount={item.total}
            color={item.color}
          />
        ))}
      </Content>
    </Container>
  )
}
