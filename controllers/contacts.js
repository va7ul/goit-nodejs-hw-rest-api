const contacts = require('../models/contacts');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const findingContact = await contacts.getById(contactId);

  if (!findingContact) {
    throw HttpError(404, 'Not found');
  }

  res.json(findingContact);
};

const add = async (req, res) => {
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  console.log(contactId);
  const updatedContact = await contacts.updateContact(contactId, req.body);
  console.log(updatedContact);
  if (!updatedContact) {
    throw HttpError(404, 'Not found');
  }

  res.json(updatedContact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await contacts.removeContact(contactId);
  if (!deletedContact) {
    throw HttpError(404, 'Not found');
  }

  res.status(200).json('Contact deleted');
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
