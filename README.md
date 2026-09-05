# 🎙️ Vocalize — AI Speech Processing Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%7C%20Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x%20%7C%20Vite%206-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20%7C%20TS-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-e7048f?logo=framer&logoColor=white)](https://framer.com/motion)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage%20Builds-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Cloud_Run%20%7C%20Docker-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **Production-Grade Speech Processing Platform**  
> An end-to-end full-stack web application designed for high-precision audio ingestion, speech-to-text (STT) neural transcription, interactive word-level audio-text synchronization, and multi-format subtitle exports. Built with a clean light-mode dashboard interface, Framer Motion UI animations, and automated multi-provider AI adapters (Google Gemini 3.6 Flash & Whisper-Large-v3).

---

## 📸 Interface Preview & Design System

Vocalize features a state-of-the-art **Light Mode Medical/Dashboard Design System** with custom pastel color tokens, soft container shadows (`dash-card`), rounded contours (`rounded-2xl`), interactive audio waveforms, and responsive 75% desktop viewport scaling.

- **Header Bar**: Displays real-time API status, Whisper model badge, Google AI Cloud pill, System Architecture modal launcher, and User profile avatar.
- **Dynamic Workflow Engine**: Features drag-and-drop file ingestion, pre-loaded sample audio presets, live inference pipeline step indicators with Skeleton Shimmer loaders, metric summary cards, and click-to-seek verbatim transcript synchronization.

---

## ✨ Key Features

### 🎙️ Speech-to-Text Ingestion & Processing
- **Multi-Format Ingestion**: Supports `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, `.aac`, and `.webm` up to 50MB with instant MIME & extension validation.
- **Built-in Sample Presets**: Instant pre-stored demonstration audio presets (**Tech Meeting**, **AI Podcast**, **Voice Memo**) for zero-latency offline testing.
- **Multi-Provider AI STT Adapters**: Automatically uses **Google Gemini 3.6 Flash Multimodal Audio API**, **Groq Cloud Whisper-Large-v3**, or **OpenAI Whisper-1** based on environment API key availability, with deterministic mock corpus fallbacks.

### ⏱️ Word-Level Audio & Text Synchronization
- **Interactive Click-to-Seek**: Every word in the transcript is timestamped to the millisecond. Clicking any word in the transcript jumps audio playback directly to that exact millisecond.
- **Live Active Word Highlighting**: Audio playback highlights spoken words in real time with high-visibility sage-green accents.
- **Interactive Audio Waveform Visualizer**: Real-time canvas waveform scrubber with play/pause controls, speed selectors (`0.5x`, `1x`, `1.5x`, `2x`), and optional AI Voice synthesis.

### 📊 Performance Metrics & Export Capabilities
- **Metric Insights**: Real-time Words Per Minute (WPM) cadence, processing latency (ms), Realtime Factor (e.g. `20.3x Realtime`), and acoustic confidence scoring (`99.0%`).
- **Multi-Format Subtitle Exporter**: Instant client-side download to **Plain Text (.txt)**, **Structured JSON (.json)**, **SubRip Subtitles (.srt)**, and **WebVTT Subtitles (.vtt)**.
- **Search & Filter**: Real-time transcript word/phrase search with matching highlighting.

### 🎨 Animations & UX Polish
- **Framer Motion Integration**: Smooth staggered entrance animations for metrics cards, hero banners, and active state transitions.
- **Skeleton Shimmer Placeholders**: Animated shimmer loaders while speech-to-text inference runs.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript 5.x** | Strict-typed component-driven single page application |
| **Build Tool & HMR** | **Vite 6** | Fast bundler with dev server proxying |
| **Styling & CSS** | **Tailwind CSS v4** + **Vanilla CSS** | Custom design tokens, glassmorphism, and responsive layout |
| **Animations** | **Framer Motion 12** | Fluid layout transitions, staggered cards, and shimmers |
| **Icons & UI Utilities** | **Lucide React** + **Clerk React** | Clean UI icons & user avatar integration |
| **Backend Runtime** | **Node.js 20+** + **Express.js** | TypeScript REST API backend |
| **File Handling** | **Multer** | Multipart form-data audio streaming & buffer security |
| **AI STT Services** | **Google Gemini 3.6 Flash** & **Whisper** | Google AI Studio REST API & Groq Cloud LPU integration |
| **Containerization** | **Docker** + **Docker Compose** | Multi-stage Alpine containerization & local orchestration |
| **Deployment** | **Google Cloud Run** | Zero-downtime containerized cloud deployment |

---

## 🏗️ System Architecture

```
                                  VOCALIZE ARCHITECTURE TOPOLOGY
                                  
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │                               CLIENT TIER (React 19 + TypeScript)                      │
  │                                                                                        │
  │   ┌─────────────────────┐   ┌──────────────────────┐   ┌───────────────────────────┐   │
  │   │  DropZone Uploader  │   │ Interactive Waveform │   │ Word-Level Click-to-Seek  │   │
  │   │ (MIME & Size Guard) │   │ (AudioContext Canvas)│   │  (SRT / VTT / JSON Export)│   │
  │   └──────────┬──────────┘   └──────────▲───────────┘   └─────────────▲─────────────┘   │
  └──────────────┼─────────────────────────┼─────────────────────────────┼─────────────────┘
                 │ multipart/form-data     │                             │
                 ▼                         │                             │
  ┌────────────────────────────────────────┼─────────────────────────────┼─────────────────┐
  │                               API GATEWAY TIER (Express + TypeScript)                  │
  │                                                                                        │
  │   ┌──────────────────────┐   ┌─────────────────────┐   ┌───────────────────────────┐   │
  │   │ Multer Stream Buffer │──>│ Path Sanitization   │──>│ Global Error & Log Tracer │   │
  │   │ (MIME Whitelist Guard)   │ (Directory Security)│   │ (X-Request-Id Stamping)   │   │
  │   └──────────────────────┘   └──────────┬──────────┘   └───────────────────────────┘   │
  └─────────────────────────────────────────┼──────────────────────────────────────────────┘
                                            ▼
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │                            SPEECH-TO-TEXT ENGINE ADAPTER TIER                          │
  │                                                                                        │
  │   ┌───────────────────────────┐   ┌───────────────────────────┐   ┌────────────────┐   │
  │   │ Google Gemini 3.6 Flash   │   │ Groq Cloud Whisper-Large  │   │ Built-in Mock  │   │
  │   │ (Multimodal Audio API)    │   │ (OpenAI Protocol / LPU)   │   │ Corpus Engine  │   │
  │   └───────────────────────────┘   └───────────────────────────┘   └────────────────┘   │
  └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
vocalize/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated TypeScript typecheck & Docker validation
│       └── deploy.yml           # Zero-downtime GCP Cloud Run continuous deployment
├── backend/
│   ├── src/
│   │   ├── controllers/         # Audio upload & health endpoints
│   │   ├── middlewares/         # Multer stream guard, logger & error handler
│   │   ├── routes/              # Express API routing (/api/audio)
│   │   ├── services/            # Multimodal AI speech adapters & storage cleanup
│   │   ├── types/               # Strict DTO interfaces
│   │   └── app.ts               # Express entrypoint & server setup
│   ├── Dockerfile               # Production multi-stage Alpine build
│   └── tsconfig.json            # Strict TypeScript configuration
├── frontend/
│   ├── src/
│   │   ├── components/          # DropZone, AudioPlayer, TranscriptViewer, ResultMetadata
│   │   ├── hooks/               # useTranscription custom workflow hook
│   │   ├── services/            # Axios/Fetch API client layer
│   │   ├── utils/               # Audio wave generator & export formatters
│   │   ├── index.css            # Custom CSS Tokens & 75% body scaling
│   │   └── App.tsx              # Main dashboard application layout
│   ├── Dockerfile               # Multi-stage Nginx container build
│   └── vite.config.ts           # Vite 6 dev proxy configuration
├── docker-compose.yml           # Multi-container orchestration
├── .env.example                 # Environment configuration template
├── README.md                    # Project documentation
└── package.json                 # Monorepo root script definitions
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: `>= 20.0.0`
- **npm**: `>= 10.0.0`
- **Docker & Docker Compose**: (Optional, for containerized run)

---

### Option 1: Quickstart with Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/vocalize.git
   cd vocalize
   ```

2. **Set up Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   *(Optional: Open `.env` and add your `GEMINI_API_KEY` for live speech recognition)*

3. **Launch with Docker Compose:**
   ```bash
   docker compose up --build -d
   ```

4. **Access the Application:**
   - **Frontend App**: `http://localhost:80` (or `http://localhost:5173`)
   - **Backend API Health**: `http://localhost:3001/health`

5. **Stop Containers:**
   ```bash
   docker compose down
   ```

---

### Option 2: Local Development Setup

1. **Clone & Install Dependencies:**
   ```bash
   git clone https://github.com/your-username/vocalize.git
   cd vocalize
   npm run install:all
   ```

2. **Configure Environment File:**
   Copy `.env.example` into `backend/.env`:
   ```bash
   cp .env.example backend/.env
   ```

3. **Start Backend Server (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   *The Express server will start at `http://localhost:3001`.*

4. **Start Frontend App (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   *Vite will start the dev server at `http://localhost:5173`.*

5. **Open Browser:**
   Navigate to `http://localhost:5173` to test the application.

---

## 🔑 Environment Variables Configuration

Create a `.env` file in the `backend/` directory or root folder:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Optional AI Speech-to-Text API Keys (Automated Fallback to Mock Engine if empty)
GEMINI_API_KEY=your_google_gemini_api_key_here
GROQ_API_KEY=your_groq_whisper_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Storage & Upload Guards
MAX_FILE_SIZE_MB=50
UPLOAD_DIR=uploads
```

> **Note:** If no API keys are provided, Vocalize automatically falls back to its deterministic pre-stored corpus engine so that all audio presets and testing work completely offline out of the box!

---

## 📡 REST API Specifications

### `POST /api/audio/transcribe`
Ingests an audio file, executes neural STT inference, and returns verbatim timestamped segments.

- **Headers**: `Content-Type: multipart/form-data`
- **Body**: `audio` (File binary - `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, `.aac`, `.webm`, max 50MB)

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "jobId": "c6162543-dfb2-4b5f-80d4-e78ae5b6a271",
    "status": "completed",
    "originalFileName": "tech_meeting.wav",
    "fileSize": 1245080,
    "completedAt": "2026-09-05T14:02:52.221Z",
    "result": {
      "transcript": "Good morning everyone, let's get started with today's performance review...",
      "duration": 37.8,
      "wordCount": 107,
      "language": "en-US",
      "model": "vocalize-business-v2",
      "confidence": 0.995,
      "processingTimeMs": 1866,
      "segments": [
        {
          "id": 0,
          "startTime": 0.0,
          "endTime": 4.5,
          "text": "Good morning everyone, let's get started with today's quarterly performance review.",
          "confidence": 0.99,
          "words": [
            { "word": "Good", "startTime": 0.0, "endTime": 0.3, "confidence": 0.99 },
            { "word": "morning", "startTime": 0.35, "endTime": 0.8, "confidence": 0.98 }
          ]
        }
      ]
    }
  },
  "meta": {
    "requestId": "9c1b4e2f-5a8d-4f7b-bc3e-1a8e2d4c7f0b",
    "timestamp": "2026-09-05T14:02:52.223Z",
    "processingTimeMs": 1866
  }
}
```

---

## 🛡️ Security & Quality Standards

- **Strict MIME & Extension Whitelist**: Multer and frontend guards validate payload signatures to prevent executable uploads.
- **Path Traversal Protection**: Uploaded file paths are resolved securely against boundary directories before deletion.
- **Container Least Privilege**: Multi-stage Docker builds run under unprivileged `nodejs` non-root users.
- **Zero-Downtime Deployment**: Configured for GitHub Actions CI/CD to Google Cloud Run with rolling traffic splits and health checks.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">Crafted with ❤️ for High-Precision Speech Processing</p>
