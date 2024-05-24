const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3002;

app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const { clientName, clientEmail, invoiceNumber, date, services, totalCostBeforeTax, taxAmount, totalCostAfterTax } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'your_email_service_provider', // e.g., 'gmail'
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_email_password'
    }
  });

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: clientEmail,
    subject: `Invoice #${invoiceNumber}`,
    text: `
      Dear ${clientName},

      Please find below the details of your invoice:

      Invoice Number: ${invoiceNumber}
      Date: ${date}

      Services: ${services.join(', ')}

      Total Cost Before Tax: Ksh ${totalCostBeforeTax}
      Tax Amount: Ksh ${taxAmount}
      Total Cost After Tax: Ksh ${totalCostAfterTax}

      Thank you for choosing our services.

      Best regards,
      Your Company
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
