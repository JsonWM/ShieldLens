# ShieldLens

ShieldLens is a real-time web application built as a Social Impact Platform to protect people from deceptive printed scams and dangerous digital links. By evaluating uploaded images or direct text links, **the app detects deceptive manipulation tactics used by scammers and alerts the user with an instant safety rating before they open a website.**

---

## Features

- **Dual Input Processing:** You can click to upload an image, drag and drop an asset, or directly paste a text URL link using `Ctrl + V`.
- **Local QR Decoder:** Implements a fast, localized computer vision script to read physical barcodes and QR codes from pictures before running AI analysis.
- **Behavioral & Phishing Analysis:** Evaluates layout anomalies, brand impersonation, and common social engineering techniques.

---

## Project Architecture

This application is built as a single repository containing separate directories for the frontend client and the AI backend microservice.

```text
ShieldLens/
├── backend/                  # Python API Service
│   ├── main.py              # FastAPI endpoints & Gemini AI logic
│   └── requirements.txt     # Python backend dependencies
└── frontend/                 # Decoupled Web Workspace
    ├── app/                 # Next.js 15 pages and global styles
    └── components/          # Reusable TypeScript UI components
```

### Technologies Used
- **Frontend Framework:** Next.js 15 (React 19) with strict TypeScript typing schemas. No heavy external CSS libraries.
- **Backend API:** FastAPI (Python 3.11+) implementing async cross-origin network operations.
- **Artificial Intelligence Engine:** Google Gemini 2.5 Flash API configured with low-temperature deterministic settings to maximize consistent answers.
- **Computer Vision Mapping:** QReader + Open-CV Headless for offline QR tracking and code extraction.

---

## The Problem & Our Value

In the digital world, scammers constantly use deceptive links on social media and messaging apps to trick users into fake payment zones. At the same time, physical spaces have become a dangerous blind spot for traditional cybersecurity software, where fraudsters place fake utility notices on walls, printed parking fines on cars, and untraceable QR codes on public chargers to execute credit card or login credentials theft.

---

## How to Run the Project Local Suite

### Prerequisites
- Node.js (v18 or higher installed)
- Python (v3.10 or higher installed)
- A valid Google Gemini API Key

### 1. Initalize Python Backend Service Core
```bash
# Navigate to the python server location
cd backend

# Install the localized operational system dependencies
pip install -r requirements.txt

# Inject your secure development credentials token environment variable
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# Spin up the automatic reloading pipeline microservice on local port 8000
python main.py
```

### 2. Initalize the Next.js Frontend Framework Client
```bash
# Move backwards and navigate to the client container
cd ../frontend

# Restore compilation dependency trees
npm install

# Start the Node hot-reloading dashboard stream channel on local port 3000
npm run dev
```
Open your destination browser to `http://localhost:3000` to interact with your local sandbox suite.

---

## Future Roadmap
- **Video Verification Layer:** Add a video verification module to support short video analysis, training the AI engine to evaluate suspicious video claims, deceptive demonstrations, or potential deepfakes to tell users if the content is likely true or fraudulent.