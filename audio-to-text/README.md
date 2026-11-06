# ScribeAI - Browser-Based Transcription Tool

ScribeAI is a modern, high-performance, browser-based Speech-to-Text (STT) transcription application developed by **Mehedi Hasan shihab** ([Website](https://sshihabb007.github.io/)). It empowers users to transcribe massive audio files seamlessly right inside their web browser, utilizing state-of-the-art Cloud APIs and WebGPU acceleration.

![ScribeAI Interface](https://raw.githubusercontent.com/sshihabb007/STT/main/screenshot.png) *(Add a screenshot here if desired)*

## ✨ Key Features

1. **Multi-Engine Transcription Pipeline**
   - **Gemini 2.5 Flash-Lite Integration:** Uses Google's advanced multimodal Resumable Upload APIs. This allows ScribeAI to process incredibly large audio files (like 60-minute songs) perfectly, leveraging Gemini's massive context window to deliver unparalleled accuracy, even with complex background music.
   - **Groq Whisper V3 Turbo:** Connects directly to Groq's LPU hardware to provide lightning-fast, near-instantaneous transcription for audio files under 25MB.
   - **Local Browser AI:** A fully private, offline fallback that runs the `onnx-community/whisper-base.en` model directly inside your browser using WebAssembly and WebGPU. Absolutely zero data is sent to the cloud when this mode is active.

2. **Smart Audio Handling**
   - Implements native HTML5 `AudioContext` to automatically decode, resample (to 16kHz mono), and format the audio data into `Float32Array` buffers required by local AI pipelines.
   - Bypasses traditional HTTP limits for Cloud APIs by using Google's `upload/v1beta/files` Resumable Upload protocol.

3. **Multi-Threaded Architecture**
   - All local AI operations are offloaded to a dedicated Web Worker (`mehedi_worker.js`). This guarantees that the main UI never freezes or stutters during heavy computational loads (e.g., when the GPU is inferencing).

4. **Sleek UI/UX**
   - Built with modern Tailwind CSS featuring a sleek, dark-themed "Command Center" aesthetic.
   - Live progress bars indicating chunking, downloading, and generation states.
   - Secure `localStorage` integration for safely storing your API keys locally on your device.

## 🚀 How to Use

1. **Clone or Host the App:** Open `index.html` in your browser (preferably via a local server like XAMPP, Live Server, or hosted on GitHub Pages).
2. **Open Settings:** Click the **⚙️ Settings** button in the top right corner.
3. **Configure your AI Engine:**
   - Select your preferred engine (Local, Gemini, or Groq).
   - If using a Cloud API, paste your API Key. It will be saved securely to your browser's local storage.
4. **Drag & Drop:** Drop any `mp3`, `wav`, or `m4a` file into the upload zone.
5. **Get Text:** The progress bar will guide you through the process. Once finished, click the **Copy Text** button to grab your transcript!

## 🛠️ Mechanisms & Tech Stack

- **Frontend:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript.
- **Local AI:** Hugging Face `Transformers.js` v3 (`@huggingface/transformers`).
- **Cloud APIs:** Google AI Studio REST API (`generativelanguage.googleapis.com`), Groq REST API (`api.groq.com`).
- **File System:** No backend required! Entirely client-side execution using File API and FormData.

## 📝 Author Nomenclature

This project strictly adheres to a unique naming convention across all class names, IDs, variables, and functions using the author's handle: `shihab`, `mehedi`, and `sshihabb007` to ensure distinct namespace isolation.

---
*Created by [Mehedi Hasan shihab](https://sshihabb007.github.io/)*
