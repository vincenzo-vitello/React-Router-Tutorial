import {
  NavLink,
  Outlet,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useEffect } from "react";

import { getContacts, createContact } from "../contacts";

// Loader function that fetches contacts based on the search query
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q"); // Extract search query from URL
  const contacts = await getContacts(q); // Fetch contacts matching the query
  return { contacts, q }; // Return contacts and query string
}

// Action function that creates a new contact and redirects to its edit page
export async function action() {
  const contacts = await createContact(); // Create a new contact
  return redirect(`/contacts/${contacts.id}/edit`); // Redirect to the edit page of the new contact
}

export default function Root() {
  const { contacts, q } = useLoaderData(); // Get loaded contacts and query string
  const navigation = useNavigation(); // Get navigation state
  const submit = useSubmit(); // Function to programmatically submit forms

  // Check if a search is in progress
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // Keep the search input value updated when "q" changes
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          {/* Search form */}
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""} // Add "loading" class if searching
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(e) => {
                const isFirstSearch = q == null;
                submit(e.currentTarget.form, {
                  replace: !isFirstSearch, // Avoid adding search history entries
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />{" "}
            {/* Loading spinner */}
            <div className="sr-only" aria-live="polite"></div>{" "}
            {/* Screen reader feedback */}
          </Form>

          {/* Button to create a new contact */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>

        {/* Navigation menu with contact list */}
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`} // Link to contact details
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {/* Display contact name or placeholder if missing */}
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}{" "}
                    {/* Star for favorite contacts */}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>

      {/* Main content area that displays selected contact details */}
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet /> {/* Renders the active child route */}
      </div>
    </>
  );
}
