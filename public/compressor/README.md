# Mehedi Hasan Shihab Image & Audio Converter

A powerful, lightning-fast, and entirely client-side image and audio compression/conversion tool built with privacy, performance, and sleek UI in mind.

## 🌟 Features

### 🖼️ Image Processing
- **100% Local & Private:** Everything happens directly in your browser. No files are ever uploaded to an external server.
- **Format Conversion:** Seamlessly convert between `JPEG`, `PNG`, and `WebP` formats.
- **Real-time Quality Adjustment:** Use the interactive range slider to adjust compression quality (0-100%) and instantly see the estimated output file size.
- **Smart Resizing:** Optional feature to automatically scale down massive 8K images (capping at a maximum of 2000px) to prevent browser freezing or lagging.
- **Transparency Handling:** Intelligently adds a solid white background when converting transparent PNGs to JPEGs to prevent ugly black artifacts.
- **EXIF Data Stripping:** Automatically removes metadata (like GPS location, date taken, and camera models) during the conversion process for enhanced privacy.

### 🎵 Audio Processing (New Engine)
- **High-Performance Audio Engine:** Uses `FFmpeg WebAssembly` to process massive audio files up to 200MB entirely locally without relying on Cloud services.
- **Broad Format Support:** Converts robustly between `MP3`, `WAV`, `AAC`, `OGG`, and supports parsing `.m4a` and `video/mp4` extracts.
- **Advanced Compression Controls:** 
  - Target specific Bitrates (64k to 320k)
  - Variable Bitrate Quality Scaling (Qscale 0-9)
  - Channel downmixing (Stereo to Mono)
  - Sample Rate modifications
- **Visual Audio Trimming:** Features a fully interactive visual audio waveform (powered by `WaveSurfer.js`) letting you define precise Start and End times for your cuts.
- **Asynchronous Processing:** Built on a completely unblocking worker-based architecture, ensuring the UI remains buttery smooth while churning through gigabytes of data.

## ⚙️ How It Works (The Mechanism)

### 📸 The Image Mechanism
This application leverages modern HTML5 APIs to perform image manipulation entirely in memory without a backend:
1. **File Ingestion:** The `FileReader` API reads the file directly into the browser's memory and generates a temporary Blob URL.
2. **The Canvas Engine:** An invisible `<canvas>` element is dynamically created. The uploaded image is then "painted" onto this canvas using the 2D Context API (`ctx.drawImage`). This step naturally strips out all embedded EXIF metadata.
3. **Format & Compression:** The core conversion happens via the native `canvas.toBlob()` method, which encodes the canvas pixel data into the selected MIME format and applies the chosen compression ratio.

### 🎧 The Audio Mechanism (FFmpeg.wasm)
The audio tool bypasses standard browser limitations by embedding a full C-compiled application directly into JavaScript:
1. **Local WebAssembly Engine:** The project ships with its own offline `ffmpeg-core.wasm` binary. By keeping these heavy 25MB core files local, it avoids strict modern CORS and `Cross-Origin-Embedder-Policy` (COEP) blocks inherent to CDNs.
2. **The Worker Bridge:** When audio is uploaded, the script spawns a Background Web Worker using `createFFmpeg()`. This offloads all heavy CPU instruction sets out of the Main UI Thread.
3. **Virtual File System (FS):** The uploaded audio is temporarily written into the browser's emulated file system memory (`Mehedi_ffmpegInstance.FS('writeFile')`).
4. **Command Execution:** Based on user settings from the Options Modal, an array of native FFmpeg command-line arguments (like `-ss`, `-b:a`, `-q:a`) is constructed and executed seamlessly via `await ffmpeg.run()`.
5. **Memory Optimization:** Once the output blob is generated using `URL.createObjectURL()`, the virtual FS files are immediately unlinked/deleted to prevent RAM memory leaks during continuous bulk conversions.

## 🔒 Required Server Configuration
To allow `SharedArrayBuffer` threading for the FFmpeg engine, this project includes an `.htaccess` file configured with modern security headers:
```apache
Header set Cross-Origin-Embedder-Policy "credentialless"
Header set Cross-Origin-Opener-Policy "same-origin"
AddType application/wasm .wasm
```
*Note: This must be hosted on a local web server (like XAMPP, WAMP, or Live Server) for the WebAssembly and security headers to activate properly.*

## 👨‍💻 Author Details
Designed and Developed by **Mehedi Hasan Shihab**  
GitHub: [@sshihabb007](https://github.com/sshihabb007)
