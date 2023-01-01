import "react-native-gesture-handler"
import "intl"
import "intl/locale-data/jsonp/pt-BR"

import { StatusBar } from "react-native"
import { ThemeProvider } from "styled-components"
import * as SplashScreen from "expo-splash-screen"
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins"

import theme from "./src/global/styles/theme"

import { AppRoutes } from "./src/routes/app.routes"
import { NavigationContainer } from "@react-navigation/native"

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  })

  if (fontsLoaded) {
    SplashScreen.hideAsync()
  } else {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  )
}
