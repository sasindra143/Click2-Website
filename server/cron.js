import cron from 'node-cron';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { google } from 'googleapis';
import User from './models/User.js';
import EmailLog from './models/EmailLog.js';
import SMSLog from './models/SMSLog.js';

// ── Nodemailer fallback transport ─────────────────────
import {
  transporter,
  getTwilioClient,
  buildOAuth2Client,
  encodeEmail
} from './config/messaging.js';

// ── Send via Gmail API (OAuth) with Netlify Relay fallback ─
const sendViaOAuthOrFallback = async ({ adminUser, to, subject, html, type, userId }) => {
  // Try Gmail API first if admin has connected Gmail
  if (adminUser?.gmail_connected && adminUser?.refresh_token) {
    try {
      const auth  = buildOAuth2Client(adminUser);
      const gmail = google.gmail({ version: 'v1', auth });
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodeEmail({ from: adminUser.gmail_email, to, subject, body: html }),
        },
      });
      await EmailLog.create({ userId, to, subject, type, status: 'sent' });
      console.log(`✉️  [OAuth] Email sent to ${to}`);
      return true;
    } catch (err) {
      console.error(`⚠️  OAuth send failed for ${to}, falling back: ${err.message}`);
    }
  }

  // Fallback: Netlify Serverless Relay Function (Bypasses Render SMTP Firewall)
  if (!process.env.PLATFORM_EMAIL || !process.env.PLATFORM_EMAIL_PASSWORD) {
    console.error('❌ Missing PLATFORM_EMAIL or PASSWORD');
    await EmailLog.create({ userId, to, subject, type, status: 'failed', error: 'Missing PLATFORM_EMAIL in environment variables' });
    return false;
  }
  
  try {
    const https = await import('https');
    const data = JSON.stringify({
      secretKey: 'super_secret_netlify_bypass_key_for_click2web',
      to: to,
      subject: subject,
      html: html,
      user: process.env.PLATFORM_EMAIL,
      pass: process.env.PLATFORM_EMAIL_PASSWORD
    });

    let netlifyHost = 'click2website.netlify.app';
    if (process.env.CLIENT_URL) {
      try {
        const url = new URL(process.env.CLIENT_URL);
        netlifyHost = url.hostname;
      } catch (e) {
        console.warn('⚠️ Invalid CLIENT_URL, defaulting netlifyHost');
      }
    }
    
    const options = {
      hostname: netlifyHost,
      port: 443,
      path: '/.netlify/functions/send-email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', async () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            await EmailLog.create({ userId, to, subject, type, status: 'sent' });
            console.log(`✉️  [Netlify Relay] Email sent to ${to}`);
            resolve(true);
          } else {
            console.error(`❌ Relay Error HTTP ${res.statusCode}: ${responseBody}`);
            await EmailLog.create({ userId, to, subject, type, status: 'failed', error: `Netlify Relay Error HTTP ${res.statusCode}: ${responseBody}` });
            resolve(false);
          }
        });
      });

      req.on('error', async (err) => {
        console.error('❌ Relay Request Error:', err.message);
        await EmailLog.create({ userId, to, subject, type, status: 'failed', error: 'Netlify Relay Request Error: ' + err.message });
        resolve(false);
      });

      req.write(data);
      req.end();
    });

  } catch (err) {
    console.error('❌ Relay Setup Error:', err.message);
    await EmailLog.create({ userId, to, subject, type, status: 'failed', error: 'Netlify Setup Error: ' + err.message });
    return false;
  }
};

// ── Welcome Email Template ─────────────────────────────
const buildWelcomeEmailHtml = (user, trackingUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 48px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .body { padding: 40px 40px; }
    .greeting { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
    .text { font-size: 16px; color: #475569; line-height: 1.8; margin-bottom: 28px; }
    .feature-card { background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #7c3aed; }
    .feature-card p { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 5px; }
    .feature-card span { font-size: 13px; color: #64748b; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: #ffffff !important; text-align: center; padding: 16px 36px; border-radius: 12px; font-size: 16px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); }
    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Click2Website</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi ${user.name.split(' ')[0]}, you're in! 👋</p>
      <p class="text">
        Welcome to the Click2Website family. We're beyond excited to help you transform your vision into a stunning digital reality.
      </p>
      
      <div class="feature-card">
        <p>Your Project is in Queue ⏱️</p>
        <span>Our specialized design team is reviewing your details to create a custom roadmap for your website.</span>
      </div>

      <p class="text">
        Want to fast-track your project? Let's connect and discuss your specific requirements.
      </p>

      <div style="text-align: center;">
        <a href="https://click2website.netlify.app/dashboard" class="cta-btn">Visit Your Dashboard</a>
      </div>
      
      <p class="text" style="margin-top: 30px; font-size: 14px; color: #64748b;">
        Need immediate help? Reply to this email or call us at <a href="tel:+919959732476" style="color: #7c3aed; font-weight: 600;">+91 9959732476</a>.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Click2Website — Modern Web Business Labs<br/>
      Designed for results. Built for scale.</p>
    </div>
  </div>
  <img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
`;

// ── Follow-up Reminder Template ────────────────────────
const buildFollowupEmailHtml = (user, reminderCount, trackingUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #5b21b6 0%, #1d4ed8 100%); padding: 30px 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 20px; font-weight: 800; }
    .body { padding: 32px 28px; }
    .greeting { font-size: 20px; font-weight: 700; color: #1a1a2e; margin-bottom: 14px; }
    .message { font-size: 14px; color: #4a4a6a; line-height: 1.75; margin-bottom: 20px; }
    .cta-btn { display: block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: #ffffff !important; text-align: center; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; margin: 24px 0; }
    .footer { background: #fafafa; padding: 18px 28px; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌐 Click2Website — A Gentle Reminder</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi ${user.name.split(' ')[0]}, missed our email? 👋</p>
      <p class="message">
        We noticed you haven't opened our welcome email yet. We genuinely want to help you build something amazing online. 
        Your digital journey starts here!
      </p>
      <p class="message">
        🕐 This is reminder <strong>#${reminderCount}</strong>. Let's make your website a reality!
      </p>
      <a href="https://click2website.netlify.app/contact" class="cta-btn">💬 Chat with Us on WhatsApp</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Click2Website — Your growth partner 🚀</p>
    </div>
  </div>
  <img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
`;

// ── CRON: Every hour — Email & SMS Follow-up ───────────
cron.schedule('0 * * * *', async () => {
  console.log('⏰ [CRON] Running Automation Sequence...');

  try {
    const adminUser = await User.findOne({ role: 'admin' });
    const now = new Date();
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const API_URL = process.env.API_URL || 'https://click2website-backend.onrender.com';

    // Sequence Step 1: 4-Hour SMS Follow-up for unopened emails
    const usersForSMS = await User.find({
      role: 'user',
      welcomeEmailOpened: false,
      smsFollowupSent: false,
      automationPaused: false,
      createdAt: { $lte: fourHoursAgo },
    });

    for (const user of usersForSMS) {
      if (!user.phone) continue;
      
      const formattedPhone = user.phone.startsWith('+') ? user.phone : '+' + user.phone;
      const smsBody = `Hi ${user.name.split(' ')[0]}! 👋 We noticed you haven't checked our welcome email. Your dream website is waiting! 🚀 https://click2website.netlify.app`;
      
      const client = getTwilioClient();
      if (client) {
        try {
          const waFrom = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;
          const waTo   = `whatsapp:${formattedPhone}`;
          await client.messages.create({ body: smsBody, from: waFrom, to: waTo });
          
          user.smsFollowupSent = true;
          user.smsSent += 1;
          await user.save();
          
          await SMSLog.create({ userId: user._id, to: formattedPhone, body: smsBody, type: 'auto', sentBy: 'system', status: 'sent' });
          console.log(`📱 4h SMS Follow-up sent to ${user.phone}`);
        } catch (err) {
          console.error(`❌ SMS Error for ${user.phone}:`, err.message);
          await SMSLog.create({ userId: user._id, to: formattedPhone, body: smsBody, type: 'auto', sentBy: 'system', status: 'failed', error: err.message });
        }
      }
    }

    // Sequence Step 2: Periodic Email Reminders (Every 24 hours if still unopened)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const usersForEmailReminder = await User.find({
      role: 'user',
      welcomeEmailOpened: false,
      automationPaused: false,
      $or: [
        { lastReminderAt: null, createdAt: { $lte: twentyFourHoursAgo } },
        { lastReminderAt: { $lte: twentyFourHoursAgo } }
      ]
    });

    for (const user of usersForEmailReminder) {
      const newCount = (user.reminderCount || 0) + 1;
      const trackingUrl = `${API_URL}/api/auth/track-welcome/${user._id}`;

      const sent = await sendViaOAuthOrFallback({
        adminUser,
        to:      user.email,
        subject: `⏰ Reminder #${newCount}: Your website is waiting, ${user.name.split(' ')[0]}!`,
        html:    buildFollowupEmailHtml(user, newCount, trackingUrl),
        type:    'reminder',
        userId:  user._id,
      });

      if (sent) {
        user.lastReminderAt = now;
        user.reminderCount = newCount;
        user.emailsSent += 1;
        await user.save();
      }
    }

    console.log(`✅ [CRON] Automation sequence processed. SMS: ${usersForSMS.length}, Emails: ${usersForEmailReminder.length}`);
  } catch (err) {
    console.error('❌ [CRON] Automation Error:', err.message);
  }
});

// ── MANUAL TEST: Admin can trigger sequence for a specific user ───
export const testAutomationForUser = async (userId) => {
  console.log(`🧪 [TEST] Manually triggering automation for user: ${userId}`);
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  console.log(`📧 Sending test welcome email to ${user.email}`);
  const adminUser = await User.findOne({ role: 'admin' });
  const API_URL = process.env.API_URL || 'https://click2website-backend.onrender.com';

  // 1. Send Welcome Email
  const trackingUrl = `${API_URL}/api/auth/track-welcome/${user._id}`;
  const emailSent = await sendViaOAuthOrFallback({
    adminUser,
    to: user.email,
    subject: `🧪 [TEST] Welcome to Click2Website!`,
    html: buildWelcomeEmailHtml(user, trackingUrl),
    type: 'welcome',
    userId: user._id,
  });

  if (emailSent) {
    console.log(`✅ Test email marked as sent for ${user.email}`);
  } else {
    console.error(`❌ Failed to send test email to ${user.email}`);
  }

  // 2. Send SMS Follow-up (if phone exists)
  let smsSent = false;
  if (user.phone) {
    const formattedPhone = user.phone.startsWith('+') ? user.phone : '+' + user.phone;
    const smsBody = `Hi ${user.name.split(' ')[0]}! 👋 This is a test from Click2Website. 🚀 https://click2website.netlify.app`;
    
    const client = getTwilioClient();
    if (client) {
      try {
        console.log(`📱 Sending test SMS to ${formattedPhone}`);
        const waFrom = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;
        const waTo   = `whatsapp:${formattedPhone}`;
        await client.messages.create({ body: smsBody, from: waFrom, to: waTo });
        smsSent = true;
        await SMSLog.create({ userId: user._id, to: formattedPhone, body: smsBody, type: 'auto', sentBy: 'system', status: 'sent' });
        console.log(`✅ Test SMS sent successfully to ${formattedPhone}`);
      } catch (err) {
        console.error('❌ [TEST] SMS Error:', err.message);
        await SMSLog.create({ userId: user._id, to: formattedPhone, body: smsBody, type: 'auto', sentBy: 'system', status: 'failed', error: err.message });
      }
    } else {
      console.warn('⚠️ Twilio client not configured. SMS skipped.');
    }
  } else {
    console.warn('⚠️ User has no phone number. SMS skipped.');
  }

  return { emailSent, smsSent };
};

// ── Send Welcome Email immediately on signup ───────────
export const sendWelcomeEmail = async (user) => {
  const API_URL     = process.env.API_URL || 'https://click2website-backend.onrender.com';
  const trackingUrl = `${API_URL}/api/auth/track-welcome/${user._id}`;

  const adminUser = await User.findOne({ role: 'admin' }).catch(() => null);

  const sent = await sendViaOAuthOrFallback({
    adminUser,
    to:      user.email,
    subject: `🎉 Welcome to Click2Website! Let's build your dream website.`,
    html:    buildWelcomeEmailHtml(user, trackingUrl),
    type:    'welcome',
    userId:  user._id,
  });

  if (sent) {
    await User.findByIdAndUpdate(user._id, { $inc: { emailsSent: 1 } });
  }
};

// ── Send Welcome SMS immediately on signup ─────────────
export const sendWelcomeSMS = async (user) => {
  if (!user.phone) return;
  const client = getTwilioClient();
  
  const formattedPhone = user.phone.startsWith('+') ? user.phone : '+' + user.phone;
  const smsBody = `Hi ${user.name.split(' ')[0]}! Welcome to Click2Website 🚀. \nWe will review your details and contact you shortly to build your dream project!\n- The Web Dev Team`;

  if (!client) {
    await SMSLog.create({ userId: user._id, to: formattedPhone, body: smsBody, type: 'auto', sentBy: 'system', status: 'failed', error: 'Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in Render environment variables' });
    return;
  }

  try {
    const waFrom = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;
    const waTo   = `whatsapp:${formattedPhone}`;

    await client.messages.create({
      body: smsBody,
      from: waFrom,
      to:   waTo,
    });
    await SMSLog.create({ userId: user._id, to: formattedPhone, body: smsBody, type: 'auto', sentBy: 'system', status: 'sent' });
  } catch (err) {
    await SMSLog.create({ userId: user._id, to: formattedPhone, body: smsBody, type: 'auto', sentBy: 'system', status: 'failed', error: err.message });
  }
};

// ── Send Login Alert Email on login ───────────────────
export const sendLoginAlertEmail = async (user) => {
  const adminUser = await User.findOne({ role: 'admin' }).catch(() => null);

  await sendViaOAuthOrFallback({
    adminUser,
    to:      user.email,
    subject: `🚨 New Login to your Click2Website Account`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;max-width:500px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#1a1a2e;margin-top:0;">New Login Detected</h2>
        <p style="color:#4b5563;line-height:1.6;">
          Hi ${user.name.split(' ')[0]},<br><br>
          We noticed a new login to your Click2Website account just now.
        </p>
        <p style="color:#4b5563;line-height:1.6;">
          If this was you, you can safely ignore this email. If you did not authorize this login, please contact us immediately.
        </p>
        <p style="font-size:12px;color:#9ca3af;margin-top:30px;border-top:1px solid #e5e7eb;padding-top:16px;">
          © ${new Date().getFullYear()} Click2Website Security
        </p>
      </div>
    `,
    type:   'login-alert',
    userId: user._id,
  });
};

console.log('✅ Cron Jobs Initialized — OAuth Email & Twilio SMS automation active.');
