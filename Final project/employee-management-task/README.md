# EmployeeManagementTask

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.24.

# Employee Management System

An Angular 21 standalone application for managing employee records and team tasks. It demonstrates Angular routing, lazy-loaded pages, Reactive Forms, Signals, dependency injection, and REST API integration.

## Features

- Employee directory with search and department/status filters.
- Employee details and validated employee creation.
- Task board with title search, status/priority filters, and due-date ordering.
- Task details and task creation with employee options loaded from the API.
- Dashboard totals derived from employee and task API data.
- Shared responsive navigation with an active-route indicator.
- Loading, error, empty, validation, and successful-create feedback.

## Technology and Concepts

- Angular 21 standalone components and `provideRouter`.
- Lazy route components through `loadComponent`.
- Reactive Forms with built-in validators.
- Signals for UI state and `computed()` for derived lists and dashboard totals.
- `HttpClient` services for employee and task operations.
- Local Node.js REST API with JSON-file persistence for assignment/demo use.

## Project Structure

```text
src/app/
	dashboard/       Dashboard page and API-derived summary
	employees/       Employee list, details, create form, API service, model
	tasks/           Task list, details, create form, API service, model
	data/            Dashboard data service
	app.routes.ts    Lazy route definitions
server/api.mjs     Local REST API
public/data/       Seed employee data
docs/              Task guides and demo presentation script
```

## Requirements

- Node.js 20.19 or newer.
- npm 10 or newer.

## Setup and Run

Run these commands from the `employee-management-task` directory:

```bash
npm install
npm start
```

Open the URL printed by Angular CLI (normally `http://localhost:4200/`). If that port is occupied, Angular asks to use another available port. `npm start` starts the UI and local API together; the API listens on port 3001 and `/api` requests are forwarded through `proxy.conf.json`.

To run the processes separately, use `npm run start:api` and `npm run start:ui` in separate terminals.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/employees` | Retrieve all employees. |
| GET | `/api/employees/:id` | Retrieve one employee. |
| POST | `/api/employees` | Create an employee. |
| GET | `/api/tasks` | Retrieve all tasks. |
| GET | `/api/tasks/:id` | Retrieve one task. |
| POST | `/api/tasks` | Create a task. |

The API seeds employees from `public/data/employees.json` and seeds sample tasks on first run. New records are persisted to `server/data/store.json`, which is ignored by Git. Remove that store file while the API is stopped to restore the seed data. This file-backed API is intended for local demonstration, not production or concurrent use.

## Screenshots

Screenshots still need to be captured and committed before the GitHub submission. Recommended captures: Dashboard, Employee List, Add Employee validation/success, Task Board with filters, Task Details, and Add Task with employee choices. Add the image files under `docs/screenshots/` and embed them here with Markdown image links.

## Demo and Lead Questions

See [Demo Script and Lead Q&A](docs/DEMO-SCRIPT-AND-LEAD-QA.md) for a 6–8 minute walkthrough, presenter notes, architecture explanation, and prepared answers to likely questions.

## Build and Tests

```bash
npm run build
npm test -- --watch=false
```

## Known Demo Limitations

- Login is a form demonstration only; authentication, authorization, and route guards are not implemented.
- Employee and task create/list/detail operations are implemented; update and delete are not included.
- The local API stores records in a JSON file rather than a database.
- The current automated test suite is small and should be expanded with service, form, and browser workflow tests before production use.
