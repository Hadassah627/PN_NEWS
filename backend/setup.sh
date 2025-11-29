#!/bin/bash

echo "🚀 Prathinityam News Portal - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if MongoDB is running
if ! command -v mongo &> /dev/null && ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB might not be installed. Please ensure MongoDB is installed and running."
    echo "   Visit: https://www.mongodb.com/try/download/community"
    echo ""
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Seed admin account
echo "🔐 Creating admin account..."
npm run seed-admin
if [ $? -ne 0 ]; then
    echo "⚠️  Note: Admin account might already exist or MongoDB might not be running"
fi
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Success message
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Default Admin Credentials:"
echo "   Email: admin@prathinityam.com"
echo "   Password: Admin@123"
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd backend"
echo "   $ npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd frontend"
echo "   $ npm run dev"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 For more information, see:"
echo "   - README.md (Full documentation)"
echo "   - QUICKSTART.md (Quick start guide)"
echo ""
echo "Happy coding! 🎉"
