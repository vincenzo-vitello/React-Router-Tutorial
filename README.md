# React Router Contact Manager

This project demonstrates the use of **React Router** to manage navigation and routing in a React application. It includes functionalities such as **nested routes**, **data loading with loaders**, **form handling with actions**, and **error handling**.

---

## Routing Configuration

The routing configuration is defined in **`src/main.jsx`** using `createBrowserRouter` from **react-router-dom**. The router is structured with main and nested routes to handle different parts of the application.

### Root Route (`/`)
The main route includes:
- `element`: The primary component rendered is **Root**.
- `loader`: The **`rootLoader`** function loads data for this route.
- `action`: The **`rootAction`** function handles form submissions.
- `errorElement`: The **ErrorPage** component is displayed in case of an error.

### Nested Routes
The following routes are nested within the root route:

#### Index Route
- **`index: true`** → Default child route rendering the **Index** component.

#### Contact Route (`/contacts/:contactId`)
- `element`: Renders the **Contact** component.
- `loader`: The **`contactLoader`** function loads contact data by `contactId`.
- `action`: The **`contactAction`** function handles form submissions for this route.

#### Edit Contact Route (`/contacts/:contactId/edit`)
- `element`: Renders the **EditContact** component for editing contact details.
- `loader`: Uses **`contactLoader`** to fetch contact data.
- `action`: The **`editAction`** function processes form submissions for editing.

#### Delete Contact Route (`/contacts/:contactId/destroy`)
- `action`: The **`destroyAction`** function handles contact deletion.
- `errorElement`: Displays an error message if deletion fails.

---

## Components Overview

### Root Component
The **Root** component serves as the main layout. It includes:
- A sidebar with a **search form**.
- A list of contacts.
- The `<Outlet />` component to render nested routes.

### Contact Component
Displays contact details, including:
- First and last name.
- Twitter handle.
- Notes.
- Edit and delete buttons.

### EditContact Component
Provides a form to edit contact details, including:
- First and last name.
- Twitter handle.
- Avatar URL.
- Notes.

### ErrorPage Component
Displayed when an error occurs during:
- Navigation.
- Data loading.
- Form submission.

---

## Data Management

Contact data is managed using **localforage**. The following functions are defined in **`src/contacts.js`** to handle CRUD operations:

- **`getContacts(query)`** → Fetches a list of contacts, optionally filtered by a query.
- **`createContact()`** → Creates a new contact with a unique ID.
- **`getContact(id)`** → Retrieves contact details by ID.
- **`updateContact(id, updates)`** → Updates contact details.
- **`deleteContact(id)`** → Deletes a contact by ID.

---

## Styling

The application is styled using **CSS** in **`src/index.css`**, including:
- Basic layout and form styling.
- Specific styles for contact details and forms.

---

## Key Decisions & Justifications

### Using React Router
- Provides a declarative way to define routes and manage navigation.
- Makes complex routing logic easier to handle.

### Nested Routes
- Organizes routes hierarchically.
- Improves code structure and maintainability.

### Data Loading with Loaders
- Ensures data is available before rendering a component.
- Enhances the user experience.

### Form Handling with Actions
- Keeps form handling logic separate from rendering.
- Allows direct interaction with backend logic.

### Error Handling
- Uses error boundaries and error elements.
- Ensures graceful handling of navigation and data errors.

---

## Conclusion

This project demonstrates how to use **React Router** effectively in a React application. It serves as a practical example of **nested routes, loaders, actions, and error handling**, making it a scalable and robust solution.
