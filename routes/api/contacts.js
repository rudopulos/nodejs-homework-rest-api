const express = require('express');
const Joi = require('joi');
const fs = require('fs').promises;

const router = express.Router();


const validateContact = (contact) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  return schema.validate(contact);
};


const contactsFilePath = './contacts.json';


const readContactsFromFile = async () => {
  try {
    const data = await fs.readFile(contactsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
   
    return [];
  }
};


const writeContactsToFile = async (contacts) => {
  await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf-8');
};


router.get('/', async (req, res, next) => {
  try {
    const contacts = await readContactsFromFile();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});


router.get('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contacts = await readContactsFromFile();
    
    const foundContact = contacts.find(contact => contact.id === contactId);

    if (foundContact) {
      res.json(foundContact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const newContact = req.body;
    const contacts = await readContactsFromFile();

  
    const { error } = validateContact(newContact);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

  
    const contactWithId = { ...newContact, id: Date.now().toString() };

    contacts.push(contactWithId);
    await writeContactsToFile(contacts);

    res.status(201).json(contactWithId);
  } catch (error) {
    next(error);
  }
});


router.delete('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contacts = await readContactsFromFile();
    
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);

    if (contacts.length !== updatedContacts.length) {
      await writeContactsToFile(updatedContacts);
      res.json({ message: 'Contact deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});


router.put('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const updatedContact = req.body;
    const contacts = await readContactsFromFile();


    const { error } = validateContact(updatedContact);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const index = contacts.findIndex(contact => contact.id === contactId);

    if (index !== -1) {
      const updatedContactWithId = { ...updatedContact, id: contactId };
      contacts[index] = updatedContactWithId;

      await writeContactsToFile(contacts);

      res.json(updatedContactWithId);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
