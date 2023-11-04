// const { nanoid } = require('nanoid');
const { nanoid } = require('nanoid');
const fs = require('node:fs/promises');
const path = require('node:path');

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  const allContacts = await fs.readFile(contactsPath);

  return JSON.parse(allContacts);
};

const getById = async (contactId) => {
  const allContacts = await listContacts();
  const findingContact = allContacts.find((item) => item.id === contactId);

  return findingContact || null;
};

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };

  allContacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((item) => item.id === contactId);
  console.log(index);
  if (index === -1) {
    return null;
  }

  allContacts[index] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return allContacts[index];
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return result;
};

module.exports = {
  listContacts,
  getById,
  addContact,
  updateContact,
  removeContact,
};
