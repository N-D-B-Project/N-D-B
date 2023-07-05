import { Route } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import HomeHeader from "./Components/HomeHeader"
import { HomePage } from "./Pages/Home"
import Dark from "./Styles/Themes/Dark"

function App() {
  return (
    <ThemeProvider theme={Dark}>
      <div className="App">
        <HomeHeader />
        <Route path="/" exact={true} component={HomePage} />
        <Route path="/dashboard" exact={true} />
      </div>
    </ThemeProvider>
  )
}
export default App
