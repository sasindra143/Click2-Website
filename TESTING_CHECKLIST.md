# Testing Checklist - Email + SMS Automation System

## Pre-Deployment Testing

### Database Connectivity ✓
- [ ] MongoDB Atlas connection string is valid
- [ ] Can connect from local machine
- [ ] Collections are created automatically on first insert
- [ ] Indexes are created for userId and email

### Email Configuration ✓
- [ ] Gmail OAuth credentials are valid
- [ ] App-specific password is set (not regular password)
- [ ] Nodemailer transporter can send emails
- [ ] Welcome email template loads without errors
- [ ] Tracking pixel is embedded in welcome email
- [ ] Email relay function (Netlify) works as fallback

### SMS Configuration ✓
- [ ] Twilio account is active and has credits
- [ ] WhatsApp is enabled for phone number
- [ ] Phone numbers are in E.164 format (+country_code + number)
- [ ] Twilio client can send messages

### Server Configuration ✓
- [ ] All .env variables are set
- [ ] Port 5000 is available
- [ ] CORS is configured for frontend URL
- [ ] API endpoints respond correctly
- [ ] JWT tokens are generated properly

### Frontend Configuration ✓
- [ ] VITE_API_URL points to backend
- [ ] Frontend builds without errors
- [ ] API calls include authorization headers
- [ ] Error handling works properly

## Functional Testing

### User Registration Flow
- [ ] User can register with name, email, password, and phone
- [ ] Password validation works (at least 6 characters)
- [ ] Email uniqueness validation works
- [ ] Welcome email is sent immediately after registration
- [ ] Welcome email tracking pixel is embedded
- [ ] User data is saved to MongoDB

### Email Tracking
- [ ] Open email in email client
- [ ] Image tags trigger tracking pixel
- [ ] GET /api/auth/track-welcome/:id is called
- [ ] User.welcomeEmailOpened becomes true
- [ ] Verify change in database

### CRON Job - 4-Hour SMS Follow-up
- [ ] CRON job runs every hour at MM:00
- [ ] Job finds users with unopened emails
- [ ] Job checks if 4+ hours have passed
- [ ] Job skips users with smsFollowupSent=true
- [ ] Job skips users with automationPaused=true
- [ ] SMS is sent via Twilio WhatsApp
- [ ] SMS delivery is logged in SMSLog
- [ ] User.smsFollowupSent becomes true

### CRON Job - Daily Email Reminders
- [ ] CRON identifies users needing reminders
- [ ] Reminder emails are sent with unique subject
- [ ] Reminders are skipped if email was opened
- [ ] Reminders respect the automationPaused flag
- [ ] lastReminderAt is updated
- [ ] reminderCount is incremented

### Admin Dashboard - Users Tab
- [ ] Admin can view all users in table
- [ ] Can see user name, email, phone
- [ ] Can see creation date
- [ ] Can see email status (opened/not opened)
- [ ] Can see automation status (paused/active)
- [ ] Can toggle automation pause/resume
- [ ] Can send custom SMS
- [ ] Can delete user
- [ ] Can manually test automation

### Admin Dashboard - Email Logs Tab
- [ ] Can view all sent emails
- [ ] Can filter by status (sent/failed)
- [ ] Can see error descriptions
- [ ] Can see timestamp and recipient
- [ ] Message count matches number of emails sent

### Admin Dashboard - SMS Logs Tab
- [ ] Can view all sent messages
- [ ] Can filter by type (auto/custom)
- [ ] Can filter by sender (system/admin)
- [ ] Can see delivery status
- [ ] Can see error descriptions if failed

### Admin Functions
- [ ] **Pause Automation**: User automationPaused becomes true, SMS not sent
- [ ] **Resume Automation**: User automationPaused becomes false, SMS can resume
- [ ] **Send Custom SMS**: Admin can input message and send
- [ ] **Custom SMS Effect**: Sending custom SMS pauses automation
- [ ] **Disconnect Gmail**: Gmail oauth is revoked
- [ ] **Connect Gmail**: OAuth flow works, tokens are saved

## Integration Testing

### Email → SMS Workflow
1. [ ] Create new user with phone
2. [ ] Verify welcome email sent
3. [ ] Wait for email open tracking OR wait 4+ hours
4. [ ] If unopened after 4+ hours:
   - [ ] CRON job runs
   - [ ] SMS is sent
   - [ ] SMS is logged
   - [ ] User status shows SMS sent
5. [ ] If email opened:
   - [ ] SMS should NOT be sent
   - [ ] User shows email opened status

### Daily Reminder Chain
1. [ ] Create user at specific time
2. [ ] Watch for reminders:
   - [ ] 1st reminder after 24 hours (if email unopened)
   - [ ] 2nd reminder after 48 hours (if email unopened)
   - [ ] 3rd reminder after 72 hours (if email unopened)
3. [ ] Verify each reminder increases reminderCount
4. [ ] Verify each reminder has correct email content

### Admin Manual Override
1. [ ] Create user without opening email
2. [ ] Admin pauses automation
3. [ ] Wait past 4-hour mark
4. [ ] Verify SMS is NOT sent (automation paused)
5. [ ] Admin sends custom SMS
6. [ ] Verify custom SMS is logged with sentBy=admin
7. [ ] Resume automation
8. [ ] Future reminders should work again

### Multi-User Scenario
1. [ ] Create 3 test users with different timings
2. [ ] Run CRON job
3. [ ] Verify correct users receive SMS
4. [ ] Verify correct users receive reminders
5. [ ] Check logs show all correct entries

## API Testing

### Authentication Endpoints
- [ ] POST /api/auth/register - 201 status, tokens returned
- [ ] POST /api/auth/login - 200 status, valid JWT tokens
- [ ] POST /api/auth/refresh - 200 status, new access token
- [ ] POST /api/auth/logout - 200 status, token deleted
- [ ] GET /api/auth/me - 200 status, user data returned

### Admin Endpoints (with authorization)
- [ ] GET /api/admin/users - 200 status, user array returned
- [ ] GET /api/admin/stats - 200 status, stats object
- [ ] GET /api/admin/email-logs - 200 status, log array
- [ ] GET /api/admin/sms-logs - 200 status, log array
- [ ] PATCH /api/admin/users/:id/pause-automation - 200 status
- [ ] POST /api/admin/users/:id/send-sms - 200 status
- [ ] POST /api/admin/users/:id/test-automation - 200 status

### Error Handling
- [ ] 400 - Missing required fields
- [ ] 401 - Unauthorized requests
- [ ] 403 - Admin-only endpoints blocked for users
- [ ] 404 - Non-existent user
- [ ] 500 - Server errors handled gracefully

## Performance Testing

### Load Testing
- [ ] System handles 100+ concurrent users
- [ ] CRON job completes in < 5 minutes
- [ ] Email sending doesn't block API responses
- [ ] SMS sending doesn't block API responses
- [ ] Database queries are indexed properly

### Response Times
- [ ] API endpoints respond in < 500ms
- [ ] Email sending completes in < 3 seconds
- [ ] SMS sending completes in < 2 seconds
- [ ] CRON job runs without blocking requests

## Security Testing

### Authentication
- [ ] JWT tokens expire correctly (15m for access, 7d for refresh)
- [ ] Invalid tokens are rejected
- [ ] Admin endpoints require admin role
- [ ] Regular users cannot access admin endpoints

### Data Protection
- [ ] Passwords are hashed (never stored in plain text)
- [ ] .env variables are not logged
- [ ] Sensitive data is not exposed in errors
- [ ] No sensitive data in CORS headers

### CORS
- [ ] Requests from allowed origins are accepted
- [ ] Requests from unauthorized origins are rejected
- [ ] Credentials are properly handled

## Deployment Testing

### Render (Backend)
- [ ] Application deploys successfully
- [ ] Environment variables are set correctly
- [ ] CRON jobs run on schedule
- [ ] Logs are accessible and readable
- [ ] Errors are properly reported

### Netlify (Frontend)
- [ ] Frontend builds without errors
- [ ] Frontend deploys successfully
- [ ] Environment variables are accessible
- [ ] API calls work from deployed frontend

### Production URLs
- [ ] Frontend URL is accessible globally
- [ ] Backend API is accessible from frontend
- [ ] HTTPS certificates are valid
- [ ] Domain names resolve correctly

## Monitoring & Observability

### Logging
- [ ] CRON logs are informative and timestamped
- [ ] Error logs include relevant context
- [ ] Email/SMS attempts are logged
- [ ] Delivery failures are logged with error details

### Metrics to Monitor
- [ ] Number of emails sent per day
- [ ] Number of SMS sent per day
- [ ] Email delivery success rate
- [ ] SMS delivery success rate
- [ ] User signup rate
- [ ] Email open rate
- [ ] Average time from signup to first reminder

### Alerts to Set Up
- [ ] CRON job failure
- [ ] Email sending failure rate > 5%
- [ ] SMS sending failure rate > 5%
- [ ] Database connection errors
- [ ] API response time > 2 seconds

## Final QA Checklist

### Before Production Release
- [ ] All tests passed
- [ ] Code reviewed by team
- [ ] No console errors or warnings
- [ ] No unhandled promise rejections
- [ ] All features work end-to-end
- [ ] Documentation is complete
- [ ] Environment variables are documented
- [ ] Monitoring is set up
- [ ] Backup strategy is in place
- [ ] Disaster recovery plan is documented

### Post-Deployment Validation
- [ ] Monitor system for first 24 hours
- [ ] Verify CRON jobs run on schedule
- [ ] Check email/SMS delivery rates
- [ ] Verify no critical errors in logs
- [ ] Confirm admin dashboard is accessible
- [ ] Test user registration flow
- [ ] Monitor database performance

## Test Results

### Date: ___________
### Tester: ___________

**Overall Status**: ☐ PASS ☐ FAIL ☐ PENDING

**Critical Issues**: _____________________________________

**Minor Issues**: ________________________________________

**Notes**: _____________________________________________

---

**Sign-off**: _________________ **Date**: _____________
