import React from 'react';
import { Switch, Route } from "react-router-dom";
import { HomePage } from './Pages/Home';
import { ThemeProvider } from "styled-components";
import HomeHeader from './Components/HomeHeader';
import ThemeButton from "./Components/ThemeButton"
import Dark from './Styles/Themes/Dark';

function App() {
  return (
    <ThemeProvider theme={Dark}>
      <div className="App">
        <HomeHeader />
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/dashboard" exact={true} />
        </Switch>
      </div>
    </ThemeProvider>
  );
}
export default App;