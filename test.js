require('dotenv').config(); // Importă modulul dotenv pentru a citi variabilele de mediu din fișierul .env
const nodemailer = require('nodemailer');

// Configurațiile transporterului Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_EMAIL, // Folosește variabila de mediu pentru adresa de e-mail Outlook
    pass: process.env.OUTLOOK_PASSWORD, // Folosește variabila de mediu pentru parolă
  },
});

// Opțiunile pentru e-mail
const mailOptions = {
  from: process.env.OUTLOOK_EMAIL, // Folosește adresa de e-mail Outlook din variabila de mediu ca expeditor
  to: 'destinatarul@gmail.com', // Adresa destinatarului
  subject: 'Subiectul e-mailului',
  text: 'Acesta este un e-mail trimis folosind Nodemailer și adresa Outlook.', // Mesajul text al e-mailului
};

// Trimite e-mailul
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Eroare la trimiterea e-mailului:', error);
  } else {
    console.log('E-mailul a fost trimis cu succes:', info.response);
  }
});
