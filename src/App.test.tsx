import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from "react-redux";

import store from "./redux/config.redux";
import App from './App';
import moment from 'moment';

const initApp = () => render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  )
);

const createNewReminder = (getByTestId: any, getAllByTestId: any) => {
  const txtTitle = getByTestId("txtTitle");
  fireEvent.change(txtTitle, { target: { value: "New Reminder" } });

  const btnCreate = getByTestId("btnCreate");
  fireEvent.click(btnCreate);

  let amCreateSucceeded = getAllByTestId("amCreateSucceeded")[0];
  expect(amCreateSucceeded).toBeInTheDocument();
}

test('Renders calendar', () => {
  const { getByText } = initApp();
  const mondayEl = getByText(/Monday/i);
  expect(mondayEl).toBeInTheDocument();
});

test('Renders Create Reminder Modal', () => {
  const { getByTestId, getByText } = initApp();
  const btnCreateRerminder = getByTestId("btnOpenCreateModal");
  fireEvent.click(btnCreateRerminder);

  expect(btnCreateRerminder).toBeInTheDocument();

  const createReminderEl = getByText(/Create Reminder/i);
  expect(createReminderEl).toBeInTheDocument();
});

test("Renders Title Length Validation Message", () => {
  const { getByTestId, getByText } = initApp();

  const btnCreateRerminder = getByTestId("btnOpenCreateModal");
  fireEvent.click(btnCreateRerminder);

  let amvTitle = getByTestId("amvTitle");
  expect(amvTitle).toBeInTheDocument();

  const txtTitle = getByTestId("txtTitle");
  fireEvent.change(txtTitle, { target: { value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" } });

  expect(amvTitle).toBeInTheDocument();

  fireEvent.change(txtTitle, { target: { value: "New Reminder" } });

  expect(amvTitle).not.toBeInTheDocument();
})

test("Renders Description Max Length Validation Message", () => {
  const { getByTestId } = initApp();

  const btnCreateRerminder = getByTestId("btnOpenCreateModal");
  fireEvent.click(btnCreateRerminder);

  const txtDescription = getByTestId("txtDescription");
  fireEvent.change(txtDescription, { target: { value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" } });

  const amvDescription = getByTestId("amvDescription");
  expect(amvDescription).toBeInTheDocument();

  fireEvent.change(txtDescription, { target: { value: "New Reminder Description" } });

  expect(amvDescription).not.toBeInTheDocument();
})

test("Renders DateTime Range Validation Message", () => {
  const { getByTestId } = initApp();

  const btnCreateRerminder = getByTestId("btnOpenCreateModal");
  fireEvent.click(btnCreateRerminder);

  const txtToTime = getByTestId("txtToTime");
  fireEvent.change(txtToTime, { target: { value: "06:00" } });

  const amvDateTime = getByTestId("amvDateTime");
  expect(amvDateTime).toBeInTheDocument();

  fireEvent.change(txtToTime, { target: { value: "13:00" } });

  expect(amvDateTime).not.toBeInTheDocument();
})


test("Renders Recurrence For A Year Validation Message", () => {
  const { getByTestId } = initApp();

  const btnCreateRerminder = getByTestId("btnOpenCreateModal");
  fireEvent.click(btnCreateRerminder);

  const txtToDate = getByTestId("txtToDate");
  fireEvent.change(txtToDate, { target: { value: moment().add(2, "months").format(process.env.REACT_APP_DATE_FORMAT) } });

  const chkRecurrenceForAYear = getByTestId("chkRecurrenceForAYear");
  fireEvent.click(chkRecurrenceForAYear);

  const amvRecurrenceForAYear = getByTestId("amvRecurrenceForAYear");
  expect(amvRecurrenceForAYear).toBeInTheDocument();

  fireEvent.change(txtToDate, { target: { value: moment().format(process.env.REACT_APP_DATE_FORMAT) } });

  expect(amvRecurrenceForAYear).not.toBeInTheDocument();
})

test("Renders Reminder Created Successful Message", () => {
  const { getByTestId, getAllByTestId } = initApp();

  const btnCreateRerminder = getByTestId("btnOpenCreateModal");
  fireEvent.click(btnCreateRerminder);

  const txtTitle = getByTestId("txtTitle");
  fireEvent.change(txtTitle, { target: { value: "New Reminder" } });

  const btnCreate = getByTestId("btnCreate");
  fireEvent.click(btnCreate);

  let amCreateSucceeded = getAllByTestId("amCreateSucceeded")[0];
  expect(amCreateSucceeded).toBeInTheDocument();
})

test("Renders DateTime Range Overlaps Validation Message", () => {
  const { getByTestId, getAllByTestId } = initApp();

  const btnCreateRerminder = getByTestId("btnOpenCreateModal");
  fireEvent.click(btnCreateRerminder);

  createNewReminder(getByTestId, getAllByTestId);

  const amvDateTimeOverlap = getByTestId("amvDateTimeOverlap");
  expect(amvDateTimeOverlap).toBeInTheDocument();

  const txtFromTime = getByTestId("txtFromTime");
  fireEvent.change(txtFromTime, { target: { value: "13:00" } });

  const txtToTime = getByTestId("txtToTime");
  fireEvent.change(txtToTime, { target: { value: "14:00" } });

  expect(amvDateTimeOverlap).not.toBeInTheDocument();
})
