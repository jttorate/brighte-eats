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

## Project Structure

### Backend

```
server/
├── contracts/                      # Postman collections
├── prisma/
├── src/
│ ├── index.ts                      # App entry point, express app setup
│ ├── resolvers.ts
│ ├── schema.ts
├── tests/
│ └── register.test                 # Jest unit test
├── jest.config
├── package.json
└── tsconfig.json
```

## How to Run the Project

This project has three main components:

1. Run Backend API (Node.js + TypeScript)

```bash
cd server           # go to server folder
npm install         # install dependencies
npm run dev         # run server in development mode (with ts-node-dev)
```

2. Run Backend Unit Tests (Jest)

```bash
cd server           # go to server folder
npm run test        # run all unit tests
```

3. Frontend App (React + TypeScript)

```bash
cd client           # go to client folder
npm install         # install dependencies
npm run dev         # run React development server
```

## Key Design Decisions & Tradeoffs

## Live Demo

#### Visit the live demo here: https://brighte-eats-demo.jttorate.com
