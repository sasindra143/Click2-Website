# Quick Start: Deploy Email + SMS Automation System

## 📋 Prerequisites

Before you start, make sure you have:

1. **GitHub Account**: https://github.com (free)
2. **Netlify Account**: https://netlify.com (free)
3. **Render Account**: https://render.com (free tier available)
4. **MongoDB Atlas Account**: https://mongodb.com/cloud/atlas (free tier available)
5. **Gmail Account**: With 2FA enabled and app-specific password
6. **Twilio Account**: https://twilio.com (pay-as-you-go)

## 🚀 Step 1: Prepare Local Repository

### 1.1 Initialize Git (if not already done)
```bash
cd "c:\Users\sasin\OneDrive\Desktop\Web Business Labs"

# Check if git is initialized
git status

# If not initialized:
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
```

### 1.2 Create .gitignore
Already created! Make sure it contains:
```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
```

### 1.3 Create Initial Commit
```bash
git add .
git commit -m "Initial commit: Email + SMS Follow-up Automation System"
```

## 🐙 Step 2: Push to GitHub

### 2.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `web-business-labs`
3. Description: `Email + SMS Follow-up Automation System`
4. Choose: Public (so it's easy to deploy)
5. Click "Create repository"
6. **Copy the HTTPS URL** (looks like: `https://github.com/your-username/web-business-labs.git`)

### 2.2 Add Remote and Push
```bash
# Add the remote repository
git remote add origin https://github.com/YOUR-USERNAME/web-business-labs.git

# Verify remote is added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.3 Verify on GitHub
- Go to your repository URL
- Verify all files are there
- Check that `.env` files are NOT pushed (protected by .gitignore)

## 🌐 Step 3: Deploy Frontend (Netlify)

### 3.1 Connect Netlify to GitHub
1. Go to https://netlify.com and sign in
2. Click "New site from Git"
3. Choose "GitHub"
4. Authorize Netlify to access your GitHub account
5. Select your repository: `web-business-labs`

### 3.2 Configure Build Settings
```
Build command:       npm run build --prefix client
Publish directory:   client/dist
Base directory:      (leave empty)
Node.js version:     18
```

### 3.3 Add Environment Variables
In Netlify Dashboard → Site settings → Build & deploy → Environment:

```
VITE_API_URL = https://your-backend-render-url.com
```

(You'll get the Render URL in the next step)

### 3.4 Deploy
- Netlify automatically builds and deploys
- First deploy takes 2-3 minutes
- Get your Netlify URL: `https://[your-site-name].netlify.app`

### 3.5 Custom Domain (Optional)
- In Netlify Dashboard → Domain management
- Add your custom domain
- Update DNS records as instructed

## 🔧 Step 4: Deploy Backend (Render)

### 4.1 Create Render Account & Connect GitHub
1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Choose "Deploy from a Git repository"
4. Authorize Render to access your GitHub account
5. Select your repository: `web-business-labs`

### 4.2 Configure Service
```
Name:                click2website-api
Environment:         Node
Build Command:       npm install
Start Command:       npm start
Branch:              main
Root Directory:      server
Instances:           1
```

### 4.3 Add Environment Variables
In Render Dashboard → your-service → Environment:

Create these environment variables:

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mailflow360

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Google Gmail
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-render-service.onrender.com/api/google/callback

# Email
PLATFORM_EMAIL=your_email@gmail.com
PLATFORM_EMAIL_PASSWORD=your_app_specific_password

# SMS - Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Server Config
PORT=5000
NODE_ENV=production
API_URL=https://your-render-service.onrender.com
CLIENT_URL=https://your-netlify-frontend.netlify.app
```

### 4.4 Deploy
- Render automatically deploys from git
- First deploy takes 3-5 minutes
- Get your Render URL: `https://your-service-name.onrender.com`

### 4.5 Update Netlify Environment Variable
Now that you have your Render URL, update Netlify:

1. Netlify Dashboard → Settings → Build & deploy → Environment
2. Update: `VITE_API_URL` = your Render URL
3. Netlify automatically rebuilds with the new variable

## 🗄️ Step 5: Setup MongoDB Atlas

### 5.1 Create MongoDB Cluster
1. Go to https://mongodb.com/cloud/atlas
2. Create a new project: `Click2Website`
3. Create a cluster (M0 free tier):
   - Cloud Provider: AWS
   - Region: Choose closest to your users
   - Cluster name: `mailflow360`

### 5.2 Create Database User
1. Database Access → Add New Database User
   - Username: `appuser`
   - Password: Generate strong password (copy it!)
   - Built-in Role: `readWriteAnyDatabase`

### 5.3 Allow Network Access
1. Network Access → Add IP Address
   - For production: Add `0.0.0.0/0` (allow from anywhere)
   - For security: Later, restrict to specific IPs

### 5.4 Get Connection String
1. Databases → Connect → Drivers
2. Copy the connection string
3. Replace `<password>` with your database password
4. Add `/mailflow360` after server address for database name
5. Use in Render environment: `MONGODB_URI`

## 📧 Step 6: Setup Gmail Integration

### 6.1 Enable Gmail API
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Search "Gmail API" and click Enable
4. Go to Credentials
5. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-render-service.onrender.com/api/google/callback`
   - Also add: `http://localhost:5000/api/google/callback` (for local testing)

### 6.2 Get Credentials
1. Download JSON file
2. Open in text editor
3. Copy:
   - `client_id` → `GOOGLE_CLIENT_ID`
   - `client_secret` → `GOOGLE_CLIENT_SECRET`
4. Add to Render environment variables

### 6.3 Create App-Specific Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in (you may need to enable 2FA first)
3. Select "Mail" and "Windows Computer"
4. Google generates 16-character password
5. Copy and use as `PLATFORM_EMAIL_PASSWORD`

## 💬 Step 7: Setup Twilio

### 7.1 Create Twilio Account
1. Go to https://twilio.com
2. Sign up and verify phone
3. Get your phone number:
   - Preferably with WhatsApp support enabled
   - Format: `+1234567890`

### 7.2 Get Credentials
1. Twilio Console
2. Copy:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - Your phone number → `TWILIO_PHONE_NUMBER`
3. Add to Render environment variables

### 7.3 Enable WhatsApp
1. Twilio Console → Messaging
2. Try it out → WhatsApp
3. Enable WhatsApp for your number

## ✅ Step 8: Verify Deployment

### 8.1 Test Frontend
- Go to: `https://your-site.netlify.app`
- Should load without errors
- Check browser console for API errors

### 8.2 Test API Health Check
```bash
curl https://your-render-service.onrender.com/api/health
# Should return: {"status":"ok","message":"Click2Website API is running 🚀"}
```

### 8.3 Test User Registration
1. Go to frontend
2. Click Register
3. Fill in form with test email and phone
4. Submit
5. Check that:
   - User registration succeeds
   - Welcome email is sent (check MongoDB)
   - No console errors

### 8.4 Test Admin Dashboard
1. Login as admin (if configured)
2. Go to Admin Dashboard
3. Verify you can see users
4. Try sending test SMS

## 🔗 Make a Change and Push

### 8.5 Test Auto-Deployment
1. Make a small change to a file
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
3. Watch Netlify and Render dashboards for deployment
4. Verify changes are live

## 📊 Final Configuration

### Set Custom Domain (Optional)
- **Netlify**: Domain settings → Add custom domain
- **Render**: Environment → Add custom domain

### Enable Monitoring (Recommended)
- **Render Logs**: View at any time in dashboard
- **Netlify Analytics**: Built-in performance tracking
- **MongoDB Metrics**: Atlas dashboard

### Security Setup
- All sensitive data is in environment variables
- .env files are in .gitignore
- GitHub repository can be public (no secrets exposed)
- Enable 2FA on all accounts (GitHub, Netlify, Render, MongoDB)

## 🎉 You're Live!

Your system is now deployed!

**Frontend**: https://your-site.netlify.app
**Backend**: https://your-service.onrender.com
**Database**: MongoDB Atlas (secured)
**Email**: Gmail API (OAuth2)
**SMS**: Twilio (WhatsApp)

## 📝 Next Steps

1. **Configure CRON**: Ensure CRON job runs every hour
2. **Monitor Logs**: Check Render logs for any errors
3. **Test Automation**: Create test user and verify flow
4. **Document Updates**: Keep deployment guide updated
5. **Backup Strategy**: Set up MongoDB backups

## 🆘 Troubleshooting

### Netlify Build Fails
- Check Netlify deploy logs
- Verify VITE_API_URL is correct
- Run locally: `npm run build --prefix client`

### Render Deployment Issues
- Check Render logs (Logs tab)
- Verify all environment variables are set
- Check MongoDB connection string is correct
- Ensure PORT is set to 5000

### Email Not Working
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure PLATFORM_EMAIL_PASSWORD is app-specific password
- Check for Gmail API errors in Render logs

### SMS Not Working
- Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
- Check TWILIO_PHONE_NUMBER format: +1234567890
- Verify Twilio account has credits
- Check Twilio Console for error logs

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Docs**: https://docs.mongodb.com
- **Twilio Docs**: https://www.twilio.com/docs
- **Gmail API**: https://developers.google.com/gmail/api

---

**Congratulations! Your Email + SMS Automation System is now live!** 🚀
