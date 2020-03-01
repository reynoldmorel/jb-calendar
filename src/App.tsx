import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import ReminderPage from "./pages/reminder/page";

const App = () => {
  return (
    <div className="App">
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
