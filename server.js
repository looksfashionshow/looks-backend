const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
// Isse replace karein
app.use(cors({
    origin: "*", 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
})); 
app.use(express.json()); 

// --- DATABASE SCHEMA ---
const ModelRegistrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, 
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', ModelRegistrationSchema);

// --- ROUTES ---

// Health Check Route
app.get('/', (req, res) => {
    res.send("LOOKS S1 Backend is Active! 🚀");
});

// Registration API Route
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, whatsapp } = req.body;
        
        // Basic Validation
        if (!fullName || !email || !whatsapp) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const newRegistration = new Registration({ fullName, email, whatsapp });
        await newRegistration.save();
        res.status(201).json({ message: "Registration Successful!" });
    } catch (err) {
        console.error("Reg Error:", err);
        res.status(500).json({ error: "Server Error!", details: err.message });
    }
});

// --- SERVER & DB CONNECTION ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
    console.error("❌ Error: MONGO_URI is not defined in Environment Variables!");
    process.exit(1);
}

mongoose.set('strictQuery', false); 

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    // App listen connect ke baad hi hona chahiye
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.log("❌ DB Connection Error:", err.message);
  });