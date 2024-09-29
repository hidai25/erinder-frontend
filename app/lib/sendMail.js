const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(to, subject, text, html) {
    const msg = {
        to,
        from: process.env.SENDGRID_VERIFIED_SENDER,
        subject,
        text,
        html,
    };

    try {
        console.log('Attempting to send email...');
        console.log('From:', process.env.SENDGRID_VERIFIED_SENDER);
        console.log('To:', to);
        
        const response = await sgMail.send(msg);
        console.log('Email sent successfully', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('Error body:', error.response.body);
        }
        throw error;
    }
}

module.exports = sendMail;