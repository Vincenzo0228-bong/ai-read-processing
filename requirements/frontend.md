# Frontend Requirements

The frontend should be minimal, functional, and clear. The goal is to demonstrate good React structure, state management, and API integration. Designs do not need to be pixel-perfect, but the overall application should be clean, modern, usable and nearly production-ready.

## Core Functionality

Build a simple React application with the following screens and features:

### 1. Authentication

- A signup and login screen

- Users must be able to:
  
  - Create an account
  
  - Log in

- After successful login, users should be redirected to their dashboard

- Authentication state should persist across page reloads

Note: Refresh tokens and short-lived tokens are not a requirement for this assessment, but can be implemented if you choose.

### 2. Dashboard

The main dashboard should include:

#### 1. **Lead Submission**

- A popup form (within a modal) to submit a new “lead message”

- Required fields:

  - Name (plain text)

  - Contact channel (enum: `whatsapp | webchat | email | other`)

  - Message (plain text)

- Submitting the form should:

  - Send the data to the backend

  - Immediately reflect the new lead in the Lead List with an initial status (e.g. `pending` or `processing`)

  - Not block the UI while backend processing occurs

#### 2. **Lead List**

- A list of all previously submitted lead messages for the logged-in user

- Each list item should display:

  - Original message

  - Overall workflow status:

    - `pending`

    - `processing`

    - `completed`

    - `failed`

#### 3. **Workflow Detail View**

- Each lead should have a detail view or expandable section showing:

  - All workflow steps (e.g. intent classification, extraction, routing)

  - The status of each step

      - `not_started`

      - `processing`

      - `completed`

      - `failed`

      - `skipped`

  - Final output of the workflow when completed

- If the workflow fails, show a clear error state or failure reason (if available)

---

## Expectations

- Clean and logical file structure

- Clear separation between:

  - UI components

  - API/data-access logic

  - State management

- Basic loading and error states for:

  - Authentication

  - Lead submission

  - Workflow status updates

     - Status changes should be reflected promptly in the UI, with a toast notification and updated workflow and step details


- API interactions should be abstracted (no direct fetch logic buried in UI components)

- The frontend must not rely on long-running or blocking backend calls

## Out of Scope

The following items are out of scope for this assessment, but may be included at your discretion.

- Advanced styling or animations

- Role-based permissions beyond basic user ownership

- Complex form validation
