# Click2Website - Email + SMS Follow-up Automation System

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-id/deploy-status)](https://app.netlify.com/sites/click2website/deploys)

A sophisticated, production-ready system for **automated email and SMS follow-ups** designed to improve customer engagement and conversion rates.

## 🎯 Key Features

### Core Automation
- **Instant Email on Signup**: Professional welcome email sent immediately upon user registration
- **Email Tracking**: Hidden pixel tracking to monitor if customer opens the email
- **4-Hour SMS Follow-up**: Automatic WhatsApp/SMS reminder if email not opened after 4 hours
- **Daily Reminders**: Follow-up emails sent every 24 hours until email is opened (unless paused)
- **Admin Override**: Team members can pause automation and send custom SMS messages

### Admin Dashboard
- **User Management**: View all users with automation status
- **Real-time Tracking**: Monitor email opens and SMS delivery in real-time
- **Email Logs**: Complete history of all sent emails
- **SMS Logs**: Complete history of all sent messages
- **Dashboard Stats**: Key metrics (open rates, SMS sent, automation paused, etc.)
- **Manual Triggers**: Test automation sequences for any user

### Technical Excellence
- **Scalable Architecture**: Built with Node.js, Express, and MongoDB
- **OAuth2 Gmail API**: Secure integration with Gmail for branded emails
- **Twilio Integration**: Global SMS/WhatsApp delivery
- **CRON Automation**: Hourly scheduled jobs for 4-hour SMS and daily reminder emails
- **Error Handling**: Comprehensive logging and fallback mechanisms
- **Production Ready**: Deployed on Render (backend) and Netlify (frontend)

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Click2Website System                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │   Frontend   │    │   Backend    │                   │
│  │ (React+Vite)├───→│  (Node.js)   │                   │
│  └──────────────┘    └──────────────┘                   │
│                             │                            │
│        ┌────────────────────┼────────────────────┐       │
│        ▼                    ▼                    ▼       │
│   ┌─────────┐        ┌─────────┐        ┌─────────┐    │
│   │ MongoDB │        │  Gmail  │        │ Twilio  │    │
│   │ (Users) │        │ (Email) │        │ (SMS)   │    │
│   └─────────┘        └─────────┘        └─────────┘    │
│        ▲                    ▲                    ▲       │
│        └────────────────────┼────────────────────┘       │
│                        CRON Jobs                         │
│                    (Hourly Execution)                    │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier available)
- Gmail account (for email integration)
- Twilio account (for SMS/WhatsApp)

### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/web-business-labs.git
   cd web-business-labs
   ```

2. **Setup Backend**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📋 Environment Setup

### Create `.env` file in `server/` directory:

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mailflow360

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Gmail (for email sending)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
PLATFORM_EMAIL=your_email@gmail.com
PLATFORM_EMAIL_PASSWORD=your_app_specific_password

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### Create `.env.local` file in `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

## 🔄 Automation Workflow

### User Signup Flow
```
1. User registers with email & phone
   ↓
2. Welcome email sent immediately
   └─→ Contains tracking pixel
   ↓
3. System waits and monitors...
```

### 4-Hour Follow-up (CRON runs hourly)
```
Every hour, system checks:
├─ Users with unopened welcome email
├─ AND 4+ hours have passed since signup  
├─ AND SMS not already sent
└─ AND automation not paused
   ↓
Sends WhatsApp/SMS follow-up
└─→ Logs delivery status
```

### Daily Reminders (CRON runs hourly)
```
Every hour, system checks:
├─ Users with unopened welcome email
├─ AND no reminder sent OR 24+ hours since last
└─ AND automation not paused
   ↓
Sends reminder email
└─→ Updates reminder count
```

### Admin Override
```
Admin can:
├─ Pause→Resume automation for any user
├─ Send→Custom SMS (auto-pauses automation)
└─ View→Email/SMS logs and statistics
```

## 💻 API Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/track-welcome/:id` - Email tracking pixel

### Protected Admin Endpoints
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/pause-automation` - Toggle automation
- `POST /api/admin/users/:id/send-sms` - Send custom SMS
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/email-logs` - Email delivery logs
- `GET /api/admin/sms-logs` - SMS delivery logs
- `POST /api/admin/users/:id/test-automation` - Trigger automation

### Gmail Integration
- `GET /api/google/auth-url` - Get Gmail OAuth URL
- `POST /api/google/callback` - Handle OAuth callback

## 📊 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: 'user' | 'admin',
  
  // Email/SMS tracking
  emailsSent: Number,
  smsSent: Number,
  
  // Automation state
  welcomeEmailOpened: Boolean,
  automationPaused: Boolean,
  smsFollowupSent: Boolean,
  lastReminderAt: Date,
  reminderCount: Number,
  
  // Gmail integration
  gmail_connected: Boolean,
  gmail_email: String,
  access_token: String,
  refresh_token: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### EmailLog Schema
```javascript
{
  userId: ObjectId,
  to: String,
  subject: String,
  type: 'welcome' | 'reminder' | 'login-alert' | 'custom',
  status: 'sent' | 'failed',
  error: String,
  retryCount: Number,
  createdAt: Date
}
```

### SMSLog Schema
```javascript
{
  userId: ObjectId,
  to: String,
  body: String,
  type: 'auto' | 'custom',
  sentBy: 'system' | 'admin',
  status: 'sent' | 'failed',
  error: String,
  createdAt: Date
}
```

## 🧪 Testing

### Manual Testing
1. Register a new user with phone number
2. Go to Admin Dashboard
3. Find the user in the Users tab
4. Click "🧪 Test" button
5. Monitor Email Logs and SMS Logs tabs

### Automated Testing
- CRON job runs every hour automatically
- Check server logs for `[CRON]` messages
- Monitor database for updated user records

## 📈 Admin Dashboard Features

### Users Tab
- Search and filter users
- View email open status
- View SMS delivery status
- Toggle automation pause/resume
- Send custom SMS messages
- Delete users
- Manual test automation trigger

### Email Logs Tab
- View all sent emails
- Filter by success/failed
- See error messages
- Check timestamps

### SMS Logs Tab
- View all sent messages
- Filter by type (auto/custom)
- Filter by sender (system/admin)
- Check delivery status

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ OAuth2 Gmail integration
- ✅ Admin role protection
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ No sensitive data in logs

## 📝 Guides

- [📖 Detailed Automation Guide](./EMAIL_SMS_AUTOMATION_GUIDE.md)
- [🚀 Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [⚙️ Configuration Guide](./server/.env.example)

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Email**: Gmail API (OAuth2)
- **SMS**: Twilio
- **Scheduling**: node-cron
- **Runtime**: Node.js

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with custom styling
- **HTTP Client**: Axios
- **State Management**: React Context

### DevOps
- **Version Control**: Git/GitHub
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas
- **Email Relay**: Netlify Functions (fallback)

## 📞 Support & Resources

### Documentation
- [Email + SMS Automation Guide](./EMAIL_SMS_AUTOMATION_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

### External Resources
- [Render Deployment](https://render.com)
- [Netlify Hosting](https://netlify.com)
- [MongoDB Atlas](https://mongodb.com/cloud/atlas)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Twilio SMS/WhatsApp](https://www.twilio.com/docs/sms)

## 🚀 Deployment

### Production Deployment
1. Push changes to GitHub main branch
2. Netlify auto-deploys frontend
3. Render auto-deploys backend
4. MongoDB Atlas hosts database
5. Twilio processes SMS messages
6. Gmail API sends emails

### Monitoring
- Render Logs: Backend errors and CRON execution
- Netlify Analytics: Frontend performance
- MongoDB Metrics: Database performance
- Twilio Console: SMS delivery status

## 📜 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👤 Author

**Web Business Labs**
- Website: https://click2website.netlify.app
- Email: sasindragandla@gmail.com

## 🎉 Acknowledgments

- Inspired by modern customer engagement platforms
- Built with best practices for scalability and maintainability
- Optimized for production use

---

**Last Updated**: March 2026

For questions or support, please open an issue on GitHub or contact the development team.
