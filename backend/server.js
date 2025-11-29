require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB and seed admin
const initializeApp = async () => {
  try {
    await connectDB();
    
    // Auto-seed admin on first startup (production only)
    if (process.env.NODE_ENV === 'production') {
      console.log('🔍 Checking for admin account...');
      
      // Wait for MongoDB connection to be ready
      if (mongoose.connection.readyState === 1) {
        try {
          const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
          
          if (!existingAdmin) {
            console.log('📝 Creating admin account...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
            
            const newAdmin = await Admin.create({
              email: process.env.ADMIN_EMAIL,
              password: hashedPassword,
              role: 'admin'
            });
            
            console.log('✅ Admin account created successfully!');
            console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
          } else {
            console.log('ℹ️  Admin account already exists');
          }
        } catch (seedError) {
          console.error('❌ Error seeding admin:', seedError.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ App initialization error:', error);
  }
};

// Initialize the app
initializeApp();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/trending', require('./routes/trending'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Manual admin seed endpoint (production only, for emergency use)
app.post('/api/seed-admin-emergency', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return res.status(403).json({ message: 'Only available in production' });
    }

    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', email: existingAdmin.email });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
    
    const newAdmin = await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    res.json({ 
      message: 'Admin created successfully!',
      email: newAdmin.email 
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Anything that doesn't match an API route should serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'File too large! Maximum size is 100MB for videos and 10MB for images.'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ 
      message: 'Too many files or unexpected file field.'
    });
  }
  
  if (err.message && err.message.includes('Only image and video files')) {
    return res.status(400).json({ 
      message: err.message
    });
  }
  
  res.status(500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
