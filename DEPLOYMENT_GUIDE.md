# Deployment Guide: Email + SMS Automation System

## Prerequisites

### Required Services
1. **MongoDB**: MongoDB Atlas (cloud database)
2. **Google Cloud**: Gmail API enabled
3. **Twilio**: Account with WhatsApp-enabled number
4. **GitHub**: Repository for version control
5. **Netlify**: Frontend hosting (auto-deploy on git push)
6. **Render/Railway/Heroku**: Backend API hosting

## Step 1: GitHub Setup

### Initialize Git Repository
```bash
cd "c:\Users\sasin\OneDrive\Desktop\Web Business Labs"
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
```

### Add to .gitignore
```bash
# Create/Update .gitignore
node_modules/
.env
.env.local
.env.production
dist/
build/
.DS_Store
.vscode/
.idea/
*.log
.parcel-cache/
```

### Create Initial Commit
```bash
git add .
git commit -m "Initial commit: Email + SMS Follow-up Automation System"
git branch -M main
```

### Push to GitHub
```bash
# If you haven't created repo on GitHub yet:
# 1. Go to github.com and create new repository
# 2. Copy the remote URL

# Then:
git remote add origin https://github.com/yourusername/web-business-labs.git
git push -u origin main
```

## Step 2: Netlify Deployment (Frontend)

### Connect Netlify to GitHub
1. Go to https://netlify.com and sign in
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

### Environment Variables on Netlify
In Netlify Dashboard → Site settings → Build & deploy → Environment:
```
VITE_API_URL=https://your-backend-render-url.com
```

### Deploy
- Netlify auto-deploys on every git push to main
- View deployment status at https://app.netlify.com
- Custom domain: Go to Domain settings and configure

## Step 3: Backend Deployment on Render

### Create Render Account
1. Go to https://render.com
2. Sign up and verify email

### Deploy Backend Service
1. Click "New +" → "Web Service"
2. Choose "Deploy from a Git repository"
3. Authorize GitHub and select your repository
4. Configure:
   - **Name**: `click2website-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: `main`
   - **Root Directory**: `server`

### Set Environment Variables
In Render Dashboard → your-service → Environment:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mailflow360
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-render-service.onrender.com/api/google/callback
PLATFORM_EMAIL=your_email@gmail.com
PLATFORM_EMAIL_PASSWORD=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
API_URL=https://your-render-service.onrender.com
CLIENT_URL=https://your-netlify-site.netlify.app
NODE_ENV=production
PORT=5000
```

### Deploy
- Render auto-deploys on every git push to main
- First deployment takes 2-3 minutes
- View logs: Render Dashboard → your-service → Logs

## Step 4: Configure MongoDB Atlas

### Create Cluster
1. Go to https://mongodb.com/cloud/atlas
2. Sign up or log in
3. Create free tier cluster (M0)
4. Configure:
   - **Cloud Provider**: AWS
   - **Region**: Choose closest to users
   - **Cluster Name**: `mailflow360`

### Setup Database User
1. Go to Database Access
2. Add New Database User:
   - **Username**: `appuser`
   - **Password**: Generate secure password
   - **Role**: `readWriteAnyDatabase`

### Allow Network Access
1. Go to Network Access
2. Add IP Address:
   - For development: Your IP (get from "What's my IP")
   - For production: Allow from anywhere (0.0.0.0/0)

### Get Connection String
1. Click "Connect" → "Drivers"
2. Copy connection string
3. Format: `mongodb+srv://appuser:password@cluster0.xyz.mongodb.net/mailflow360`

### Create Database Collections
```bash
# Connect using MongoDB Compass or Mongosh
mongosh "mongodb+srv://appuser:password@cluster0.xyz.mongodb.net/mailflow360"

# Collections auto-create when first document is inserted
# The app will create them automatically on startup
```

## Step 5: Gmail API Setup

### Enable Gmail API
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Search for "Gmail API" and enable it
4. Go to Credentials
5. Create OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     - `https://your-backend-render-url.com/api/google/callback`
     - `http://localhost:5000/api/google/callback` (for dev)

### Get Credentials
1. Download JSON credentials
2. Extract:
   - **Client ID**
   - **Client Secret**
   - Add to environment variables

### Create App-Specific Password
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2FA first (required)
3. Select "Mail" and "Windows Computer"
4. Copy password (16 characters)
5. Use in `PLATFORM_EMAIL_PASSWORD`

## Step 6: Twilio Setup

### Create Twilio Account
1. Go to https://twilio.com
2. Sign up and verify phone
3. Get phone number (preferably with WhatsApp support)

### Enable WhatsApp
1. Go to Console
2. Messaging → Try it out → WhatsApp
3. Enable WhatsApp for your number

### Get Credentials
1. Go to Account Info
2. Copy:
   - **Account SID**
   - **Auth Token**
3. Go to Phone Numbers and copy your Twilio number

## Step 7: Run the System

### Local Testing
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev

# Visit http://localhost:5173
```

### Production Monitoring
1. **Render Logs**: Monitor backend errors
   - Render Dashboard → your-service → Logs
2. **Netlify Analytics**: Monitor frontend
   - Netlify Dashboard → Analytics
3. **MongoDB**: Monitor database
   - MongoDB Atlas → Metrics
4. **Twilio Console**: Monitor SMS usage
   - Twilio.com → Console

## Step 8: Verify Everything Works

### Test Email + SMS Automation
1. Go to http://localhost:5173 (or production URL)
2. Register a new account with phone number
3. Check email (should receive welcome email)
4. Go to Admin Dashboard (log in as admin)
5. Find the user you just created
6. Click "🧪 Test" button
7. Check:
   - Email Logs tab for email delivery
   - SMS Logs tab for SMS delivery
   - User status shows email opened after 4 hours

### Test Admin Features
1. **Pause Automation**: Click ⏸ to pause, ▶ to resume
2. **Send Custom SMS**: Click 📱 SMS, send message
3. **View Stats**: Check dashboard for open rates
4. **Monitor Logs**: Review Email Logs and SMS Logs tabs

## Troubleshooting Deployment

### Netlify Frontend Issues
```
Problem: Build fails
Solution: 
1. Check Netlify logs for errors
2. Ensure VITE_API_URL is correct
3. Rebuild: Deploys → "Trigger deploy" → "Deploy site"

Problem: CORS errors
Solution:
1. Check backend CORS configuration
2. Verify CLIENT_URL matches deployed URL
3. Restart backend service
```

### Render Backend Issues
```
Problem: Service won't start
Solution:
1. Check Render logs
2. Verify all env variables are set
3. Check MongoDB connection string
4. Run locally first to test

Problem: CRON job not running
Solution:
1. Check that server.js imports './cron.js'
2. Look for "[CRON]" messages in logs
3. Verify MongoDB is accessible
4. Check that node version supports cron
```

### Email/SMS Not Working
```
Problem: Gmail not connected
Solution:
1. Click "Connect Gmail Now" in admin dashboard
2. Select the Gmail account
3. Grant permission to app
4. Try sending test email

Problem: Twilio not sending SMS
Solution:
1. Verify TWILIO_PHONE_NUMBER format: +1234567890
2. Check user phone number format
3. Ensure Twilio account has WhatsApp enabled
4. Check account balance/credits
```

## Continuous Integration/Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_DEPLOY_KEY }}
```

### Auto-Deploy Configuration
- **Netlify**: Already configured, auto-deploys on git push
- **Render**: Already configured, auto-deploys on git push
- **MongoDB**: No deployment needed (cloud service)

## Monitoring & Maintenance

### Daily Checks
- [ ] Check for failed email/SMS sends in logs
- [ ] Monitor Twilio SMS balance
- [ ] Review admin dashboard open rates
- [ ] Check for CRON job execution in logs

### Weekly Checks
- [ ] Review all admin actions (deletions, pauses)
- [ ] Monitor cost trends (Twilio, MongoDB)
- [ ] Check for any error patterns
- [ ] Review database size growth

### Monthly Checks
- [ ] Clean up old logs (>90 days)
- [ ] Analyze open rates and improvements
- [ ] Update dependencies for security
- [ ] Review and optimize database indexes

## Security Checklist

- [ ] All sensitive data in .env files (not in Git)
- [ ] CORS configured for production domain only
- [ ] JWT secret is strong (32+ characters)
- [ ] MongoDB requires authentication
- [ ] Twilio credentials stored securely
- [ ] Gmail app-specific password used
- [ ] HTTPS enabled on all endpoints
- [ ] Rate limiting configured on admin endpoints
- [ ] Admin role protected with authentication
- [ ] No console logs with sensitive data

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Docs**: https://docs.mongodb.com
- **Twilio Docs**: https://www.twilio.com/docs
- **Gmail API**: https://developers.google.com/gmail/api
