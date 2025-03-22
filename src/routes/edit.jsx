import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First Name"
          name="first"
          defaultValue={contact?.first}
          type="text"
        />
        <input
          placeholder="Last"
          aria-label="Last Name"
          name="last"
          defaultValue={contact?.last}
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          placeholder="Twitter"
          aria-label="Twitter"
          name="twitter"
          defaultValue={contact?.twitter}
          type="text"
        />
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          name="avatar"
          defaultValue={contact?.avatar}
          type="url"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact?.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
