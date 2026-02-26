# ⚡ FitGenix — AI-Powered Fitness Ecosystem

FitGenix is a premium, high-performance fitness platform designed to be your definitive AI companion. Powered by **Llama-3.3 (Groq AI)**, it combines hyper-personalized nutrition planning, adaptive workouts, and real-time health insights into a seamless, aesthetically rich experience.

---

## 🌟 Premium Features

- 🤖 **Neural AI Coaching**: A 24/7 intelligent coach that understands context. Ask about injuries, plateaus, or dietary substitutions and get instant, science-backed guidance.
- 🥗 **Smart Meal Planner**: Generate comprehensive 7-day meal plans tailored to your exact macros, dietary restrictions, and cultural preferences. 
- 🏋️ **Adaptive Workout Architect**: Whether you have a full gym or just open floor space, FitGenix generates effective routines that maximize results based on your available equipment.
- ⚠️ **Daily Goal Danger Signs**: Stay on track with pulsing visual alerts ("Danger Signs") that trigger if your calorie, protein, or carb intake exceeds your daily limits.
- 📊 **Unified Health Dashboard**: A single source of truth for your fitness. Integrated tracking of planned vs. actual meals with deduplication and real-time progress bars.
- 🎥 **HD Form Tutorials**: Every exercise includes high-definition video guides to ensure safe lifting and maximum muscle engagement.
- 🦾 **Premium Aesthetics**: A state-of-the-art UI featuring glassmorphism, dynamic Framer Motion animations, and a sleek dark mode designed for the modern athlete.

---

## 🛠️ Tech Stack

### Frontend
- **React 19 (Vite)** — Blazing fast performance and modern component architecture.
- **Tailwind CSS** — Utility-first styling for a custom, premium look.
- **Framer Motion** — Production-ready animations and seamless transitions.
- **React Icons** — A comprehensive library for intuitive navigation.

### Backend
- **Node.js & Express.js** — Robust and scalable server logic.
- **MongoDB (Mongoose)** — Flexible, document-oriented database for complex user data.
- **Groq SDK (Llama-3.3)** — The engine behind our hyper-intelligent AI coaching and meal planning.
- **YouTube Search API** — Delivering real-time video form guides.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: A running instance or Atlas cluster
- **Groq API Key**: Obtain from the [Groq Console](https://console.groq.com/)

### 2. Installation

Clone the repository and install dependencies for both the frontend and backend.

```bash
# Clone the repository
git clone https://github.com/heyaryanmittal/FitGenix.git
cd FitGenix

# Install Frontend Dependencies
cd client
npm install

# Install Backend Dependencies
cd ../server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory and add your credentials:

```bash
# server/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_signing_secret_key
```

```bash
# client/.env
VITE_API_URL=Backend URL
```

### 4. Running Locally

You will need to run both the client and the server simultaneously.

**Start the Server:**
```bash
cd server
npm run dev
```

**Start the Client:**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📂 Project Architecture

```text
FitGenix/
├── client/             # Frontend React application (Vite)
│   ├── src/            # Core logic, components, and pages
│   ├── public/         # Static assets & user avatars
│   └── tailwind.config.js
├── server/             # Node.js Express backend
│   ├── index.js        # Main entry point & API routes
│   └── .env            # Backend configuration
├── vercel.json         # Deployment configuration for Vercel
└── README.md           # Project documentation
```

---

## ☁️ Deployment

FitGenix is optimized for **Vercel**. The root `vercel.json` ensures both the frontend and backend leverage Vercel's serverless infrastructure seamlessly.

1. Connect your repository to Vercel.
2. Add the environment variables (`MONGO_URI`, `GROQ_API_KEY`, etc.) in the Vercel Dashboard.
3. Deploy! Vercel handles the API routing and static building automatically.

---

<p align="center">
  Built for humans. Powered by AI. 🦾
</p>
