const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
// CORS update kiya hai taaki Netlify se request asani se aa sake
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Deployment ke baad yahan Netlify ka URL daal dena
    methods: ['GET', 'POST'],
    credentials: true
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

// Health Check Route (Render par deploy check karne ke liye)
app.get('/', (req, res) => {
    res.send("LOOKS S1 Backend is Active! 🚀");
});

// Registration API Route
app.post('/api/register', async (req, res) => {
    try {
        const newRegistration = new Registration(req.body);
        await newRegistration.save();
        res.status(201).json({ message: "Registration Successful!" });
    } catch (err) {
        res.status(400).json({ error: "Registration Failed!", details: err.message });
    }
});

// --- SERVER & DB CONNECTION ---
const PORT = process.env.PORT || 5000;
// Render par deploy karte waqt MONGO_URI Environment Variable mein daalna
const MONGO_URI = process.env.MONGO_URI; 

mongoose.set('strictQuery', false); 

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log("❌ DB Connection Error:", err));