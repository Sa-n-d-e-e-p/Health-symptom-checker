# Healthcare Symptom Checker (AI-Powered)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=google&logoColor=white)

A modern, full-stack web application that uses Google's latest Gemini AI models to analyze user symptoms and provide structured educational insights, likely conditions, and recommended next steps.

## ✨ Features

- **Advanced AI Integration**: Powered by Google's `google-genai` SDK and the `gemini-pro`/`gemini-1.5-flash` models.
- **Dynamic Frontend**: A beautiful responsive UI built with React, TailwindCSS, and Framer Motion micro-animations.
- **Robust Async Backend**: Powered by FastAPI, ensuring lightning-fast non-blocking API endpoints.
- **Persisted History**: Saves symptom checks securely to your MongoDB Atlas cluster using `motor` asyncio drivers.
- **Mac-Native Fixes**: Bypasses strict macOS python SSL certificate limitations automatically using `certifi`.

## 📂 Project Structure

```
Healthcare-Symptom-Checker-main/
├── backend/
│   ├── main.py / server.py     # FastAPI application entrypoint
│   ├── requirements.txt        # Python dependencies
│   └── tests/                  # Pytest automated test suite
└── frontend/
    ├── public/                 # Static assets (favicons, manifest.json)
    ├── src/                    # React frontend source code
    │   ├── pages/              # Primary route views (SymptomChecker, History)
    │   ├── App.js              # Application router
    │   └── index.css           # Tailwind configuration and globals
    ├── package.json            # Node dependencies
    └── tailwind.config.js      # Utility styling configuration
```

## 🛠️ Step-by-Step Setup Instructions

Before you begin, ensure you have **Node.js (v18+)** and **Python (v3.10+)** installed.

### 1. Database & Cloud Services
You will need two pieces of credentials to run this application:

1. **Google Gemini API Key**: Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey). It will start with either `AIzaSy` or `AQ.`.
2. **MongoDB Atlas Connection**: Get your connection string from MongoDB Atlas. Be sure to whitelist your IP (`0.0.0.0/0`) in the Atlas **Network Access** tab otherwise your connection will time out.

### 2. Start the Backend Server (Terminal 1)

Navigate to the backend directory and activate an isolated Python environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Export your required environment variables:
```bash
export GEMINI_API_KEY="your_actual_key_here"
export MONGO_URL="mongodb+srv://..."
export DB_NAME="healthcare"
```

Start the FastAPI application:
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```
*Note: The backend runs natively on `http://localhost:8000`. You can visit `http://localhost:8000/docs` to see the auto-generated Swagger UI for testing API endpoints.*

### 3. Start the Frontend Application (Terminal 2)

Open a new terminal window, navigate to the frontend directory, and run the React app:
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```
*Note: We recommend tracking `--legacy-peer-deps` due to the strict dependency resolutions required by `ajv` and some of the older charting libraries.*

Navigate to **[http://localhost:3000](http://localhost:3000)** in your browser to view the application!

---

## 🛑 Common Troubleshooting

- **500 Internal Server Error (SSL Certificate Failed):** If you are running Python downloaded from Python.org on a Mac, you may see a MongoDB timeout due to SSL certificates. This app utilizes `tlsCAFile=certifi.where()` to bypass this, but be sure you successfully ran `pip install certifi`.
- **404 Model Not Found:** If your API key begins with `AQ.`, make sure you are using the `google-genai` package and not the deprecated `google-generativeai` package.
- **Frontend Appears Blank or Fails to Fetch:** If `npm start` succeeds but no requests reach the backend, verify your frontend environment variables. The app automatically falls back to `http://localhost:8000/api` if a `.env` file does not set `REACT_APP_BACKEND_URL`.

## 📜 Disclaimer
*This tool is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.*
