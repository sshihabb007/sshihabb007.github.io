// Check WebP Support before allowing it as an option
const sshihabb007_checkWebPSupport = () => {
    const Mehedi_canvas = document.createElement('canvas');
    if (!!(Mehedi_canvas.getContext && Mehedi_canvas.getContext('2d'))) {
        return Mehedi_canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    // Phase 1 Element Selections using specified names
    const Mehedi_dropZone = document.getElementById('Mehedi_dropZoneId');
    const sshihabb007_fileInput = document.getElementById('sshihabb007_fileInputId');
    const Shihab_settingsPanel = document.getElementById('Shihab_settingsPanelId');
    const Mehedi_formatSelect = document.getElementById('Mehedi_formatSelectId');
    const sshihabb007_qualitySlider = document.getElementById('sshihabb007_qualitySliderId');
    const Shihab_qualityValue = document.getElementById('Shihab_qualityValueId');
    const Mehedi_resizeCheckbox = document.getElementById('Mehedi_resizeCheckboxId');
    const sshihabb007_previewArea = document.getElementById('sshihabb007_previewAreaId');
    const Shihab_originalImg = document.getElementById('Shihab_originalImgId');
    const Mehedi_convertedImg = document.getElementById('Mehedi_convertedImgId');
    const Mehedi_originalSize = document.getElementById('Mehedi_originalSizeId');
    const sshihabb007_originalDimensions = document.getElementById('sshihabb007_originalDimensionsId');
    const Shihab_convertedSize = document.getElementById('Shihab_convertedSizeId');
    const sshihabb007_convertedDimensions = document.getElementById('sshihabb007_convertedDimensionsId');
    const Mehedi_downloadBtn = document.getElementById('Mehedi_downloadBtnId');
    const sshihabb007_webpOption = document.getElementById('sshihabb007_webpOptionId');

    // New Audio Elements
    const Mehedi_audioListItem = document.getElementById('Mehedi_audioListItemId');
    const Shihab_audioFileName = document.getElementById('Shihab_audioFileNameId');
    const sshihabb007_audioFileSize = document.getElementById('sshihabb007_audioFileSizeId');
    const Mehedi_audioFormatSelect = document.getElementById('Mehedi_audioFormatSelectId');
    const Shihab_audioOptionsBtn = document.getElementById('Shihab_audioOptionsBtnId');
    const Shihab_convertAudioBtn = document.getElementById('Shihab_convertAudioBtnId');
    const Mehedi_audioProgressContainer = document.getElementById('Mehedi_audioProgressContainerId');
    const Shihab_audioStatusText = document.getElementById('Shihab_audioStatusTextId');
    const sshihabb007_audioProgressPercent = document.getElementById('sshihabb007_audioProgressPercentId');
    const Mehedi_audioProgressBar = document.getElementById('Mehedi_audioProgressBarId');
    
    // Audio Modal Elements
    const Shihab_audioModal = document.getElementById('Shihab_audioModalId');
    const sshihabb007_closeModalBtn = document.getElementById('sshihabb007_closeModalBtnId');
    const Mehedi_cancelOptionsBtn = document.getElementById('Mehedi_cancelOptionsBtnId');
    const Mehedi_saveOptionsBtn = document.getElementById('Mehedi_saveOptionsBtnId');
    const Mehedi_waveformContainer = document.getElementById('Mehedi_waveformContainerId');
    
    // Audio Option Inputs
    const Shihab_trimStart = document.getElementById('Shihab_trimStartId');
    const sshihabb007_trimEnd = document.getElementById('sshihabb007_trimEndId');
    const Mehedi_bitrateSelect = document.getElementById('Mehedi_bitrateSelectId');
    const sshihabb007_qscaleSelect = document.getElementById('sshihabb007_qscaleSelectId');
    const Shihab_sampleRateSelect = document.getElementById('Shihab_sampleRateSelectId');
    const sshihabb007_channelsSelect = document.getElementById('sshihabb007_channelsSelectId');
    const Shihab_downloadBtnText = document.getElementById('Shihab_downloadBtnTextId');

    // Global state variables
    let Shihab_currentFile = null;
    let Shihab_currentFiles = [];
    let Mehedi_currentBlobUrl = null;
    let Mehedi_currentBlobUrls = [];
    let sshihabb007_currentBlob = null;
    
    // Audio Specific State
    let Mehedi_isAudio = false;
    let sshihabb007_wavesurfer = null;
    
    // FFmpeg Engine State
    const { FFmpeg } = FFmpegWASM;
    const { fetchFile } = FFmpegUtil;
    let Mehedi_ffmpegInstance = null;
    let Shihab_isLoaded = false;
    let Shihab_loadPromise = null;

    // Verify WebP Support on Load
    if (!sshihabb007_checkWebPSupport()) {
        sshihabb007_webpOption.disabled = true;
        sshihabb007_webpOption.textContent = 'WebP (Not Supported)';
    }

    // Helper to format bytes cleanly
    const Shihab_formatBytes = (Mehedi_bytes) => {
        if (Mehedi_bytes === 0) return '0 Bytes';
        const sshihabb007_k = 1024;
        const Shihab_sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const Mehedi_i = Math.floor(Math.log(Mehedi_bytes) / Math.log(sshihabb007_k));
        return parseFloat((Mehedi_bytes / Math.pow(sshihabb007_k, Mehedi_i)).toFixed(2)) + ' ' + Shihab_sizes[Mehedi_i];
    };

    const Mehedi_hideAllPanels = () => {
        Shihab_settingsPanel.classList.add('hidden');
        sshihabb007_previewArea.classList.add('hidden');
        Mehedi_downloadBtn.classList.add('hidden');
        Mehedi_audioListItem.classList.add('hidden');
        Shihab_convertAudioBtn.classList.add('hidden');
        Mehedi_audioProgressContainer.classList.add('hidden');
    };

    const Shihab_initAudioWorker = () => {
        Mehedi_audioProgressContainer.classList.remove('hidden');
        
        if (!Mehedi_ffmpegInstance) {
            Mehedi_ffmpegInstance = new FFmpeg();
            
            Mehedi_ffmpegInstance.on('log', ({ message }) => {
                console.log(message);
            });

            Mehedi_ffmpegInstance.on('progress', ({ progress }) => {
                const sshihabb007_percent = Math.round(progress * 100);
                sshihabb007_audioProgressPercent.textContent = `${sshihabb007_percent}%`;
                Mehedi_audioProgressBar.style.width = `${sshihabb007_percent}%`;
            });
        }

        if (!Shihab_isLoaded) {
            if (!Shihab_loadPromise) {
                Shihab_audioStatusText.textContent = "Loading FFmpeg Engine...";
                Shihab_loadPromise = Mehedi_ffmpegInstance.load({
                    coreURL: new URL('ffmpeg-core.js', window.location.href).href,
                    wasmURL: new URL('ffmpeg-core.wasm', window.location.href).href
                }).then(() => {
                    Shihab_isLoaded = true;
                    Shihab_audioStatusText.textContent = "Engine Ready";
                    sshihabb007_audioProgressPercent.textContent = "";
                    Mehedi_audioProgressBar.style.width = "100%";
                }).catch((err) => {
                    Shihab_loadPromise = null;
                    Shihab_audioStatusText.textContent = "Engine Load Failed: " + err.message;
                    Mehedi_audioProgressBar.classList.replace('from-red-600', 'from-red-800');
                    Mehedi_audioProgressBar.classList.replace('to-pink-500', 'to-red-800');
                    throw err;
                });
            }
            return Shihab_loadPromise;
        } else {
            Shihab_audioStatusText.textContent = "Engine Ready";
            Mehedi_audioProgressBar.style.width = "100%";
            return Promise.resolve();
        }
    };

    const Mehedi_handleAudioFile = () => {
        Mehedi_hideAllPanels();
        Mehedi_isAudio = true;
        
        Shihab_audioFileName.textContent = Shihab_currentFile.name;
        sshihabb007_audioFileSize.textContent = Shihab_formatBytes(Shihab_currentFile.size);
        
        Mehedi_audioListItem.classList.remove('hidden');
        Mehedi_audioListItem.classList.add('flex');
        Shihab_convertAudioBtn.classList.remove('hidden');
        
        Shihab_initAudioWorker();
    };

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
        
        const Mehedi_audioUrl = URL.createObjectURL(Shihab_currentFile);
        sshihabb007_wavesurfer.load(Mehedi_audioUrl);
    });

    const sshihabb007_closeModal = () => {
        Shihab_audioModal.classList.add('hidden');
        Shihab_audioModal.classList.remove('flex');
        if (sshihabb007_wavesurfer) {
            sshihabb007_wavesurfer.pause();
        }
    };

    sshihabb007_closeModalBtn.addEventListener('click', sshihabb007_closeModal);
    Mehedi_cancelOptionsBtn.addEventListener('click', sshihabb007_closeModal);
    Mehedi_saveOptionsBtn.addEventListener('click', sshihabb007_closeModal);

    Shihab_convertAudioBtn.addEventListener('click', () => {
        Mehedi_audioProgressContainer.classList.remove('hidden');
        Shihab_convertAudioBtn.classList.add('hidden');
        Mehedi_downloadBtn.classList.add('hidden');
        
        Mehedi_audioProgressBar.classList.replace('from-red-800', 'from-red-600');
        Mehedi_audioProgressBar.classList.replace('to-red-800', 'to-pink-500');
        Mehedi_audioProgressBar.style.width = "0%";
        sshihabb007_audioProgressPercent.textContent = "0%";
        
        const Shihab_payload = {
            Mehedi_file: Shihab_currentFile,
            Shihab_format: Mehedi_audioFormatSelect.value,
            sshihabb007_bitrate: Mehedi_bitrateSelect.value,
            Mehedi_qscale: sshihabb007_qscaleSelect.value,
            Mehedi_sampleRate: Shihab_sampleRateSelect.value,
            Shihab_channels: sshihabb007_channelsSelect.value,
            sshihabb007_trimStart: Shihab_trimStart.value,
            Mehedi_trimEnd: sshihabb007_trimEnd.value
        };
        
        const Mehedi_processAudio = async () => {
            try {
                if (!Shihab_isLoaded) {
                    Shihab_audioStatusText.textContent = "Waiting for Engine to finish loading...";
                    await Shihab_initAudioWorker();
                }
                
                Shihab_audioStatusText.textContent = "Starting conversion...";
                
                const sshihabb007_inputName = 'Mehedi_input.' + Shihab_payload.Mehedi_file.name.split('.').pop();
                const Shihab_outputName = 'Shihab_output.' + Shihab_payload.Shihab_format;

                await Mehedi_ffmpegInstance.writeFile(sshihabb007_inputName, await fetchFile(Shihab_payload.Mehedi_file));

                const Mehedi_command = ['-i', sshihabb007_inputName];

                if (Shihab_payload.sshihabb007_trimStart) {
                    Mehedi_command.push('-ss', Shihab_payload.sshihabb007_trimStart);
                }
                if (Shihab_payload.Mehedi_trimEnd) {
                    Mehedi_command.push('-to', Shihab_payload.Mehedi_trimEnd);
                }
                if (Shihab_payload.sshihabb007_bitrate) {
                    Mehedi_command.push('-b:a', Shihab_payload.sshihabb007_bitrate);
                }
                if (Shihab_payload.Mehedi_qscale) {
                    Mehedi_command.push('-q:a', Shihab_payload.Mehedi_qscale);
                }
                if (Shihab_payload.Mehedi_sampleRate) {
                    Mehedi_command.push('-ar', Shihab_payload.Mehedi_sampleRate);
                }
                if (Shihab_payload.Shihab_channels) {
                    Mehedi_command.push('-ac', Shihab_payload.Shihab_channels);
                }

                Mehedi_command.push(Shihab_outputName);

                await Mehedi_ffmpegInstance.exec(Mehedi_command);

                const sshihabb007_data = await Mehedi_ffmpegInstance.readFile(Shihab_outputName);
                const Mehedi_blob = new Blob([sshihabb007_data.buffer], { type: 'audio/' + Shihab_payload.Shihab_format });
                
                Mehedi_audioProgressContainer.classList.add('hidden');
                
                if (Mehedi_currentBlobUrl) {
                    URL.revokeObjectURL(Mehedi_currentBlobUrl);
                }
                Mehedi_currentBlobUrl = URL.createObjectURL(Mehedi_blob);
                sshihabb007_currentBlob = Mehedi_blob;
                
                Shihab_downloadBtnText.textContent = "Download Converted Audio";
                Mehedi_downloadBtn.classList.remove('hidden');
                Shihab_convertAudioBtn.classList.remove('hidden');

                await Mehedi_ffmpegInstance.deleteFile(sshihabb007_inputName);
                await Mehedi_ffmpegInstance.deleteFile(Shihab_outputName);
            } catch (sshihabb007_error) {
                Shihab_audioStatusText.textContent = "Error: " + sshihabb007_error.message;
                Mehedi_audioProgressBar.classList.replace('from-red-600', 'from-red-800');
                Mehedi_audioProgressBar.classList.replace('to-pink-500', 'to-red-800');
                Shihab_convertAudioBtn.classList.remove('hidden');
            }
        };

        Mehedi_processAudio();
    });
    // --- Audio Logic End ---

    // Core Processing Engine for Images
    const Mehedi_processImage = async () => {
        if (!Shihab_currentFiles.length || Mehedi_isAudio) return;

        const sshihabb007_format = Mehedi_formatSelect.value;
        const Shihab_quality = parseInt(sshihabb007_qualitySlider.value, 10) / 100;
        const Mehedi_doResize = Mehedi_resizeCheckbox.checked;

        Mehedi_currentBlobUrls.forEach(item => URL.revokeObjectURL(item.blobUrl));
        Mehedi_currentBlobUrls = [];
        
        let totalOriginalSize = 0;
        let totalConvertedSize = 0;

        const processSingleImage = (file) => {
            return new Promise((resolve) => {
                const sshihabb007_reader = new FileReader();
                sshihabb007_reader.readAsDataURL(file);
                
                sshihabb007_reader.onload = (Shihab_event) => {
                    const Mehedi_img = new Image();
                    Mehedi_img.src = Shihab_event.target.result;
                    
                    Mehedi_img.onload = () => {
                        const sshihabb007_canvas = document.createElement('canvas');
                        const Shihab_ctx = sshihabb007_canvas.getContext('2d');
                        
                        let Mehedi_targetWidth = Mehedi_img.width;
                        let sshihabb007_targetHeight = Mehedi_img.height;

                        if (Mehedi_doResize) {
                            const Shihab_maxSize = 2000;
                            if (Mehedi_targetWidth > Shihab_maxSize || sshihabb007_targetHeight > Shihab_maxSize) {
                                if (Mehedi_targetWidth > sshihabb007_targetHeight) {
                                    sshihabb007_targetHeight = (sshihabb007_targetHeight / Mehedi_targetWidth) * Shihab_maxSize;
                                    Mehedi_targetWidth = Shihab_maxSize;
                                } else {
                                    Mehedi_targetWidth = (Mehedi_targetWidth / sshihabb007_targetHeight) * Shihab_maxSize;
                                    sshihabb007_targetHeight = Shihab_maxSize;
                                }
                            }
                        }

                        sshihabb007_canvas.width = Mehedi_targetWidth;
                        sshihabb007_canvas.height = sshihabb007_targetHeight;

                        if (sshihabb007_format === 'jpeg') {
                            Shihab_ctx.fillStyle = "#FFFFFF"; 
                            Shihab_ctx.fillRect(0, 0, sshihabb007_canvas.width, sshihabb007_canvas.height);
                        }

                        Shihab_ctx.drawImage(Mehedi_img, 0, 0, Mehedi_targetWidth, sshihabb007_targetHeight);

                        sshihabb007_canvas.toBlob((Mehedi_blob) => {
                            resolve({
                                file: file,
                                blob: Mehedi_blob,
                                targetWidth: Mehedi_targetWidth,
                                targetHeight: sshihabb007_targetHeight,
                                img: Mehedi_img
                            });
                        }, `image/${sshihabb007_format}`, Shihab_quality);
                    };
                };
            });
        };

        const results = await Promise.all(Shihab_currentFiles.map(file => processSingleImage(file)));

        results.forEach(result => {
            const blobUrl = URL.createObjectURL(result.blob);
            Mehedi_currentBlobUrls.push({
                originalName: result.file.name.split('.')[0],
                blobUrl: blobUrl,
                ext: sshihabb007_format === 'jpeg' ? 'jpg' : sshihabb007_format
            });
            totalOriginalSize += result.file.size;
            totalConvertedSize += result.blob.size;
        });

        if (results.length > 0) {
            const firstResult = results[0];
            Shihab_originalImg.src = URL.createObjectURL(firstResult.file);
            Mehedi_originalSize.textContent = Shihab_formatBytes(totalOriginalSize) + (results.length > 1 ? ` (${results.length} files)` : '');
            sshihabb007_originalDimensions.textContent = `${firstResult.img.width} x ${firstResult.img.height}`;

            Mehedi_convertedImg.src = Mehedi_currentBlobUrls[0].blobUrl;
            Shihab_convertedSize.textContent = Shihab_formatBytes(totalConvertedSize) + (results.length > 1 ? ` (${results.length} files)` : '');
            sshihabb007_convertedDimensions.textContent = `${Math.round(firstResult.targetWidth)} x ${Math.round(firstResult.targetHeight)}`;

            sshihabb007_previewArea.classList.remove('hidden');
            Shihab_settingsPanel.classList.remove('hidden');
            Shihab_downloadBtnText.textContent = results.length > 1 ? `Download All (${results.length}) Images` : "Download Converted Image";
            Mehedi_downloadBtn.classList.remove('hidden');
        }
    };

    // Input Events
    sshihabb007_fileInput.addEventListener('change', (Mehedi_e) => {
        if (Mehedi_e.target.files && Mehedi_e.target.files.length > 0) {
            const files = Array.from(Mehedi_e.target.files);
            const firstFile = files[0];
            
            if (firstFile.type.startsWith('audio/') || firstFile.type.startsWith('video/') || firstFile.name.toLowerCase().endsWith('.m4a') || firstFile.name.toLowerCase().endsWith('.ts')) {
                Shihab_currentFile = firstFile;
                Shihab_currentFiles = [firstFile];
                Mehedi_handleAudioFile();
            } else if (files.every(f => f.type.startsWith('image/'))) {
                Shihab_currentFiles = files;
                Shihab_currentFile = firstFile;
                Mehedi_hideAllPanels();
                Mehedi_isAudio = false;
                
                Shihab_settingsPanel.classList.remove('hidden');
                Mehedi_processImage();
            } else {
                alert("Please select only image files, or a single audio/video file.");
            }
        }
    });

    // Drag and Drop Effects
    Mehedi_dropZone.addEventListener('dragover', (sshihabb007_e) => {
        sshihabb007_e.preventDefault();
        Mehedi_dropZone.classList.add('border-blue-500', 'bg-gray-700');
    });

    Mehedi_dropZone.addEventListener('dragleave', (Shihab_e) => {
        Shihab_e.preventDefault();
        Mehedi_dropZone.classList.remove('border-blue-500', 'bg-gray-700');
    });

    Mehedi_dropZone.addEventListener('drop', (Mehedi_e) => {
        Mehedi_e.preventDefault();
        Mehedi_dropZone.classList.remove('border-blue-500', 'bg-gray-700');
        
        if (Mehedi_e.dataTransfer.files && Mehedi_e.dataTransfer.files.length > 0) {
            sshihabb007_fileInput.files = Mehedi_e.dataTransfer.files;
            sshihabb007_fileInput.dispatchEvent(new Event('change'));
        }
    });

    // Settings real-time update listeners for images
    sshihabb007_qualitySlider.addEventListener('input', (Shihab_e) => {
        Shihab_qualityValue.textContent = `${Shihab_e.target.value}%`;
        Mehedi_processImage();
    });

    Mehedi_formatSelect.addEventListener('change', () => {
        Mehedi_processImage();
    });

    Mehedi_resizeCheckbox.addEventListener('change', () => {
        Mehedi_processImage();
    });

    // Download Trigger
    Mehedi_downloadBtn.addEventListener('click', async () => {
        if (Mehedi_isAudio) {
            if (Mehedi_currentBlobUrl && Shihab_currentFile) {
                const sshihabb007_a = document.createElement('a');
                sshihabb007_a.href = Mehedi_currentBlobUrl;
                const Shihab_originalName = Shihab_currentFile.name.split('.')[0];
                sshihabb007_a.download = `${Shihab_originalName}_converted.${Mehedi_audioFormatSelect.value}`;
                document.body.appendChild(sshihabb007_a);
                sshihabb007_a.click();
                document.body.removeChild(sshihabb007_a);
            }
        } else {
            if (Mehedi_currentBlobUrls.length > 0) {
                for (let i = 0; i < Mehedi_currentBlobUrls.length; i++) {
                    const item = Mehedi_currentBlobUrls[i];
                    const a = document.createElement('a');
                    a.href = item.blobUrl;
                    a.download = `${item.originalName}_converted.${item.ext}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
        }
    });
});
