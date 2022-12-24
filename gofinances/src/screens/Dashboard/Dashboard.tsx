import { useState, useEffect, useCallback } from "react"
import { ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import { useTheme } from "styled-components"

import {
  TransactionCard,
  ITransactionCardProps,
} from "../../components/TransactionCard"
import { HighlightCard } from "../../components/HighlightCard"

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  TransactionsList,
  Title,
  LogoutButton,
  LoadContainer,
} from "./styles"

export interface IDataListProps extends ITransactionCardProps {
  id: string
}

interface IHighlightProps {
  amount: string
  lastTransaction: string
}

interface IHighlightData {
  entries: IHighlightProps
  expensive: IHighlightProps
  total: IHighlightProps
}

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<IDataListProps[]>([])
  const [highlightData, setHighlightData] = useState({} as IHighlightData)

  const theme = useTheme()

  const getLastTransactionDate = (
    collection: IDataListProps[],
    type: "positive" | "negative"
  ) => {
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === type)
          .map((transaction) => new Date(transaction.date).getTime())
      )
    )

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleDateString(
      "pt-BR",
      { month: "long" }
    )}`
  }

  async function loadTransactions() {
    const collectionKey = "@gofinances:transactions"

    const response = await AsyncStorage.getItem(collectionKey)
    const transactions: IDataListProps[] = response ? JSON.parse(response!) : []

    let entriesTotal = 0
    let expensiveTotal = 0

    const transactionFormated = transactions.map((item) => {
      if (item.type === "positive") {
        entriesTotal += Number(item.amount)
      } else {
        expensiveTotal += Number(item.amount)
      }

      const amount = Number(item.amount).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })

      const date = new Date(item.date)
      const dateFormated = Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(date)

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date: dateFormated,
      }
    })

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    )
    const lastTransactionExpensives = getLastTransactionDate(
      transactions,
      "negative"
    )
    const lastInterval = `01 a ${lastTransactionExpensives}`

    const total = entriesTotal - expensiveTotal

    setTransactions(transactionFormated)
    setHighlightData({
      expensive: {
        amount: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
      },
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: lastInterval,
      },
    })

    setIsLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    }, [])
  )

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: "https://avatars.githubusercontent.com/u/73349819?v=4",
                  }}
                />

                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Enzo</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.expensive.amount}
              lastTransaction={highlightData.expensive.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  )
}
