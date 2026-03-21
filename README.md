# 🌐 Click2Website - Premium Web Development Agency

![Hero Section](file:///C:/Users/sasin/.gemini/antigravity/brain/0f3431f9-b2ef-4252-a394-e63876ba8ac0/hero_section_1774060790386.png)

Welcome to **Click2Website**, a high-end web development agency specializing in immersive, high-performance digital solutions for Hospitals, Colleges, Corporate Businesses, and Personal Brands.

---

## 🎯 Project Purpose
**Click2Website** is designed to provide a seamless bridge between complex business requirements and modern web technology. Originally rebranded from MailFlow360, this platform has evolved into a full-scale agency suite that manages:
- **Client Portfolios**: Showcasing real-world successes.
- **Automated Engagement**: Marketing automation through email tracking.
- **Secure Admin Management**: Direct control over user data and platform metrics.

---

## ✨ Features & Animations

### 🎨 Visual Excellence
- **GSAP & ScrollTrigger**: Every section features smooth, high-frame-rate reveal animations as you scroll.
- **3D Parallax Effects**: Interactive card components using `react-parallax-tilt` for a tactile, premium feel.
- **TypeWriter UI**: Dynamic, animated headlines on the landing page for better user engagement.
- **Glassmorphism**: A sleek, dark-themed design system with glowing borders and translucent panels.

### 🛡️ Secure Infrastructure
- **Firebase Admin Portal**: Secure `/admin-login` for site administrators using Google Auth.
- **Role-Based Security**: Automatic redirection and JWT-protected routes based on user roles (`admin` vs `user`).
- **Profile Customization**: Dynamic Gmail profile pictures synced in the navigation bar.

### 📊 Portfolio Highlights
![Portfolio Section](file:///C:/Users/sasin/.gemini/antigravity/brain/0f3431f9-b2ef-4252-a394-e63876ba8ac0/portfolio_section_1774060804636.png)
- **PR Skillverse**: Advanced LMS for tech education.
- **360 Vertex Solutions**: Corporate agency website.
- **Vaakya Creations**: Multimedia and art portfolio.
- **Sasindra Portfolio**: Personal developer showcase.

---

## 🛠 Technology Stack

- **Frontend**: React.js, Vite, GSAP, Axios, React Router, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT.
- **APIs**: Gmail API (Nodemailer), Twilio SMS, Firebase Auth.
- **Scheduling**: Node-Cron for automated 4-hour email follow-ups.

---

## 📡 API Documentation

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Create a new user account + send automated welcome email.
- `POST /login`: Standard JWT login.
- `POST /firebase-admin`: Secure admin login via Firebase Google Auth.
- `GET /me`: Get current authenticated user details (incl. avatar).
- `GET /track-welcome/:id`: Hidden pixel endpoint to track if the Welcome Email was opened.

### 📧 Email & SMS (`/api/email`, `/api/sms`)
- `POST /email/send`: Send custom emails using Gmail API.
- `POST /sms/send`: Send SMS notifications via Twilio.

### 🛠 Admin (`/api/admin`)
- `GET /admin/users`: Fetch all platform users (Admin Only).
- `DELETE /admin/users/:id`: Permanently delete a user account.

---

## 📂 Folder Structure

```text
/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── api/         # Axios Interceptors
│   │   ├── components/  # Layout Elements (Navbar, Footer)
│   │   ├── pages/       # Screen Views (Home, Services, etc.)
│   │   └── styles/      # GSAP & Global CSS
├── server/              # Express Backend
│   ├── controllers/     # Business Logic (Logic for Auth, Emails)
│   ├── models/          # Database Schemas (User, Token)
│   ├── routes/          # API Route Definitions
│   └── cron.js          # Background Worker (Marketing Automation)
```

---

## 🚀 Installation

1. **Clone the repo.**
2. **Server Setup**: `npm install` in `/server`. Add `.env` (MONGO_URI, JWT_SECRET, etc.). Run `npm run dev`.
3. **Client Setup**: `npm install` in `/client`. Run `npm run dev`.

*"Transforming Visions into Digital Reality."* 🚀
