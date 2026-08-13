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
cd frontend
npm install

# Install Backend Dependencies
cd ../backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory and add your credentials:

```bash
# backend/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
GROQ_API_KEY_BACKUP1=your_backup_api_key_1  # optional
GROQ_API_KEY_BACKUP2=your_backup_api_key_2  # optional
JWT_SECRET=your_jwt_signing_secret_key
```

Create a `.env` file in the `frontend` directory:

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000
```

### 4. Running Locally

You will need to run both the frontend and the backend simultaneously.

**Start the Backend:**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📂 Project Architecture

```text
FitGenix/
├── frontend/           # Frontend React application (Vite)
│   ├── src/            # Components, pages, & API configuration
│   ├── public/         # Static assets & user avatars
│   ├── vercel.json     # Vercel SPA rewrite rules
│   └── package.json
├── backend/            # Node.js Express backend API
│   ├── index.js        # Main entry point, DB connection & API routes
│   ├── vercel.json     # Vercel serverless routing
│   └── package.json
├── .gitignore          # Root Git ignore rules
└── README.md           # Project documentation
```

---

## ☁️ Separate Deployment on Vercel

FitGenix is designed for separate standalone deployments of the **`backend`** and **`frontend`** folders on Vercel.

### Step 1: Deploy Backend to Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" > "Project"**.
2. Import your GitHub repository (`heyaryanmittal/FitGenix`).
3. In the project setup panel:
   - **Project Name**: `fitgenix-backend` (or your preferred name)
   - **Root Directory**: Click **Edit** and select **`backend`**.
   - **Framework Preset**: Select **Other**.
4. Expand **Environment Variables** and add:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `GROQ_API_KEY`: Your Groq API Key.
   - `JWT_SECRET`: A secure random secret string for JWT authentication.
5. Click **Deploy**.
6. Once deployed, copy your Backend Vercel URL (e.g., `https://fitgenix-backend.vercel.app`).

### Step 2: Deploy Frontend to Vercel

1. Return to the Vercel Dashboard and click **"Add New" > "Project"**.
2. Import the same GitHub repository (`heyaryanmittal/FitGenix`).
3. In the project setup panel:
   - **Project Name**: `fitgenix-frontend` (or your preferred name)
   - **Root Directory**: Click **Edit** and select **`frontend`**.
   - **Framework Preset**: Select **Vite** (detected automatically).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: Set to your deployed backend URL from Step 1 (e.g., `https://fitgenix-backend.vercel.app`).
5. Click **Deploy**.

---

<p align="center">
  Built for humans. Powered by AI. 🦾
</p>
