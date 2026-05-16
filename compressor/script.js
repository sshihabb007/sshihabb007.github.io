// Check WebP Support
const sshihabb007_checkWebPSupport = () => {
    const Mehedi_canvas = document.createElement('canvas');
    if (!!(Mehedi_canvas.getContext && Mehedi_canvas.getContext('2d'))) {
        return Mehedi_canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
};

// Check cross-origin isolation (required for SharedArrayBuffer / FFmpeg WASM)
const sshihabb007_checkCOI = () => {
    if (typeof crossOriginIsolated !== 'undefined' && !crossOriginIsolated) {
        console.warn('[Compressor] Page is NOT cross-origin isolated. FFmpeg may fail. ' +
            'Try a hard-reload (Ctrl+Shift+R) to let the COI service worker activate.');
        return false;
    }
    return true;
};

document.addEventListener('DOMContentLoaded', () => {

    // === Element References ===
    const Mehedi_dropZone            = document.getElementById('Mehedi_dropZoneId');
    const sshihabb007_fileInput      = document.getElementById('sshihabb007_fileInputId');
    const Shihab_settingsPanel       = document.getElementById('Shihab_settingsPanelId');
    const Mehedi_formatSelect        = document.getElementById('Mehedi_formatSelectId');
    const sshihabb007_qualitySlider  = document.getElementById('sshihabb007_qualitySliderId');
    const Shihab_qualityValue        = document.getElementById('Shihab_qualityValueId');
    const Mehedi_resizeCheckbox      = document.getElementById('Mehedi_resizeCheckboxId');
    const sshihabb007_previewArea    = document.getElementById('sshihabb007_previewAreaId');
    const Shihab_originalImg         = document.getElementById('Shihab_originalImgId');
    const Mehedi_convertedImg        = document.getElementById('Mehedi_convertedImgId');
    const Mehedi_originalSize        = document.getElementById('Mehedi_originalSizeId');
    const sshihabb007_originalDims   = document.getElementById('sshihabb007_originalDimensionsId');
    const Shihab_convertedSize       = document.getElementById('Shihab_convertedSizeId');
    const sshihabb007_convertedDims  = document.getElementById('sshihabb007_convertedDimensionsId');
    const Mehedi_downloadBtn         = document.getElementById('Mehedi_downloadBtnId');
    const sshihabb007_webpOption     = document.getElementById('sshihabb007_webpOptionId');

    // Audio elements
    const Mehedi_audioListItem           = document.getElementById('Mehedi_audioListItemId');
    const Shihab_audioFileName           = document.getElementById('Shihab_audioFileNameId');
    const sshihabb007_audioFileSize      = document.getElementById('sshihabb007_audioFileSizeId');
    const Mehedi_audioFormatSelect       = document.getElementById('Mehedi_audioFormatSelectId');
    const Shihab_audioOptionsBtn         = document.getElementById('Shihab_audioOptionsBtnId');
    const Shihab_convertAudioBtn         = document.getElementById('Shihab_convertAudioBtnId');
    const Mehedi_audioProgressContainer  = document.getElementById('Mehedi_audioProgressContainerId');
    const Shihab_audioStatusText         = document.getElementById('Shihab_audioStatusTextId');
    const sshihabb007_audioProgressPct   = document.getElementById('sshihabb007_audioProgressPercentId');
    const Mehedi_audioProgressBar        = document.getElementById('Mehedi_audioProgressBarId');
    const Shihab_downloadBtnText         = document.getElementById('Shihab_downloadBtnTextId');

    // Audio modal elements
    const Shihab_audioModal          = document.getElementById('Shihab_audioModalId');
    const sshihabb007_closeModalBtn  = document.getElementById('sshihabb007_closeModalBtnId');
    const Mehedi_cancelOptionsBtn    = document.getElementById('Mehedi_cancelOptionsBtnId');
    const Mehedi_saveOptionsBtn      = document.getElementById('Mehedi_saveOptionsBtnId');
    const Mehedi_waveformContainer   = document.getElementById('Mehedi_waveformContainerId');
    const Shihab_trimStart           = document.getElementById('Shihab_trimStartId');
    const sshihabb007_trimEnd        = document.getElementById('sshihabb007_trimEndId');
    const Mehedi_bitrateSelect       = document.getElementById('Mehedi_bitrateSelectId');
    const sshihabb007_qscaleSelect   = document.getElementById('sshihabb007_qscaleSelectId');
    const Shihab_sampleRateSelect    = document.getElementById('Shihab_sampleRateSelectId');
    const sshihabb007_channelsSelect = document.getElementById('sshihabb007_channelsSelectId');

    // === State ===
    let Shihab_currentFile    = null;
    let Shihab_currentFiles   = [];
    let Mehedi_currentBlobUrl  = null;
    let Mehedi_currentBlobUrls = [];
    let Mehedi_isAudio         = false;
    let sshihabb007_wavesurfer = null;

    // === FFmpeg v0.11.6 — single-threaded, no Worker required ===
    const { createFFmpeg, fetchFile } = FFmpeg;
    const Mehedi_ffmpeg = createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
        progress: ({ ratio }) => {
            const pct = Math.round(ratio * 100);
            sshihabb007_audioProgressPct.textContent = `${pct}%`;
            Mehedi_audioProgressBar.style.width = `${pct}%`;
        }
    });

    let Shihab_isLoaded    = false;
    let Shihab_loadPromise = null;

    // WebP check
    if (!sshihabb007_checkWebPSupport()) {
        sshihabb007_webpOption.disabled = true;
        sshihabb007_webpOption.textContent = 'WebP (Not Supported)';
    }

    // === Helpers ===
    const Shihab_formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const Mehedi_hideAllPanels = () => {
        Shihab_settingsPanel.classList.add('hidden');
        Shihab_settingsPanel.classList.remove('grid');
        sshihabb007_previewArea.classList.add('hidden');
        Mehedi_downloadBtn.classList.add('hidden');
        Mehedi_audioListItem.classList.add('hidden');
        Mehedi_audioListItem.classList.remove('flex');
        Shihab_convertAudioBtn.classList.add('hidden');
        Mehedi_audioProgressContainer.classList.add('hidden');
    };

    // === Load FFmpeg Engine (v0.11 API) ===
    const Shihab_loadEngine = () => {
        if (Shihab_isLoaded) return Promise.resolve();
        if (Shihab_loadPromise) return Shihab_loadPromise;

        // Guard: SharedArrayBuffer requires cross-origin isolation
        if (!sshihabb007_checkCOI()) {
            Mehedi_audioProgressContainer.classList.remove('hidden');
            Shihab_audioStatusText.textContent = '⚠️ Cross-Origin Isolation required. Please hard-reload (Ctrl+Shift+R).';
            Mehedi_audioProgressBar.style.background = '#dc2626';
            Mehedi_audioProgressBar.style.width = '100%';
            return Promise.reject(new Error('Not cross-origin isolated'));
        }

        Mehedi_audioProgressContainer.classList.remove('hidden');
        Shihab_audioStatusText.textContent = 'Downloading FFmpeg Engine (~25MB, first time only)...';
        sshihabb007_audioProgressPct.textContent = '';
        Mehedi_audioProgressBar.style.width = '30%';

        Shihab_loadPromise = Mehedi_ffmpeg.load()
            .then(() => {
                Shihab_isLoaded = true;
                Shihab_audioStatusText.textContent = 'Engine Ready. Click Convert Audio.';
                Mehedi_audioProgressBar.style.width = '100%';
                sshihabb007_audioProgressPct.textContent = '✓';
                // Auto-hide progress after 2s so the Convert button is visible
                setTimeout(() => {
                    Mehedi_audioProgressContainer.classList.add('hidden');
                    Shihab_convertAudioBtn.classList.remove('hidden');
                }, 2000);
            })
            .catch((err) => {
                Shihab_loadPromise = null;
                Shihab_audioStatusText.textContent = 'Engine failed: ' + (err.message || err);
                Mehedi_audioProgressBar.style.background = '#dc2626';
                console.error('FFmpeg load error:', err);
                throw err;
            });

        return Shihab_loadPromise;
    };

    // === Handle Audio File ===
    const Mehedi_handleAudioFile = () => {
        Mehedi_hideAllPanels();
        Mehedi_isAudio = true;

        Shihab_audioFileName.textContent = Shihab_currentFile.name;
        sshihabb007_audioFileSize.textContent = Shihab_formatBytes(Shihab_currentFile.size);

        Mehedi_audioListItem.classList.remove('hidden');
        Mehedi_audioListItem.classList.add('flex');

        // Start loading engine in background, show progress
        Shihab_loadEngine();
    };

    // === Audio Options Modal ===
    Shihab_audioOptionsBtn.addEventListener('click', () => {
        Shihab_audioModal.classList.remove('hidden');
        Shihab_audioModal.classList.add('flex');

        if (!sshihabb007_wavesurfer) {
            sshihabb007_wavesurfer = WaveSurfer.create({
                container: Mehedi_waveformContainer,
                waveColor: '#ef4444',
                progressColor: '#b91c1c',
                cursorColor: '#fca5a5',
                barWidth: 2,
                barRadius: 3,
                responsive: true,
                height: 100,
            });
        }
        sshihabb007_wavesurfer.load(URL.createObjectURL(Shihab_currentFile));
    });

    const sshihabb007_closeModal = () => {
        Shihab_audioModal.classList.add('hidden');
        Shihab_audioModal.classList.remove('flex');
        if (sshihabb007_wavesurfer) sshihabb007_wavesurfer.pause();
    };
    sshihabb007_closeModalBtn.addEventListener('click', sshihabb007_closeModal);
    Mehedi_cancelOptionsBtn.addEventListener('click', sshihabb007_closeModal);
    Mehedi_saveOptionsBtn.addEventListener('click', sshihabb007_closeModal);

    // === Convert Audio ===
    Shihab_convertAudioBtn.addEventListener('click', async () => {
        Mehedi_audioProgressContainer.classList.remove('hidden');
        Shihab_convertAudioBtn.classList.add('hidden');
        Mehedi_downloadBtn.classList.add('hidden');

        Mehedi_audioProgressBar.style.background = '';
        Mehedi_audioProgressBar.style.width = '0%';
        sshihabb007_audioProgressPct.textContent = '0%';

        try {
            // Ensure engine is loaded
            if (!Shihab_isLoaded) {
                Shihab_audioStatusText.textContent = 'Loading FFmpeg Engine...';
                await Shihab_loadEngine();
            }

            Shihab_audioStatusText.textContent = 'Converting...';

            const inputExt  = Shihab_currentFile.name.split('.').pop().toLowerCase();
            const outputFmt = Mehedi_audioFormatSelect.value;
            const inputName = `input.${inputExt}`;
            const outputName = `output.${outputFmt}`;

            // Write input file to virtual FS
            Mehedi_ffmpeg.FS('writeFile', inputName, await fetchFile(Shihab_currentFile));

            // Build command
            const cmd = ['-i', inputName];

            const trimStart = Shihab_trimStart.value.trim();
            const trimEnd   = sshihabb007_trimEnd.value.trim();
            if (trimStart) cmd.push('-ss', trimStart);
            if (trimEnd)   cmd.push('-to', trimEnd);

            const bitrate    = Mehedi_bitrateSelect.value;
            const qscale     = sshihabb007_qscaleSelect.value;
            const sampleRate = Shihab_sampleRateSelect.value;
            const channels   = sshihabb007_channelsSelect.value;

            if (bitrate)     cmd.push('-b:a', bitrate);
            if (qscale !== '') cmd.push('-q:a', qscale);
            if (sampleRate)  cmd.push('-ar', sampleRate);
            if (channels)    cmd.push('-ac', channels);

            cmd.push(outputName);

            // Run conversion
            await Mehedi_ffmpeg.run(...cmd);

            // Read output
            const data = Mehedi_ffmpeg.FS('readFile', outputName);
            const mimeMap = { mp3: 'audio/mpeg', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg' };
            const blob = new Blob([data.buffer], { type: mimeMap[outputFmt] || 'audio/mpeg' });

            // Cleanup FS
            try { Mehedi_ffmpeg.FS('unlink', inputName); } catch(e) {}
            try { Mehedi_ffmpeg.FS('unlink', outputName); } catch(e) {}

            if (Mehedi_currentBlobUrl) URL.revokeObjectURL(Mehedi_currentBlobUrl);
            Mehedi_currentBlobUrl = URL.createObjectURL(blob);

            Shihab_audioStatusText.textContent = `Done! ${Shihab_formatBytes(blob.size)}`;
            Mehedi_audioProgressBar.style.width = '100%';
            sshihabb007_audioProgressPct.textContent = '100%';

            Shihab_downloadBtnText.textContent = 'Download Converted Audio';
            Mehedi_downloadBtn.classList.remove('hidden');
            Shihab_convertAudioBtn.classList.remove('hidden');

        } catch (err) {
            console.error('Audio conversion error:', err);
            Shihab_audioStatusText.textContent = 'Error: ' + (err.message || 'Conversion failed');
            Mehedi_audioProgressBar.style.background = '#dc2626';
            Shihab_convertAudioBtn.classList.remove('hidden');
        }
    });

    // === Image Processing ===
    const Mehedi_processImage = async () => {
        if (!Shihab_currentFiles.length || Mehedi_isAudio) return;

        const fmt      = Mehedi_formatSelect.value;
        const quality  = parseInt(sshihabb007_qualitySlider.value, 10) / 100;
        const doResize = Mehedi_resizeCheckbox.checked;

        Mehedi_currentBlobUrls.forEach(item => URL.revokeObjectURL(item.blobUrl));
        Mehedi_currentBlobUrls = [];

        let totalOriginalSize   = 0;
        let totalConvertedSize  = 0;

        const processSingle = (file) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (ev) => {
                const img = new Image();
                img.src = ev.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    let w = img.width, h = img.height;

                    if (doResize && (w > 2000 || h > 2000)) {
                        if (w > h) { h = (h / w) * 2000; w = 2000; }
                        else       { w = (w / h) * 2000; h = 2000; }
                    }

                    canvas.width  = w;
                    canvas.height = h;
                    if (fmt === 'jpeg') { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h); }
                    ctx.drawImage(img, 0, 0, w, h);

                    canvas.toBlob(
                        (blob) => resolve({ file, blob, w, h, img }),
                        `image/${fmt}`,
                        quality
                    );
                };
            };
        });

        const results = await Promise.all(Shihab_currentFiles.map(f => processSingle(f)));

        results.forEach(r => {
            const blobUrl = URL.createObjectURL(r.blob);
            Mehedi_currentBlobUrls.push({
                originalName: r.file.name.split('.')[0],
                blobUrl,
                ext: fmt === 'jpeg' ? 'jpg' : fmt
            });
            totalOriginalSize  += r.file.size;
            totalConvertedSize += r.blob.size;
        });

        if (results.length > 0) {
            const first = results[0];
            Shihab_originalImg.src         = URL.createObjectURL(first.file);
            Mehedi_originalSize.textContent = Shihab_formatBytes(totalOriginalSize) +
                (results.length > 1 ? ` (${results.length} files)` : '');
            sshihabb007_originalDims.textContent = `${first.img.width} x ${first.img.height}`;

            Mehedi_convertedImg.src          = Mehedi_currentBlobUrls[0].blobUrl;
            Shihab_convertedSize.textContent  = Shihab_formatBytes(totalConvertedSize) +
                (results.length > 1 ? ` (${results.length} files)` : '');
            sshihabb007_convertedDims.textContent = `${Math.round(first.w)} x ${Math.round(first.h)}`;

            sshihabb007_previewArea.classList.remove('hidden');
            Shihab_settingsPanel.classList.remove('hidden');
            Shihab_settingsPanel.classList.add('grid');
            Shihab_downloadBtnText.textContent = results.length > 1
                ? `Download All (${results.length}) Images`
                : 'Download Converted Image';
            Mehedi_downloadBtn.classList.remove('hidden');
        }
    };

    // === File Input ===
    sshihabb007_fileInput.addEventListener('change', (e) => {
        if (!e.target.files || !e.target.files.length) return;
        const files = Array.from(e.target.files);
        const first = files[0];
        const isMediaFile = (f) =>
            f.type.startsWith('audio/') ||
            f.type.startsWith('video/') ||
            /\.(m4a|ts|mkv|avi|flv|wmv)$/i.test(f.name);

        if (isMediaFile(first)) {
            Shihab_currentFile  = first;
            Shihab_currentFiles = [first];
            Mehedi_handleAudioFile();
        } else if (files.every(f => f.type.startsWith('image/'))) {
            Shihab_currentFiles = files;
            Shihab_currentFile  = first;
            Mehedi_hideAllPanels();
            Mehedi_isAudio = false;
            Shihab_settingsPanel.classList.remove('hidden');
            Shihab_settingsPanel.classList.add('grid');
            Mehedi_processImage();
        } else {
            alert('Please select only image files, or a single audio/video file.');
        }
    });

    // === Drag & Drop ===
    Mehedi_dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        Mehedi_dropZone.classList.add('border-blue-500', 'bg-gray-700');
    });
    Mehedi_dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        Mehedi_dropZone.classList.remove('border-blue-500', 'bg-gray-700');
    });
    Mehedi_dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        Mehedi_dropZone.classList.remove('border-blue-500', 'bg-gray-700');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            sshihabb007_fileInput.files = e.dataTransfer.files;
            sshihabb007_fileInput.dispatchEvent(new Event('change'));
        }
    });

    // === Image Settings ===
    sshihabb007_qualitySlider.addEventListener('input', (e) => {
        Shihab_qualityValue.textContent = `${e.target.value}%`;
        Mehedi_processImage();
    });
    Mehedi_formatSelect.addEventListener('change', () => Mehedi_processImage());
    Mehedi_resizeCheckbox.addEventListener('change', () => Mehedi_processImage());

    // === Download ===
    Mehedi_downloadBtn.addEventListener('click', async () => {
        if (Mehedi_isAudio) {
            if (Mehedi_currentBlobUrl && Shihab_currentFile) {
                const a = document.createElement('a');
                a.href = Mehedi_currentBlobUrl;
                a.download = Shihab_currentFile.name.replace(/\.[^/.]+$/, '') +
                    '_converted.' + Mehedi_audioFormatSelect.value;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } else {
            for (let i = 0; i < Mehedi_currentBlobUrls.length; i++) {
                const item = Mehedi_currentBlobUrls[i];
                const a = document.createElement('a');
                a.href     = item.blobUrl;
                a.download = `${item.originalName}_converted.${item.ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                await new Promise(r => setTimeout(r, 300));
            }
        }
    });
});
