import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import ReminderPage from "./pages/reminder/page";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/reminders" />)} />
          <Route exact path="/reminders" component={ReminderPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
