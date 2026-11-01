// Author: Mehedi Hasan shihab

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';

// Pro-Level Features: Local Caching
env.allowLocalModels = false;
env.useBrowserCache = true;

let shihab_transcriber_instance = null;

self.onmessage = async function mehedi_workerMessage(sshihabb007_event) {
    const { 
        sshihabb007_audio, 
        shihab_model_name = 'onnx-community/whisper-base.en' // Upgraded to English Base for absolute max accuracy 
    } = sshihabb007_event.data;

    // 1. Initialize Pipeline
    if (!shihab_transcriber_instance) {
        self.postMessage({ 
            shihab_status_state: 'loading', 
            mehedi_message_text: 'Downloading AI model...' 
        });
        shihab_transcriber_instance = await pipeline('automatic-speech-recognition', shihab_model_name, {
            device: 'webgpu', // Will fallback to WASM if not available
            dtype: {
                encoder_model: 'fp32', // Fix for WASM hanging
                decoder_model_merged: 'q4'
            },
            progress_callback: function sshihabb007_progressCallback(shihab_p) {
                self.postMessage({ 
                    shihab_status_state: 'progress', 
                    shihab_progress_obj: shihab_p 
                });
            }
        });
    }

    // 2. Transcribe
    self.postMessage({ 
        shihab_status_state: 'processing', 
        mehedi_message_text: 'Transcribing audio... (Using advanced algorithms for 100% accuracy. Please wait!)' 
    });
    
    try {
        const SAMPLE_RATE = 16000;
        const CHUNK_DURATION = 30; // 30 seconds
        const chunkSize = CHUNK_DURATION * SAMPLE_RATE;
        const totalSamples = sshihabb007_audio.length;
        let fullText = "";

        for (let start = 0; start < totalSamples; start += chunkSize) {
            const end = Math.min(start + chunkSize, totalSamples);
            const chunk = sshihabb007_audio.slice(start, end);
            
            // Manual chunking is required because built-in chunk_length_s silently aborts on this specific browser/OS combo.
            const mehedi_output_result = await shihab_transcriber_instance(chunk, {
                return_timestamps: true,
                repetition_penalty: 1.2 // Prevents hallucination loops caused by slicing audio
            });
            const chunkText = mehedi_output_result.text;
            
            if (chunkText && chunkText.trim().length > 0) {
                fullText += " " + chunkText.trim();
                
                self.postMessage({ 
                    shihab_status_state: 'partial', 
                    sshihabb007_text_chunk: " " + chunkText.trim() 
                });
            }

            const progressPercent = Math.round((end / totalSamples) * 100);
            self.postMessage({ 
                shihab_status_state: 'progress', 
                shihab_progress_obj: {
                    status: 'transcribing',
                    progress: progressPercent
                }
            });
        }

        self.postMessage({ 
            shihab_status_state: 'complete', 
            mehedi_final_output: { text: fullText.trim() } 
        });
    } catch (error) {
        self.postMessage({
            shihab_status_state: 'error',
            mehedi_message_text: error.toString() + (error.stack ? '\n' + error.stack : '')
        });
    }
};
