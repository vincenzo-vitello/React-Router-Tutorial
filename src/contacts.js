// Importing the `localforage` library, which provides a simple API for storing data locally in the browser.
// It allows you to store and retrieve data in an asynchronous and persistent way, such as using IndexedDB, WebSQL, or localStorage.
import localforage from "localforage";

// Importing `matchSorter`, a utility that helps filter and sort arrays based on a search query.
// It allows you to search through the contacts based on their 'first' or 'last' name, which is useful when filtering contacts.
import { matchSorter } from "match-sorter";

// Importing the `sort-by` library, which simplifies sorting an array of objects based on one or more properties.
// In this case, it is used to sort contacts first by 'last' name and then by 'createdAt' timestamp.
import sortBy from "sort-by";

// Function to retrieve contacts from local storage and filter them based on a query string.
export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`); // Simulate a network request for caching

  // Retrieve the contacts from local storage using localforage.
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = []; // If there are no contacts in storage, initialize an empty array.

  // If a query string is provided, filter the contacts using matchSorter to search by 'first' and 'last' name.
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }

  // Sort the contacts by 'last' name and 'createdAt' date.
  return contacts.sort(sortBy("last", "createdAt"));
}

// Function to create a new contact and store it in local storage.
export async function createContact() {
  await fakeNetwork(); // Simulate a network request for caching.

  // Generate a random unique ID for the contact.
  let id = Math.random().toString(36).substring(2, 9);
  // Create a new contact object with the generated ID and the current timestamp.
  let contact = { id, createdAt: Date.now() };

  // Retrieve the existing contacts and add the new contact to the beginning of the list.
  let contacts = await getContacts();
  contacts.unshift(contact);

  // Save the updated contacts list to local storage.
  await set(contacts);

  // Return the newly created contact.
  return contact;
}

// Function to retrieve a specific contact by ID.
export async function getContact(id) {
  await fakeNetwork(`contact:${id}`); // Simulate a network request for caching.

  // Retrieve the contacts from local storage.
  let contacts = await localforage.getItem("contacts");

  // Find the contact with the matching ID.
  let contact = contacts.find((contact) => contact.id === id);

  // If no contact is found, return null.
  return contact ?? null;
}

// Function to update a specific contact by ID with new data (updates).
export async function updateContact(id, updates) {
  await fakeNetwork(); // Simulate a network request for caching.

  // Retrieve the contacts from local storage.
  let contacts = await localforage.getItem("contacts");

  // Find the contact to be updated by ID.
  let contact = contacts.find((contact) => contact.id === id);

  // If the contact doesn't exist, throw an error.
  if (!contact) throw new Error("No contact found for", id);

  // Apply the updates to the found contact.
  Object.assign(contact, updates);

  // Save the updated contacts list back to local storage.
  await set(contacts);

  // Return the updated contact.
  return contact;
}

// Function to delete a contact by ID.
export async function deleteContact(id) {
  // Retrieve the contacts from local storage.
  let contacts = await localforage.getItem("contacts");

  // Find the index of the contact to delete.
  let index = contacts.findIndex((contact) => contact.id === id);

  // If the contact is found, remove it from the list and update local storage.
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true; // Return true to indicate successful deletion.
  }

  // If the contact is not found, return false.
  return false;
}

// Helper function to store the updated list of contacts in local storage.
function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// Simulated network cache to prevent multiple requests for the same data.
// This helps reduce unnecessary delays when the same data is accessed multiple times.
let fakeCache = {};

// Function to simulate network latency and cache the results to avoid slowing down repeated requests.
async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {}; // Reset the cache when no key is provided (for clearing the cache).
  }

  // If the data for the provided key is already cached, immediately return without any delay.
  if (fakeCache[key]) {
    return;
  }

  // Mark the key as cached to avoid future delays for the same data.
  fakeCache[key] = true;

  // Simulate a network delay with a random timeout.
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800); // Random delay between 0 and 800 milliseconds.
  });
}
