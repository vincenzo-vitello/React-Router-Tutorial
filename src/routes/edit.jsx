import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

// The `action` function is called when the form is submitted. It handles the process of updating a contact in the system.
export async function action({ request, params }) {
  // `request.formData()` retrieves the form data submitted by the user.
  const formData = await request.formData();

  // Convert the form data into an object for easier processing.
  const updates = Object.fromEntries(formData);

  // Call the `updateContact` function with the contact ID from the URL and the updated form data.
  await updateContact(params.contactId, updates);

  // After updating the contact, redirect the user back to the contact's detail page.
  return redirect(`/contacts/${params.contactId}`);
}

// The EditContact component renders the form that allows users to edit an existing contact.
export default function EditContact() {
  // `useLoaderData` is a hook provided by React Router that loads data for the current route before rendering the component.
  const { contact } = useLoaderData(); // The contact data is loaded, and this allows us to pre-populate the form.

  // `useNavigate` hook is used for programmatically navigating between pages.
  const navigate = useNavigate();

  return (
    // The `Form` component is a wrapper around the form, which handles submission via a POST request.
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First Name"
          name="first" // The `name` attribute is important for identifying the input fields on submission.
          defaultValue={contact?.first} // Pre-populate the input with the existing contact's first name, if available.
          type="text"
        />
        <input
          placeholder="Last"
          aria-label="Last Name"
          name="last"
          defaultValue={contact?.last} // Pre-populate the input with the existing contact's last name, if available.
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          placeholder="Twitter"
          aria-label="Twitter"
          name="twitter"
          defaultValue={contact?.twitter} // Pre-populate the input with the existing contact's Twitter handle, if available.
          type="text"
        />
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          name="avatar"
          defaultValue={contact?.avatar} // Pre-populate the input with the existing contact's avatar URL, if available.
          type="url"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes" // Name attribute for identifying the textarea.
          defaultValue={contact?.notes} // Pre-populate the textarea with the existing contact's notes, if available.
          rows={6} // Set the height of the textarea to 6 rows.
        />
      </label>
      <p>
        {/* The 'Save' button submits the form to update the contact. */}
        <button type="submit">Save</button>

        {/* The 'Cancel' button navigates the user back to the previous page without saving the changes. */}
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
