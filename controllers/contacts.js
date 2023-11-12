const { Contact } = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
  const allContacts = await Contact.find();
  res.json(allContacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  // const findingContact = await Contact.findOne({ _id: contactId });
  const findingContact = await Contact.findById(contactId);

  if (!findingContact) {
    throw HttpError(404, 'Not found');
  }

  res.json(findingContact);
};

const add = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw HttpError(404, 'Not found');
  }

  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw HttpError(404, 'Not found');
  }

  res.json(updatedContact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  console.log(deletedContact);
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
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteById: ctrlWrapper(deleteById),
};
