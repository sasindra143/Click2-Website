#!/bin/bash
# Setup script for Email + SMS Follow-up Automation System
# This script helps set up the project for development

set -e

echo "🚀 Setting up Click2Website - Email + SMS Automation System"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Create .env files if they don't exist
echo "📝 Setting up environment variables..."

if [ ! -f "server/.env" ]; then
    echo "Creating server/.env..."
    cp server/.env.example server/.env
    echo "⚠️  Please fill in your credentials in server/.env"
else
    echo "✅ server/.env already exists"
fi

if [ ! -f "client/.env.local" ]; then
    echo "Creating client/.env.local..."
    cat > client/.env.local << EOF
VITE_API_URL=http://localhost:5000
EOF
    echo "✅ Created client/.env.local"
else
    echo "✅ client/.env.local already exists"
fi

echo ""
echo "📦 Installing dependencies..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..
echo "✅ Server dependencies installed"

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..
echo "✅ Client dependencies installed"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit server/.env with your credentials:"
echo "   - MongoDB URI"
echo "   - Gmail credentials"
echo "   - Twilio credentials"
echo ""
echo "2. Start development:"
echo "   Terminal 1: npm run server:dev"
echo "   Terminal 2: npm run client:dev"
echo ""
echo "3. Or run both together:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
