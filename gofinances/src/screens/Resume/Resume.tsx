import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { VictoryPie } from "victory-native"
import { RFValue } from "react-native-responsive-fontsize"
import { useTheme } from "styled-components"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { addMonths, subMonths, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useFocusEffect } from "@react-navigation/native"

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from "./styles"

import { HistoryCard } from "../../components/HistoryCard"

import { categories } from "../../utils/categories"

interface ITransactionData {
  type: "negative" | "positive"
  name: string
  amount: string
  category: string
  date: string
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
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalByCateogories, setTotalByCateogories] = useState<ICategoryData[]>(
    []
  )

  const theme = useTheme()

  const handleDateChange = (action: "next" | "prev") => {
    if (action === "next") {
      const newDate = addMonths(selectedDate, 1)
      setSelectedDate(newDate)
    } else {
      const newDate = subMonths(selectedDate, 1)
      setSelectedDate(newDate)
    }
  }

  const loadData = async () => {
    setIsLoading(true)

    const collectionKey = "@gofinances:transactions"

    const response = await AsyncStorage.getItem(collectionKey)
    const responseFormatted: ITransactionData[] = response
      ? JSON.parse(response)
      : []

    const expensives = responseFormatted.filter(
      (expense) =>
        expense.type === "negative" &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
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
    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [selectedDate])
  )

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddinBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange("prev")}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange("next")}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

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
      )}
    </Container>
  )
}
