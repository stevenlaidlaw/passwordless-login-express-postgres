const { SMTPClient } = require("emailjs");

const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_FROM } = process.env;

const client = new SMTPClient({
  user: EMAIL_USER,
  password: EMAIL_PASSWORD,
  host: EMAIL_HOST,
  ssl: true,
});

module.exports = {
  sendEmail: async (to, subject, data) => {
    await client.sendAsync({
      from: EMAIL_FROM,
      to,
      subject,
      // text,
      attachment: [{ data, alternative: true }],
    });
  },
};
