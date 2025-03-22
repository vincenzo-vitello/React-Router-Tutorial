import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

// The `loader` function is executed before the component is rendered
// and is responsible for loading the specific contact data, given a `contactId`
// extracted from the URL parameters. If the contact doesn't exist, it returns a
// 404 response with an error message.
export async function loader({ params }) {
  const contact = await getContact(params.contactId); // Fetch the contact using the ID
  if (!contact) {
    // If the contact doesn't exist, return a 404 error
    throw new Response("", {
      status: 404,
      statusText: "Contact not found",
    });
  }
  return { contact }; // Return the found contact to be used in the component
}

// The `action` function is executed when a form is submitted
// (for example, when the user adds or removes a contact from favorites).
// Here, the value of the `favorite` field is retrieved, and the contact is updated
// using the `updateContact` function, passing the contact ID and the new favorite status.
export async function action({ request, params }) {
  const formData = await request.formData(); // Get the form data sent by the form
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true", // Update the 'favorite' state of the contact
  });
}

// The main component that represents a contact
// It displays information such as the name, image, Twitter link, notes, and provides options to edit or delete the contact.
export default function Contact() {
  const { contact } = useLoaderData(); // Get the contact data loaded by the loader
  return (
    <div id="contact">
      <div>
        <img
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200` // Use the contact's avatar if available, otherwise use a generated image.
          }
          key={contact.avatar}
          alt="" // The image doesn't require an alt text in this case
        />
      </div>

      <div>
        <h1>
          {/* Display the contact's name, if present, otherwise show "Unknown" */}
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            "Unknown"
          )}{" "}
          <Favorite contact={contact} />{" "}
          {/* Render the Favorite component to handle favorite toggling */}
        </h1>

        {/* Display the Twitter handle if it exists */}
        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              @{contact.twitter}
            </a>
          </p>
        )}

        {/* Display the contact's notes if they exist */}
        {contact.notes && <p>{contact.notes}</p>}

        <div>
          {/* Edit form that allows for modifying the contact's information */}
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          {/* Delete form that allows for deleting the contact, with a confirmation prompt */}
          <Form
            action="destroy"
            method="post"
            onSubmit={(e) => {
              if (!confirm("Are you sure?")) {
                e.preventDefault(); // Prevent the form submission if the user cancels
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// The Favorite component handles the toggling of a contact's favorite status
// It uses a fetcher to submit the form and update the contact's favorite status in real time.
function Favorite({ contact }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite; // Get the current favorite status from the form or the contact's data

  return (
    <fetcher.Form method="post">
      {/* Button to toggle the favorite status, shows a filled star if it's a favorite */}
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}{" "}
        {/* Display a filled or empty star depending on the favorite status */}
      </button>
    </fetcher.Form>
  );
}
