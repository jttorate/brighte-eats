# Brighte Eats (Assessment Project)

##### Disclaimer: This project was completed as part of a technical assessment/exam for Brighte. All code and design decisions were made solely for the purposes of this assessment.

## Overview

Brighte wants to collect expressions of interest for a new product called Brighte Eats and view those leads in a dashboard. Essentially, this is about gauging customer interest and tracking potential leads.

## Functional Requirements

These are the key features the system should provide:

- Expression of Interest Form: A form or interface for users to submit their interest in Brighte Eats. Users should indicate which services they are interested in:

```
delivery | pick_up | payment
```

- Dashboard for Leads: A dashboard where Brighte staff can view all submitted expressions of interest. Dashboard features could include:

```
List of all users who submitted interest.
Which services each user is interested in (delivery, pick_up, payment).
```

## Install Prerequisites

Make sure you have these installed:

- Node.js (v18+ recommended) → https://nodejs.org/
- PostgreSQL → https://www.postgresql.org/download/
- Git (for GitHub) → https://git-scm.com/install/

## Project Structure

#### Backend

```
server/
├── contracts/          # Postman collections
├── prisma/
├── src/
│ ├── index.ts          # App entry point, express app setup
│ ├── resolvers.ts
│ ├── schema.ts
├── tests/
│ └── register.test     # Jest unit test
├── jest.config
├── package.json
└── tsconfig.json
```

#### Frontend

```
client/
├── src/
│ ├─ components/        # Register & dashboard components
│ ├─ App.tsx            # Main React app
│ └─ main.tsx           # React entry point
├─ package.json
└─ vite.config.ts
```

## How to Run the Project

This project has three main components:

1. Run Backend API (Node.js + TypeScript)

```bash
cd server                 # go to server folder
npm install               # install dependencies
npm run prisma:migrate    # setting up the database
npm run dev               # run server in development mode (with ts-node-dev)
```

2. Run Backend Unit Tests (Jest)

```bash
cd server                 # go to server folder
npm run test              # run all unit tests
```

3. Frontend App (React + TypeScript)

```bash
cd client                 # go to client folder
npm install               # install dependencies
npm run dev               # run React development server
```

## Key Design Decisions & Tradeoffs

## Live Demo

#### Visit the live demo here: https://brighte-eats-demo.jttorate.com

## User Guide

1. Register (New Lead)
   - Fill out the form with Name, Email, Mobile, Postcode, and select one or more Services (Delivery, Pick-up, Payment).
   - Click Register to submit:
     - Success alert appears. Form resets. Dashboard refreshes automatically.
   - Note: When viewing a lead, form fields are disabled and Submit is hidden.
2. Dashboard Chart & Table (Get All Leads)
   - Chart View (default when raw table is off):
     - Shows total leads per service as a bar chart.
     - Raw Table View (toggle via Show Raw Data):
       - Filter by Services: Show leads matching selected services.
3. View Lead (Get Single Lead)
   - Click View on any lead in the table:
     - Form on the left panel populates with the lead’s information.
     - Click Close View to exit and return to the blank registration form.
   - Only the lead ID is sent to fetch details from the backend.
