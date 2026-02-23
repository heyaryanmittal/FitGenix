# ⚡ FitGenix — AI-Powered Fitness Ecosystem

FitGenix is a state-of-the-art MERN stack application designed to be your definitive AI fitness companion. Leveraging the power of **Groq AI (Llama 3)**, it delivers hyper-personalized workout plans, real-time diet analysis, and an intelligent fitness concierge.

---

## 🌟 Key Features

- 🤖 **AI Fitness Concierge**: A personalized chatbot trained for fitness advice, providing instant answers to your health queries.
- 🏋️ **Dynamic Workout Architect**: Generate comprehensive exercise routines with step-by-step guides and integrated YouTube video demonstrations.
- 🍎 **Intelligent Diet Analyst**: Real-time analysis of nutritional content and caloric intake to keep your nutrition on track.
- 📊 **Performance Dashboard**: Visually stunning tracking of daily activity, weekly progress, and goal achievement through interactive charts.
- 🌓 **Adaptive UI**: Premium design system featuring high-contrast dark mode and fluid animations powered by Framer Motion.
- 🔒 **Secure Auth Ecosystem**: Robust JWT-based authentication for a personalized and private fitness journey.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Routing**: React Router 7

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Groq SDK (Llama 3)
- **Video API**: YouTube Search API

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: A running instance or Atlas cluster
- **Groq API Key**: Obtain from [Groq Console](https://console.groq.com/)

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/FitGenix.git
cd FitGenix

# Install Dependencies
# Root dependencies (if any)
npm install

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Navigate to the `server` directory and create a `.env` file (use `.env.example` as a template):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

### 4. Running the Application

| Service | Command | URL |
| :--- | :--- | :--- |
| **Backend** | `npm run dev` | `http://localhost:5000` |
| **Frontend** | `npm run dev` | `http://localhost:5173` |

---

## 📂 Project Structure

```text
FitGenix/
├── client/             # Frontend React application
│   ├── src/            # Components, Hooks, Context, Pages
│   └── public/         # Static assets
├── server/             # Node.js Express backend
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── index.js        # Server entry point
└── README.md           # Documentation
```

---

## ☁️ Deployment

### Vercel (Recommended)
This project is configured for seamless deployment on Vercel:

1. **Connect your GitHub** repo to Vercel.
2. **Setup Project**:
   - Vercel will automatically detect the root `vercel.json`.
   - Ensure the **Root Directory** is set to the project root (not `/client` or `/server`).
3. **Environment Variables**:
   - Add `MONGO_URI`, `GROQ_API_KEY`, `GROQ_API_KEY_BACKUP1`, and `GROQ_API_KEY_BACKUP2` in the Vercel Dashboard under **Project Settings > Environment Variables**.
4. **Deploy**: Hit deploy! The frontend and backend will be served from the same domain.

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the Fitness Community
</p>
