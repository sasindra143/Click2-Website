# Email + SMS Follow-up Automation System Guide

## Overview
This system automates a dual-channel follow-up sequence:
1. **Signup Trigger**: When a user registers, a professional welcome email is sent immediately
2. **Email Tracking**: The system tracks if the user opens the welcome email (via hidden pixel)
3. **4-Hour SMS Follow-up**: If email is NOT opened after 4 hours, an automated SMS is sent
4. **Manual Override**: Admin can pause automation and send custom SMS messages from the admin panel
5. **Email Reminders**: Every 24 hours, if email still unopened, a follow-up reminder email is sent

## Architecture

### Database Models

#### User Model
Tracks automation state per user:
```javascript
{
  automationPaused: Boolean,        // Admin can pause follow-ups
  welcomeEmailOpened: Boolean,      // Tracks if email was opened
  welcomeEmailReminderSent: Boolean,// Has reminder been sent
  smsFollowupSent: Boolean,         // Has 4-hour SMS been sent
  lastReminderAt: Date,             // When was last reminder sent
  reminderCount: Number,            // Number of reminders sent
  phone: String,                    // For SMS delivery
}
```

#### EmailLog Model
Records all sent emails:
```javascript
{
  userId,                // User reference
  to,                    // Email address
  subject,               // Email subject
  type,                  // welcome | reminder | login-alert | custom
  status,                // sent | failed
  error,                 // Error message if failed
  createdAt,             // When sent
}
```

#### SMSLog Model
Records all sent SMS/WhatsApp messages:
```javascript
{
  userId,                // User reference
  to,                    // Phone number
  body,                  // Message content
  type,                  // auto | custom
  sentBy,                // system | admin
  status,                // sent | failed
  error,                 // Error message if failed
  createdAt,             // When sent
}
```

## Workflow Sequence

### 1. User Signs Up
```
[User Registers] 
  ↓
[Welcome Email Sent] (immediate, via Gmail API or Netlify Relay)
  ↓
[Tracking Pixel Embedded] (hidden 1x1 gif image with user ID)
```

### 2. Email Tracking (Continuous Monitoring)
- When user opens email client, the tracking pixel is loaded
- GET `/api/auth/track-welcome/:userId` is called
- User's `welcomeEmailOpened` flag is set to true
- Automation stops (SMS follow-up is skipped)

### 3. Four-Hour SMS Follow-up (CRON - runs hourly)
```
Every hour at MM:00:

1. Find users where:
   - welcomeEmailOpened === false (email not opened)
   - smsFollowupSent === false (SMS not already sent)
   - automationPaused === false (admin hasn't paused)
   - createdAt <= 4 hours ago (4+ hours have passed)

2. For each matching user:
   - Send WhatsApp SMS via Twilio
   - Set smsFollowupSent = true
   - Log SMS in SMSLog collection
   - Increment user.smsSent counter
```

### 4. Daily Email Reminders (CRON - runs hourly)
```
Every hour at MM:00:

1. Find users where:
   - welcomeEmailOpened === false (still unopened)
   - automationPaused === false
   - Either: never had reminder OR last reminder > 24 hours ago

2. For each matching user:
   - Send follow-up reminder email
   - Update lastReminderAt = now
   - Increment reminderCount
   - Log email in EmailLog collection
```

### 5. Manual Admin Override
Admin can:
- **Pause Automation**: Stop all automated follow-ups for a user
- **Send Custom SMS**: Send a personalized SMS, which auto-pauses automation
- **View Status**: See Email/SMS delivery logs and open rates
- **Test Automation**: Manually trigger the sequence for a user

## Environment Variables Required

### Gmail/Email Configuration
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
PLATFORM_EMAIL=your_platform_email@gmail.com
PLATFORM_EMAIL_PASSWORD=your_app_specific_password
```

### Twilio/SMS Configuration
```env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio WhatsApp number
```

### Server Configuration
```env
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
API_URL=https://your-backend-url.com
CLIENT_URL=https://your-frontend-url.com
PORT=5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user (triggers welcome email)
- `GET /api/auth/track-welcome/:id` - Track email open (hidden pixel)

### Admin Management
- `GET /api/admin/users` - List all users (with automation status)
- `PATCH /api/admin/users/:id/pause-automation` - Toggle automation pause
- `POST /api/admin/users/:id/send-sms` - Send custom SMS
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/email-logs` - Email delivery logs
- `GET /api/admin/sms-logs` - SMS delivery logs
- `POST /api/admin/users/:id/test-automation` - Manually trigger automation

### Email Tracking
- `GET /api/email/stats` - Email statistics
- `GET /api/email/inbox` - Connected Gmail inbox

### SMS
- `GET /api/sms/stats` - SMS statistics

## Testing the System

### Manual Test via Admin Dashboard
1. Go to Admin Dashboard
2. Find a user in the Users tab
3. Click "🧪 Test" button to manually trigger the sequence
4. Check Email Logs and SMS Logs tabs to verify delivery

### Automatic CRON Testing
The system runs a hourly CRON job at MM:00 (every hour on the hour):
- Checks for eligible users (4+ hours since signup, email not opened)
- Sends 4-hour SMS follow-up
- Checks for eligible users (24+ hours since last reminder)
- Sends reminder emails

### Monitoring
- Check admin dashboard for open rate statistics
- Review Email Logs for send failures
- Review SMS Logs for delivery issues
- Monitor browser console for CRON execution logs

## Troubleshooting

### Email not being sent?
1. Check PLATFORM_EMAIL and PLATFORM_EMAIL_PASSWORD in .env
2. Verify Gmail app-specific password (NOT your regular password)
3. Check EMAIL_LOGS collection for errors
4. Try connecting Gmail API from Admin Dashboard

### SMS not being sent?
1. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
2. Verify TWILIO_PHONE_NUMBER is a valid WhatsApp-enabled number
3. Check SMS_LOGS collection for errors
4. Confirm user phone number is in E.164 format (+1234567890)

### Tracking pixel not working?
1. Email must be opened in an email client that loads images
2. Some email clients block images by default
3. Check if user has welcomeEmailOpened flag in database
4. Verify API_URL is correct in environment variables

### CRON job not running?
1. Check server logs for "[CRON]" messages
2. Verify MongoDB connection
3. Ensure node-cron dependency is installed
4. Check that server.js imports './cron.js'

## Deployment Checklist

### Before Deploying to Production
- [ ] Set all environment variables on production server
- [ ] Configure MongoDB Atlas for production
- [ ] Test Gmail API with app-specific password
- [ ] Test Twilio WhatsApp integration
- [ ] Verify CORS settings for production domain
- [ ] Test email tracking pixel with real email
- [ ] Monitor CRON logs for errors
- [ ] Set up error monitoring (Sentry, DataDog, etc.)
- [ ] Configure email alerts for failed deliveries

### Netlify Functions (Email Relay)
- Email relay function at `client/netlify/functions/send-email.js`
- Used as fallback when Gmail API is unavailable
- Requires PLATFORM_EMAIL and PLATFORM_EMAIL_PASSWORD

### GitHub Deployment
1. Commit all changes
2. Push to main branch
3. Netlify frontend auto-deploys on push
4. Backend (Render/Railway): Deploy via connected GitHub repo

## Monitoring & Analytics

### Key Metrics to Track
- **Total Users**: `stats.total`
- **Email Open Rate**: `stats.openRate` (percentage)
- **SMS Delivered**: `stats.smsSent` (users who received SMS)
- **Automation Paused**: `stats.paused` (manually paused)
- **New Users (7 days)**: `stats.recent7Days`

### Admin Dashboard Tabs
1. **Users**: Manage users, view status, pause automation, send custom SMS
2. **Email Logs**: View all email sends with status and errors
3. **SMS Logs**: View all SMS sends with status and errors

## Best Practices

1. **Email Intervals**: Default is 24 hours between reminders. Adjust in `cron.js` if needed
2. **Phone Number Format**: Ensure all phone numbers are in E.164 format (+country_code + number)
3. **Custom SMS Limit**: Admin should not send more than 10 SMSes per user per day
4. **Pause Before Delete**: Always pause automation before deleting user to prevent orphaned logs
5. **Monitor Costs**: Twilio and Gmail both incur costs; monitor usage regularly
6. **GDPR Compliance**: Ensure proper consent before sending SMS/emails

## Rate Limits

- **Email**: Gmail API: 500 emails/day per project
- **SMS**: Twilio: Based on account tier
- **CRON**: Runs once per hour, processes all eligible users in batch
- **API**: No rate limiting on admin endpoints (restrict via auth middleware)

## Security Considerations

1. **API Authentication**: All admin endpoints require admin role
2. **Email Tracking**: Pixel tracking is anonymous, only sets flag in database
3. **SMS Content**: No sensitive data in SMS messages
4. **Admin Override**: Custom SMS prevents automation abuse
5. **Twilio Credentials**: Never commit .env file to Git

## Future Enhancements

1. **SMS Scheduling**: Allow admins to schedule SMS sends
2. **Email Templates**: Create template builder for custom email designs
3. **A/B Testing**: Test different email subject lines or SMS content
4. **Analytics**: Track conversion rates after email/SMS sends
5. **Unsubscribe Link**: Add option to unsubscribe from automated sends
6. **Multi-language**: Support for emails/SMS in multiple languages
