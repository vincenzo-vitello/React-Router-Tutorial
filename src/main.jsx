import "./index.css";

// importing libs
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

// importing components
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

// creating a router
const router = createBrowserRouter([
  {
    path: "/", // Root path of the application
    element: <Root />, // Main layout component
    loader: rootLoader, // Loads necessary data before rendering Root
    action: rootAction, // Handles form submissions at the root level
    errorElement: <ErrorPage />, // Displays in case of errors
    children: [
      {
        errorElement: <ErrorPage />, // Error boundary for nested routes
        children: [
          {
            index: true, // Default route when visiting "/"
            element: <Index />, // Renders the Index component
          },
          {
            path: "/contacts/:contactId", // Dynamic route for viewing a contact
            element: <Contact />, // Renders the Contact component
            loader: contactLoader, // Loads data for the specific contact
            action: contactAction, // Handles form submissions for the contact
          },
          {
            path: "contacts/:contactId/edit", // Route for editing a contact
            element: <EditContact />, // Renders the EditContact component
            loader: contactLoader, // Loads contact data for editing
            action: editAction, // Handles form submissions for editing
          },
          {
            path: "contacts/:contactId/destroy", // Route for deleting a contact
            action: destroyAction, // Handles contact deletion
            errorElement: <div>Oops! There was an error.</div>, // Fallback error UI for deletion errors
          },
        ],
      },
    ],
  },
]);

// Rendering the application inside the root element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />{" "}
    {/* Provides routing functionalities to the app */}
  </StrictMode>
);
