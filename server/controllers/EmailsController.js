const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const EmailController = {

    sendEmail: async (req, res) => {
        const { to, subject, text, html } = req.body;
        const mailOptions = {
            from: {
                name: 'Stargazer Support',
                address: process.env.GMAIL_USER
            },
            to, subject, text, html
        }
        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).send('Email sent successfully');
        } catch (error) {
            return res.status(500).send('Error sending email');
        }
    },

    sendForgotPasswordEmail: async (req, res) => {
        const { to, subject, text, tempPassword } = req.body;
        // TODO : Pass tempPassword through a link in email to allow user to reset password
        const mailOptions = {
            from: {
                name: 'Stargazer Support',
                address: process.env.GMAIL_USER
            },
            to, subject, text, html
        }
        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).send('Forgot password email sent successfully');
        } catch (error) {
            return res.status(500).send('Error sending forgot password email');
        }
    }

}

module.exports = EmailController;