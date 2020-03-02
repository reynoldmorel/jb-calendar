# jb-calendar
This is an application that tests a calendar component using a Reminder CRUD.

## Features
* Reminders can have: **Title, Description, City, From Date and To Date, Recurrence for the rest of the year and color**.
* Reminders can be: **Created, Deleted one by one, Deleted by Day and Updated**
* When Reminders have a city, it looks for the weather of that city if exists.
* Calendar component displays items sorted by time.
* Calendar component is responsive.
* Calendar highlights weekends.
* Calendar fires an event when date is selected sending all items for that date.
* Calendar fires an event when month or year changes.

## Setup
* Open the CMD Line and go to folder where the project could be cloned.
* Clone the project with `git clone git@github.com:reynoldmorel/jb-calendar.git` or `git clone https://github.com/reynoldmorel/jb-calendar.git`.
* Execute `cd jb-calendar`.
* Execute `npm install`.
* Run tests with `npm run test`.
* Run the project with `npm run start`. After this, then go to your browser: http://localhost:3000/reminders.