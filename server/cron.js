import cron from 'node-cron';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import User from './models/User.js';

// ── Email Transporter ──────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.PLATFORM_EMAIL,
    pass: process.env.PLATFORM_EMAIL_PASSWORD,
  },
});

// ── Twilio Helper ──────────────────────────────────
const getTwilioClient = () => {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || sid.startsWith('your_')) return null;
  return twilio(sid, token);
};

// ── Professional Welcome Email Template ───────────
const buildWelcomeEmailHtml = (user, trackingUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 8px; }
    .logo { font-size: 36px; margin-bottom: 12px; }
    .body { padding: 36px 30px; }
    .greeting { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; }
    .message { font-size: 15px; color: #4a4a6a; line-height: 1.75; margin-bottom: 24px; }
    .highlight-box { background: linear-gradient(135deg, #f0e8ff, #e8f0ff); border-left: 4px solid #7c3aed; border-radius: 8px; padding: 20px 24px; margin-bottom: 28px; }
    .highlight-box h3 { color: #5b21b6; font-size: 15px; margin-bottom: 14px; font-weight: 700; }
    .feature-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .feature-icon { font-size: 22px; flex-shrink: 0; }
    .feature-text h4 { font-size: 14px; color: #1a1a2e; font-weight: 700; margin-bottom: 2px; }
    .feature-text p { font-size: 13px; color: #6b7280; line-height: 1.5; }
    .cta-btn { display: block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: #ffffff !important; text-align: center; padding: 16px 32px; border-radius: 10px; font-size: 16px; font-weight: 700; text-decoration: none; margin: 28px 0; }
    .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
    .credentials-box { background: #f8faff; border: 1px solid #e0e7ff; border-radius: 10px; padding: 18px 24px; margin-bottom: 24px; }
    .credentials-box h3 { color: #374151; font-size: 14px; font-weight: 700; margin-bottom: 12px; }
    .cred-row { display: flex; gap: 8px; margin-bottom: 8px; }
    .cred-label { font-size: 13px; color: #6b7280; width: 80px; flex-shrink: 0; }
    .cred-value { font-size: 13px; color: #1f2937; font-weight: 600; word-break: break-all; }
    .footer { background: #fafafa; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; line-height: 1.6; }
    .social-links { margin: 12px 0; }
    .social-links a { color: #7c3aed; text-decoration: none; font-size: 18px; margin: 0 6px; }
    @media (max-width: 600px) {
      .body { padding: 24px 16px; }
      .header { padding: 28px 16px; }
      .feature-row { flex-direction: column; gap: 6px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌐</div>
      <h1>Click2Website</h1>
      <p>Premium Web Development & Automation Services</p>
    </div>
    <div class="body">
      <p class="greeting">Hii ${user.name.split(' ')[0]}, Welcome to Click2Website! 🎉</p>
      <p class="message">
        You've successfully logged in and joined our exclusive community of businesses thriving online.
        Your journey to a stunning, high-performance website starts right now.
      </p>

      <div class="highlight-box">
        <h3>✨ What's included in your project:</h3>
        <div class="feature-row">
          <div class="feature-icon">🔍</div>
          <div class="feature-text">
            <h4>SEO-Optimized Architecture</h4>
            <p>Your website will be structured from day one for maximum search engine visibility and organic growth.</p>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-icon">📱</div>
          <div class="feature-text">
            <h4>Fully Responsive Design</h4>
            <p>Pixel-perfect on every device — mobile, tablet, and desktop — ensuring zero visitors are lost.</p>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-icon">📈</div>
          <div class="feature-text">
            <h4>+40% Traffic Growth</h4>
            <p>Our data-driven approach and performance optimizations are proven to increase organic traffic by 40%+.</p>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-icon">⚡</div>
          <div class="feature-text">
            <h4>Blazing Fast Performance</h4>
            <p>Optimized to score 95+ on Google PageSpeed — a key ranking factor that your competitors lack.</p>
          </div>
        </div>
      </div>

      <div class="credentials-box">
        <h3>🔐 Your Login Details (Keep this safe)</h3>
        <div class="cred-row">
          <span class="cred-label">Email:</span>
          <span class="cred-value">${user.email}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Portal:</span>
          <span class="cred-value">https://click2website.netlify.app/login</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Support:</span>
          <span class="cred-value">sasindragandla@gmail.com</span>
        </div>
      </div>

      <a href="https://click2website.netlify.app/contact" class="cta-btn">🚀 Get Started — Consult with Our Team</a>

      <div class="divider"></div>
      <p class="message" style="font-size:14px; color:#6b7280;">
        Our team typically responds within 24 hours. If you have any immediate questions, you can reach us directly at
        <a href="mailto:sasindragandla@gmail.com" style="color:#7c3aed;">sasindragandla@gmail.com</a> or call us at
        <a href="tel:+919959732476" style="color:#7c3aed;">+91 9959732476</a>.
      </p>
    </div>
    <div class="footer">
      <div class="social-links">
        <a href="https://click2website.netlify.app">🌐</a>
      </div>
      <p>© 2026 Click2Website. All rights reserved.</p>
      <p>Hyderabad, India — Built with ❤️</p>
      <p style="font-size:11px; margin-top:8px;">You're receiving this because you registered at click2website.netlify.app</p>
    </div>
  </div>
  <!-- Tracking Pixel -->
  <img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
`;

// ── Follow-up Email Template (3-hour loop) ─────────
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
    @media (max-width: 600px) { .body { padding: 20px 14px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌐 Click2Website — A Gentle Reminder</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi ${user.name.split(' ')[0]}, your success is our priority! 👋</p>
      <p class="message">
        We noticed that our welcome email might have slipped through the cracks — inboxes get busy!
        We're following up because we genuinely want to help you build something amazing online.
      </p>
      <p class="message">
        Your website is waiting to be built. Our team of expert developers is ready to create a
        <strong>fully responsive, SEO-optimized</strong> website that can grow your traffic by
        <strong>40%+</strong> from day one.
      </p>
      <p class="message">
        🕐 This is reminder <strong>#${reminderCount}</strong>. We'll keep checking on you until we hear back,
        because we truly believe in your vision.
      </p>
      <a href="https://click2website.netlify.app/contact" class="cta-btn">💬 Let's Talk — Schedule a Free Call</a>
      <p class="message" style="font-size:13px; color:#9ca3af; text-align:center;">
        Questions? Reply directly to this email or reach us at <strong>sasindragandla@gmail.com</strong>
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Click2Website — We're here to grow your business 🚀</p>
    </div>
  </div>
  <img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
`;

// ── CRON: Every hour — run the follow-up automation ─
cron.schedule('0 * * * *', async () => {
  console.log('⏰ [CRON] Running Automation: Email & SMS Follow-up Check...');

  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const fourHoursAgo  = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const API_URL       = process.env.API_URL || 'https://click2website-backend.onrender.com';

    // Find users who: haven't opened the email, automation is NOT paused
    const unengagedUsers = await User.find({
      role: 'user',
      welcomeEmailOpened: false,
      automationPaused: false,
    });

    for (const user of unengagedUsers) {
      const now = new Date();

      // ── EMAIL FOLLOW-UP (every 3 hours) ──────────────
      const lastReminder = user.lastReminderAt;
      const canSendEmail =
        !lastReminder
          ? user.createdAt <= threeHoursAgo               // first reminder 3h after signup
          : (now - lastReminder) >= 3 * 60 * 60 * 1000;  // repeat every 3h

      if (canSendEmail && process.env.PLATFORM_EMAIL && process.env.PLATFORM_EMAIL_PASSWORD) {
        try {
          const newCount    = (user.reminderCount || 0) + 1;
          const trackingUrl = `${API_URL}/api/auth/track-welcome/${user._id}`;

          await transporter.sendMail({
            from: `"Click2Website Team" <${process.env.PLATFORM_EMAIL}>`,
            to:   user.email,
            subject: `⏰ Reminder #${newCount}: Your website is waiting, ${user.name.split(' ')[0]}!`,
            html:  buildFollowupEmailHtml(user, newCount, trackingUrl),
          });

          user.lastReminderAt = now;
          user.reminderCount  = newCount;
          await user.save();
          console.log(`✉️  Reminder email #${newCount} sent to ${user.email}`);
        } catch (err) {
          console.error(`❌ Follow-up email failed for ${user.email}:`, err.message);
        }
      }

      // ── SMS FOLLOW-UP (once, 4 hours after signup) ──
      if (!user.smsFollowupSent && user.phone && user.createdAt <= fourHoursAgo) {
        const client = getTwilioClient();
        if (client) {
          try {
            const smsBody =
              `Hi ${user.name.split(' ')[0]}! 👋 This is Click2Website.\n\n` +
              `We sent you a welcome email but it seems you missed it.\n` +
              `Your SEO-optimized, responsive website can increase your traffic by 40%+!\n\n` +
              `Let's get started: https://click2website.netlify.app/contact\n\n` +
              `Reply STOP to opt out.`;

            await client.messages.create({
              body: smsBody,
              from: process.env.TWILIO_PHONE_NUMBER,
              to:   user.phone,
            });

            user.smsFollowupSent = true;
            await user.save();
            console.log(`📱 SMS follow-up sent to ${user.phone} (${user.email})`);
          } catch (err) {
            console.error(`❌ SMS failed for ${user.phone}:`, err.message);
          }
        }
      }
    }

    console.log(`✅ [CRON] Automation complete. Processed ${unengagedUsers.length} unengaged users.`);
  } catch (err) {
    console.error('❌ [CRON] Automation Error:', err.message);
  }
});

// ── Send Welcome Email immediately on signup ───────
export const sendWelcomeEmail = async (user) => {
  if (!process.env.PLATFORM_EMAIL || !process.env.PLATFORM_EMAIL_PASSWORD) return;
  const API_URL = process.env.API_URL || 'https://click2website-backend.onrender.com';
  const trackingUrl = `${API_URL}/api/auth/track-welcome/${user._id}`;
  try {
    await transporter.sendMail({
      from:    `"Click2Website Team" <${process.env.PLATFORM_EMAIL}>`,
      to:      user.email,
      subject: `🎉 Hii ${user.name.split(' ')[0]}, Welcome to Click2Website — Your Journey Starts Now!`,
      html:    buildWelcomeEmailHtml(user, trackingUrl),
    });
    console.log(`✉️  Welcome email sent to ${user.email}`);
  } catch (err) {
    console.error('❌ Welcome email failed:', err.message);
  }
};

console.log('✅ Cron Jobs Initialized — Email & SMS automation active.');
