# 🎙️ Vocalize — AI Speech Processing Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%7C%20Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x%20%7C%20Vite%206-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20%7C%20TS-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage%20Builds-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![GCP](https://img.shields.io/badge/Google_Cloud-Cloud_Run%20%7C%20Docker-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-Automated%20CI%2FCD-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **Portfolio Verification Statement (CV Claim):**
> *"Architected and deployed an end-to-end full-stack web application designed to process and analyze audio data using third-party Speech-to-Text APIs. Built a responsive frontend with React (TypeScript) for seamless audio uploads and real-time result visualization. Deployed the backend infrastructure on GCP using Docker, establishing automated CI/CD pipelines to ensure continuous, zero-downtime deployments. Owned the entire lifecycle from UI/UX design to infrastructure monitoring."*

---

## 🌟 Executive Summary

**Vocalize** is a production-grade AI Speech-to-Text (STT) platform architected as a strict TypeScript monorepo. It empowers users to stream, ingest, analyze, and visualize high-resolution audio files (MP3, WAV, OGG, FLAC, M4A, AAC, WEBM) into synchronized, word-level transcripts with sub-second latency and acoustic confidence scoring.

The platform integrates directly with **Google Gemini Multimodal Audio AI** and **Groq Cloud Whisper-Large-v3** while offering a deterministic mock corpus fallback for zero-dependency offline portfolio demonstrations.

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

## ✨ Key Features & Technical Highlights

* **Multi-Engine AI STT Adapter**: Supports Google Gemini 3.6 Flash, Groq Whisper-Large-v3, and OpenAI Whisper with automated graceful fallback.
* **Interactive Word-Level Click-to-Seek**: Every transcribed word is timestamped to the millisecond. Clicking any word in the transcript instantly seeks the audio player to that exact moment.
* **Bidirectional Audio Synchronization**: Real-time word highlighting tracks spoken audio cadence during playback.
* **Acoustic Metrics & Insights**: Realtime Factor (RTF), Words Per Minute (WPM), audio duration, and confidence metrics display.
* **Multi-Format Subtitle Exporter**: Instant client-side generation and export to **Plain Text (.txt)**, **Structured Metadata (.json)**, **SubRip (.srt)**, and **WebVTT (.vtt)**.
* **Enterprise Security & Reliability**: Multi-stage Alpine containerization, non-root user execution, strict MIME whitelist validation, path traversal sanitization, and request ID tracing.

---

## 📁 Monorepo Layout

```
vocalize/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated lint, typecheck & Docker validation
│       └── deploy.yml           # Zero-downtime GCP Cloud Run CD pipeline
├── backend/
│   ├── src/
│   │   ├── controllers/         # HTTP request orchestration & response wrapping
│   │   ├── middlewares/         # Multer buffer, error handler, request logger
│   │   ├── routes/              # Express API route declarations
│   │   ├── services/            # STT engine adapters & storage management
│   │   ├── types/               # Strict DTO interfaces & API contracts
│   │   ├── utils/               # ApiError, leveled colorized logger, asyncHandler
│   │   └── app.ts               # Express application entrypoint
│   ├── Dockerfile               # Multi-stage production container build
│   └── tsconfig.json            # Strict TypeScript compiler options
├── frontend/
│   ├── src/
│   │   ├── components/          # DropZone, AudioPlayer, TranscriptViewer, Navbar
│   │   ├── hooks/               # useTranscription stateful custom hook
│   │   ├── services/            # Typed API client wrapper
│   │   ├── types/               # UI & DTO interfaces
│   │   ├── index.css            # Tailwind CSS v4 design tokens & glassmorphism
│   │   └── App.tsx              # Master view assembly
│   ├── nginx.conf               # Production Nginx reverse proxy & SPA router
│   ├── Dockerfile               # Multi-stage Nginx container build
│   └── vite.config.ts           # Vite 6 config with backend proxy
├── docker-compose.yml           # Unified multi-container orchestration
├── .env.example                 # Root configuration template
└── package.json                 # Monorepo root management scripts
```

---

## 🚀 Quickstart Guide

### Option 1: Docker Compose (Recommended for Production)

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/vocalize.git
cd vocalize

# 2. Configure environment (Optional: add your Gemini API Key)
cp .env.example .env

# 3. Build and launch all services
docker compose up --build -d

# 4. Open in browser:
# Frontend Web App: http://localhost:80 (or http://localhost:5173)
# Backend API Health: http://localhost:3001/health
```

To stop containers:
```bash
docker compose down
```

---

### Option 2: Local Development Setup

#### Prerequisites
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

```bash
# 1. Install all monorepo dependencies
npm run install:all

# 2. Start Backend (Terminal 1)
cd backend
npm run dev

# 3. Start Frontend (Terminal 2)
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 REST API Reference

### 1. Ingest Audio for Speech-to-Text
`POST /api/audio/transcribe`

**Headers:**
`Content-Type: multipart/form-data`

**Body:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `audio` | File (`.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, `.aac`, `.webm`) | Max size 50 MB |

**Example `curl` Request:**
```bash
curl -X POST http://localhost:3001/api/audio/transcribe \
  -F "audio=@sample_meeting.mp3;type=audio/mpeg"
```

**Response Payload (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "jobId": "f7d3a8e2-9b1c-4e8a-bf3d-2c7e1a9f0d4b",
    "status": "completed",
    "fileName": "f7d3a8e2-9b1c-4e8a-bf3d-2c7e1a9f0d4b.mp3",
    "originalFileName": "sample_meeting.mp3",
    "fileSize": 1245080,
    "mimeType": "audio/mpeg",
    "uploadedAt": "2026-09-05T12:00:00.000Z",
    "completedAt": "2026-09-05T12:00:02.340Z",
    "result": {
      "transcript": "Good morning everyone, let's get started with today's performance review.",
      "duration": 5.4,
      "language": "en",
      "model": "gemini-3.6-flash (Google AI Cloud)",
      "confidence": 0.98,
      "processingTimeMs": 2340,
      "segments": [
        {
          "id": 0,
          "startTime": 0.0,
          "endTime": 5.4,
          "text": "Good morning everyone, let's get started with today's performance review.",
          "confidence": 0.98,
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
    "timestamp": "2026-09-05T12:00:02.342Z",
    "processingTimeMs": 2340
  }
}
```

---

### 2. Supported Formats Inspection
`GET /api/audio/formats`

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    { "extension": ".mp3", "mimeType": "audio/mpeg", "category": "MPEG Audio Layer III" },
    { "extension": ".wav", "mimeType": "audio/wav", "category": "Waveform Audio File" },
    { "extension": ".ogg", "mimeType": "audio/ogg", "category": "Ogg Vorbis" },
    { "extension": ".flac", "mimeType": "audio/flac", "category": "Free Lossless Audio Codec" }
  ]
}
```

---

### 3. Service Healthcheck
`GET /health`

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "service": "vocalize-backend",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2026-09-05T12:00:00.000Z"
}
```

---

## ☁️ GCP Deployment & Zero-Downtime CI/CD

Vocalize implements an automated continuous delivery pipeline targeting **Google Cloud Run**:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Strict TypeScript type-checking across frontend and backend packages.
   - Production bundle validation (`tsc && vite build`).
   - Multi-stage Docker build testing via Docker Buildx.
2. **Continuous Deployment (`.github/workflows/deploy.yml`)**:
   - Secure token exchange via Google Workload Identity Federation / Service Account.
   - Pushes versioned container images to **Google Artifact Registry (GAR)**.
   - Executes zero-downtime rolling deployments on **Cloud Run** with automated healthcheck validation and traffic splitting.

---

## 🛡️ Security & Quality Standards

- **Principle of Least Privilege**: Containers run with non-root `nodejs` users.
- **Path Traversal Protection**: Uploaded file paths are resolved and validated against absolute base directory boundaries.
- **Strict Content Validation**: Multi-layer MIME type inspection prevents arbitrary payload execution.
- **Structured Error Handling**: Custom `ApiError` factory classes prevent sensitive stack trace leakage in production.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
