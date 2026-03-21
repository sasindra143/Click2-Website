import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import smsRoutes from './routes/smsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Connect to MongoDB
connectDB();

// Initialize Cron Jobs
import './cron.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// ✅ PRODUCTION CORS FIX (VERY IMPORTANT)
// ─────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://click2website.netlify.app',
];

// Add dynamic client URL if exists
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 🔥 IMPORTANT: Handle preflight requests
app.options('*', cors());

// ─────────────────────────────────────────────
// Body Parsers
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/admin', adminRoutes);

// ─────────────────────────────────────────────
// Root Route (Fix "Route not found")
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🚀 Click2Website Backend is LIVE');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Click2Website API is running 🚀' });
});

// ─────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);

  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Click2Website Server running on port ${PORT}`);
});

export default app;