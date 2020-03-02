import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css"

import ReminderPage from "./pages/reminder/page";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/reminders" component={ReminderPage} />
          <Route render={() => (<Redirect to="/reminders" />)} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
