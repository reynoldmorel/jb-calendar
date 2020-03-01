import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ReminderPage from "./pages/reminder/page";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ReminderPage} />
          <Route exact path="/reminders" component={ReminderPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
