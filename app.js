const express = require('express');
const Joi = require('joi');
const router = express.Router();
const Contact = require('./routes/api/contacts');


const validateContact = (contact) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });
  return schema.validate(contact);
};


router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (!favorite) {
      return res.status(400).json({ message: 'missing field favorite' });
    }

    const existingContact = await Contact.findById(contactId);
    if (!existingContact) {
      return res.status(404).json({ message: 'Not found' });
    }


    existingContact.favorite = favorite;
    await existingContact.save();


    return res.status(200).json(existingContact);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
