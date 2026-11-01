// Author: Mehedi Hasan shihab

const shihab_worker = new Worker(new URL('./mehedi_worker.js', import.meta.url), { type: 'module' });
const mehedi_audio_input = document.getElementById('mehedi_audio_input');
const sshihabb007_transcript_content = document.getElementById('mehedi_transcript_content');
const shihab_drop_zone = document.getElementById('shihab_drop_zone');
const mehedi_status_panel = document.getElementById('sshihabb007_status_panel');
const sshihabb007_copy_btn = document.getElementById('sshihabb007_copy_btn');

// Settings UI Elements
const shihab_settings_btn = document.getElementById('shihab_settings_btn');
const shihab_settings_modal = document.getElementById('shihab_settings_modal');
const shihab_close_settings = document.getElementById('shihab_close_settings');
const shihab_save_settings = document.getElementById('shihab_save_settings');
const shihab_engine_select = document.getElementById('shihab_engine_select');
const shihab_gemini_key = document.getElementById('shihab_gemini_key');
const shihab_groq_key = document.getElementById('shihab_groq_key');

// Load Settings
const savedEngine = localStorage.getItem('shihab_engine') || 'gemini';
shihab_engine_select.value = savedEngine;
shihab_gemini_key.value = localStorage.getItem('shihab_gemini_key') || '';
shihab_groq_key.value = localStorage.getItem('shihab_groq_key') || '';

// Settings Event Listeners
shihab_settings_btn.addEventListener('click', () => shihab_settings_modal.classList.remove('hidden'));
shihab_close_settings.addEventListener('click', () => shihab_settings_modal.classList.add('hidden'));
shihab_save_settings.addEventListener('click', () => {
    localStorage.setItem('shihab_engine', shihab_engine_select.value);
    localStorage.setItem('shihab_gemini_key', shihab_gemini_key.value);
    localStorage.setItem('shihab_groq_key', shihab_groq_key.value);
    shihab_settings_modal.classList.add('hidden');
});

// 1. Handle File Upload
mehedi_audio_input.onchange = async (shihab_event) => {
    const mehedi_file = shihab_event.target.files[0];
    if (!mehedi_file) return;
    sshihabb007_handleFile(mehedi_file);
};

shihab_drop_zone.addEventListener('click', function shihab_triggerClick() {
    mehedi_audio_input.click();
});

shihab_drop_zone.addEventListener('dragover', function mehedi_dragOver(sshihabb007_e) {
    sshihabb007_e.preventDefault();
});

shihab_drop_zone.addEventListener('drop', async function sshihabb007_drop(shihab_e) {
    shihab_e.preventDefault();
    const mehedi_dropped_file = shihab_e.dataTransfer.files[0];
    if (!mehedi_dropped_file) return;
    sshihabb007_handleFile(mehedi_dropped_file);
});

async function sshihabb007_handleFile(file) {
    sshihabb007_showStatus();
    const selectedEngine = localStorage.getItem('shihab_engine') || 'local';
    
    if (selectedEngine === 'local') {
        const shihab_audioData = await mehedi_parseAudio(file);
        shihab_worker.postMessage({ sshihabb007_audio: shihab_audioData });
    } else if (selectedEngine === 'gemini') {
        mehedi_processGemini(file);
    } else if (selectedEngine === 'groq') {
        mehedi_processGroq(file);
    }
}

function sshihabb007_showStatus() {
    mehedi_status_panel.classList.remove('hidden');
    sshihabb007_transcript_content.innerHTML = '';
    document.getElementById('sshihabb007_progress_bar').style.width = `0%`;
    document.getElementById('mehedi_progress_percent').innerText = `0%`;
}

function shihab_updateProgressBar(shihab_p) {
    if (!shihab_p) return;
    
    // shihab_p looks like { status: 'progress', file: 'model.onnx', progress: 50 }
    // or { status: 'initiate', file: 'model.onnx' }, { status: 'done', file: '...' }
    const statusTextElement = document.getElementById('shihab_status_text');
    const progressBarElement = document.getElementById('sshihabb007_progress_bar');
    const progressPercentElement = document.getElementById('mehedi_progress_percent');

    if (shihab_p.status === 'initiate' || shihab_p.status === 'download') {
        statusTextElement.innerText = `Downloading ${shihab_p.file || 'model files'}...`;
    } else if (shihab_p.status === 'progress') {
        statusTextElement.innerText = `Downloading ${shihab_p.file || 'model files'}...`;
        const sshihabb007_percent = Math.round(shihab_p.progress || 0);
        progressBarElement.style.width = `${sshihabb007_percent}%`;
        progressPercentElement.innerText = `${sshihabb007_percent}%`;
    } else if (shihab_p.status === 'done') {
        progressBarElement.style.width = `100%`;
        progressPercentElement.innerText = `100%`;
    } else if (shihab_p.status === 'ready') {
        statusTextElement.innerText = `Model loaded! Preparing for transcription...`;
    } else if (shihab_p.status === 'transcribing') {
        statusTextElement.innerText = `Transcribing audio...`;
        const sshihabb007_percent = Math.round(shihab_p.progress || 0);
        progressBarElement.style.width = `${sshihabb007_percent}%`;
        progressPercentElement.innerText = `${sshihabb007_percent}%`;
        progressBarElement.classList.remove('animate-pulse');
    }
}

// 2. Audio Pre-processing (The Secret Sauce)
async function mehedi_parseAudio(sshihabb007_file) {
    const shihab_audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    const mehedi_arrayBuffer = await sshihabb007_file.arrayBuffer();
    const sshihabb007_audioBuffer = await shihab_audioCtx.decodeAudioData(mehedi_arrayBuffer);
    
    // Whisper needs a Float32Array of the first channel
    return sshihabb007_audioBuffer.getChannelData(0);
}

// 3. Listen to Worker updates
shihab_worker.onmessage = function mehedi_onMessage(sshihabb007_event) {
    console.log("Worker message received:", sshihabb007_event.data);
    const { 
        shihab_status_state, 
        mehedi_message_text, 
        sshihabb007_text_chunk, 
        shihab_progress_obj, 
        mehedi_final_output 
    } = sshihabb007_event.data;

    if (shihab_status_state === 'progress') {
        shihab_updateProgressBar(shihab_progress_obj);
    } else if (shihab_status_state === 'partial') {
        // Stream text to UI live!
        sshihabb007_transcript_content.innerText += ' ' + sshihabb007_text_chunk;
    } else if (shihab_status_state === 'complete') {
        document.getElementById('shihab_status_text').innerText = "Transcription Finished!";
        sshihabb007_copy_btn.classList.remove('hidden');
        if (mehedi_final_output && mehedi_final_output.text && mehedi_final_output.text.trim().length > 0) {
             sshihabb007_transcript_content.innerText = mehedi_final_output.text;
        } else {
             sshihabb007_transcript_content.innerHTML = `<span class="text-zinc-500">No speech detected, or Local AI failed to process. If using Local AI, try switching to <b>Gemini 2.5</b> in Settings.</span>`;
        }
    } else if (shihab_status_state === 'loading') {
        document.getElementById('shihab_status_text').innerText = mehedi_message_text || "Loading AI model...";
    } else if (shihab_status_state === 'processing') {
        document.getElementById('shihab_status_text').innerText = mehedi_message_text || "Analyzing audio...";
    } else if (shihab_status_state === 'error') {
        document.getElementById('shihab_status_text').innerText = "Error analyzing audio!";
        sshihabb007_transcript_content.innerHTML = `<span class="text-red-500">${mehedi_message_text}</span>`;
        console.error("Worker Error:", mehedi_message_text);
    }
};

sshihabb007_copy_btn.addEventListener('click', function shihab_copyText() {
    navigator.clipboard.writeText(sshihabb007_transcript_content.innerText);
    sshihabb007_copy_btn.innerText = 'Copied!';
    setTimeout(function mehedi_resetBtn() {
        sshihabb007_copy_btn.innerText = 'Copy Text';
    }, 2000);
});

// Cloud APIs Integration
async function mehedi_processGroq(file) {
    const groqKey = localStorage.getItem('shihab_groq_key');
    if (!groqKey) {
        document.getElementById('shihab_status_text').innerText = "Error: Groq API Key missing! Open Settings.";
        return;
    }
    if (file.size > 25 * 1024 * 1024) {
        document.getElementById('shihab_status_text').innerText = "Error: File too large for Groq (Max 25MB). Please use Gemini 1.5 Pro.";
        return;
    }

    document.getElementById('shihab_status_text').innerText = "Uploading to Groq Cloud...";
    document.getElementById('sshihabb007_progress_bar').classList.add('animate-pulse');
    document.getElementById('sshihabb007_progress_bar').style.width = `100%`;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("response_format", "json");

    try {
        const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${groqKey}` },
            body: formData
        });

        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        document.getElementById('shihab_status_text').innerText = "Transcription Finished!";
        document.getElementById('sshihabb007_progress_bar').classList.remove('animate-pulse');
        sshihabb007_copy_btn.classList.remove('hidden');
        sshihabb007_transcript_content.innerText = data.text || "No text found.";
    } catch (error) {
        document.getElementById('shihab_status_text').innerText = "Groq API Error!";
        document.getElementById('sshihabb007_progress_bar').classList.remove('animate-pulse');
        sshihabb007_transcript_content.innerHTML = `<span class="text-red-500">${error.message}</span>`;
    }
}

async function mehedi_processGemini(file) {
    const geminiKey = localStorage.getItem('shihab_gemini_key');
    if (!geminiKey) {
        document.getElementById('shihab_status_text').innerText = "Error: Gemini API Key missing! Open Settings.";
        return;
    }

    try {
        document.getElementById('shihab_status_text').innerText = "Initiating Google AI Studio Upload...";
        document.getElementById('sshihabb007_progress_bar').classList.add('animate-pulse');
        document.getElementById('sshihabb007_progress_bar').style.width = `30%`;
        
        // Step 1: Start resumable upload session
        const initResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${geminiKey}`, {
            method: 'POST',
            headers: {
                'X-Goog-Upload-Protocol': 'resumable',
                'X-Goog-Upload-Command': 'start',
                'X-Goog-Upload-Header-Content-Length': file.size.toString(),
                'X-Goog-Upload-Header-Content-Type': file.type || 'audio/mp3',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file: { display_name: file.name } })
        });

        if (!initResponse.ok) throw new Error(await initResponse.text());

        // Get the upload URL (Headers can be lowercase depending on browser)
        let uploadUrl = initResponse.headers.get('X-Goog-Upload-URL') || initResponse.headers.get('x-goog-upload-url');
        if (!uploadUrl) throw new Error("Failed to get upload URL from Google API headers");

        // Step 2: Upload file bytes
        document.getElementById('shihab_status_text').innerText = "Uploading audio to Google AI Studio...";
        document.getElementById('sshihabb007_progress_bar').style.width = `60%`;
        
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Content-Length': file.size.toString(),
                'X-Goog-Upload-Offset': '0',
                'X-Goog-Upload-Command': 'upload, finalize'
            },
            body: file
        });

        if (!uploadResponse.ok) throw new Error(await uploadResponse.text());

        const fileInfo = await uploadResponse.json();
        const fileUri = fileInfo.file.uri;

        // Step 3: Call GenerateContent
        document.getElementById('shihab_status_text').innerText = "Transcribing via Gemini 2.5 Flash-Lite...";
        document.getElementById('sshihabb007_progress_bar').style.width = `90%`;

        const genResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Transcribe this audio file perfectly. Output only the transcript text." },
                        { fileData: { fileUri: fileUri, mimeType: fileInfo.file.mimeType || file.type || 'audio/mp3' } }
                    ]
                }]
            })
        });

        if (!genResponse.ok) throw new Error(await genResponse.text());

        const genData = await genResponse.json();
        const transcript = genData.candidates?.[0]?.content?.parts?.[0]?.text || "No text generated.";

        document.getElementById('shihab_status_text').innerText = "Transcription Finished!";
        document.getElementById('sshihabb007_progress_bar').style.width = `100%`;
        document.getElementById('sshihabb007_progress_bar').classList.remove('animate-pulse');
        sshihabb007_copy_btn.classList.remove('hidden');
        sshihabb007_transcript_content.innerText = transcript;

    } catch (error) {
        document.getElementById('shihab_status_text').innerText = "Gemini API Error!";
        document.getElementById('sshihabb007_progress_bar').classList.remove('animate-pulse');
        sshihabb007_transcript_content.innerHTML = `<span class="text-red-500">${error.message}</span>`;
    }
}
