import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { VictoryPie } from "victory-native"
import { RFValue } from "react-native-responsive-fontsize"
import { useTheme } from "styled-components"

import { Container, Header, Title, Content, ChartContainer } from "./styles"

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
  total: number
  totalFormatted: string
  percent: string
}

export const Resume = () => {
  const [totalByCateogories, setTotalByCateogories] = useState<ICategoryData[]>(
    []
  )

  const theme = useTheme()

  const loadData = async () => {
    const collectionKey = "@gofinances:transactions"

    const response = await AsyncStorage.getItem(collectionKey)
    const responseFormatted: ITransactionData[] = response
      ? JSON.parse(response)
      : []

    const expensives = responseFormatted.filter(
      (expense) => expense.type === "negative"
    )

    const expensivesTotal = expensives.reduce(
      (acc, expense) => acc + Number(expense.amount),
      0
    )

    const totalByCategory: ICategoryData[] = []

    categories.forEach((category) => {
      let categorySum = 0

      expensives.forEach((expense) => {
        if (expense.category === category.key)
          categorySum += Number(expense.amount)
      })

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
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
        <ChartContainer>
          <VictoryPie
            data={totalByCateogories}
            x="percent"
            y="total"
            colorScale={totalByCateogories.map((category) => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: "bold",
                fill: theme.colors.shape,
              },
            }}
            labelRadius={50}
          />
        </ChartContainer>

        {totalByCateogories.map((item) => (
          <HistoryCard
            key={item.key}
            title={item.name}
            amount={item.totalFormatted}
            color={item.color}
          />
        ))}
      </Content>
    </Container>
  )
}
