import nodemailer from 'nodemailer';

/**
 * Netlify Function: send-email
 * Acts as a secure relay for sending emails via SMTP, 
 * bypassing firewalls that block standard SMTP ports (like on Render).
 */
export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { secretKey, to, subject, html, user, pass } = JSON.parse(event.body);

    // Basic Security Check
    const VALID_SECRET = 'super_secret_netlify_bypass_key_for_click2web';
    if (secretKey !== VALID_SECRET) {
      console.error('🚫 Unauthorized relay attempt');
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    if (!to || !subject || !html || !user || !pass) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required parameters' }),
      };
    }

    // Configure Transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    // Send Email
    const info = await transporter.sendMail({
      from: `"Click2Website" <${user}>`,
      to,
      subject,
      html,
    });

    console.log('✉️ Email relayed successfully:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', messageId: info.messageId }),
    };
  } catch (err) {
    console.error('❌ Relay Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to relay email', error: err.message }),
    };
  }
};
