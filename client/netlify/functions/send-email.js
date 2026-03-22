const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    // Hardcoded verification key to prevent unauthorized usage of this open endpoint
    if (data.secretKey !== 'super_secret_netlify_bypass_key_for_click2web') {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const { to, subject, html, user, pass } = data;

    if (!to || !subject || !html || !user || !pass) {
      return { statusCode: 400, body: 'Missing email parameters' };
    }

    // Set up Nodemailer to use Gmail App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Click2Website Team" <${user}>`,
      to,
      subject,
      html,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email passed successfully through Netlify edge relay!' }),
    };
  } catch (error) {
    console.error('Netlify SMTP Relay Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
