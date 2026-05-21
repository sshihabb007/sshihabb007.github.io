// universal-downloader/script.js - By Mehedi Hasan Shihab (sshihabb007)
// Architecture: Platform-aware smart routing + CORS proxy failover

const mehedi_initUniversalDownloader = () => {

    // ─── Telemetry Engine (Adblocker-Safe GA4 events wrapper) ─────────────────
    function shihab_trackEvent(eventName, params = {}) {
        if (typeof gtag === 'function') {
            try {
                gtag('event', eventName, {
                    ...params,
                    developer: 'Mehedi Hasan Shihab',
                    app_name: 'Universal Downloader Engine'
                });
            } catch (e) {
                console.warn("GA4 event tracking failed:", e);
            }
        }
    }

    // ─── 1. Core Element References ───────────────────────────────────────────
    const mehedi_extractBtn           = document.getElementById('mehedi_extractBtn');
    const shihab_targetUrlInput       = document.getElementById('shihab_targetUrl');
    const mehedi_pasteBtn             = document.getElementById('mehedi_pasteBtn');
    const sshihabb007_statusTerminal  = document.getElementById('sshihabb007_statusTerminal');
    const mehedi_terminalLog          = document.getElementById('mehedi_terminalLog');
    const shihab_terminalProgress     = document.getElementById('shihab_terminalProgress');
    const sshihabb007_progressPercent = document.getElementById('sshihabb007_progressPercent');
    const mehedi_assetPresenter       = document.getElementById('mehedi_assetPresenter');
    const shihab_assetIcon            = document.getElementById('shihab_assetIcon');
    const sshihabb007_assetTitle      = document.getElementById('sshihabb007_assetTitle');
    const mehedi_assetMeta            = document.getElementById('mehedi_assetMeta');
    const shihab_downloadBtn          = document.getElementById('shihab_downloadBtn');
    const mehedi_toggleVideo          = document.getElementById('mehedi_toggleVideo');
    const mehedi_toggleAudio          = document.getElementById('mehedi_toggleAudio');
    const mehedi_workerHint           = document.getElementById('mehedi_workerHint');

    // Slide Gallery elements
    const mehedi_galleryPresenter     = document.getElementById('mehedi_galleryPresenter');
    const mehedi_galleryCount         = document.getElementById('mehedi_galleryCount');
    const mehedi_galleryGrid          = document.getElementById('mehedi_galleryGrid');

    let sshihabb007_isAudioOnly = false;

    // Defensive check to verify key DOM elements are present
    if (!mehedi_extractBtn || !shihab_targetUrlInput) {
        console.warn("Universal Downloader: Required elements (#mehedi_extractBtn, #shihab_targetUrl) are missing from the DOM.");
        return;
    }

    // ─── Download telemetry hook ──────────────────────────────────────────────
    if (shihab_downloadBtn) {
        shihab_downloadBtn.addEventListener('click', () => {
            const inputUrl = document.getElementById('shihab_targetUrl')?.value?.trim() || '';
            const platform = sshihabb007_detectPlatform(inputUrl);
            shihab_trackEvent('universal_downloader_download_file', {
                platform: platform,
                format: sshihabb007_isAudioOnly ? 'audio' : 'video'
            });
        });
    }

    // ─── 2. Mode Toggle ────────────────────────────────────────────────────────
    if (mehedi_toggleVideo && mehedi_toggleAudio) {
        mehedi_toggleVideo.addEventListener('click', () => {
            mehedi_toggleVideo.classList.add('active');
            mehedi_toggleAudio.classList.remove('active');
            sshihabb007_isAudioOnly = false;
            shihab_trackEvent('universal_downloader_toggle_format', { format: 'video' });
        });
        mehedi_toggleAudio.addEventListener('click', () => {
            mehedi_toggleAudio.classList.add('active');
            mehedi_toggleVideo.classList.remove('active');
            sshihabb007_isAudioOnly = true;
            shihab_trackEvent('universal_downloader_toggle_format', { format: 'audio' });
        });
    }

    // ─── 3. Paste Button Logic ──────────────────────────────────────────────────
    if (mehedi_pasteBtn) {
        mehedi_pasteBtn.addEventListener('click', async () => {
            const targetInput = document.getElementById('shihab_targetUrl');
            if (!targetInput) return;
            shihab_trackEvent('universal_downloader_paste_url', { trigger: 'clipboard_button' });
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    targetInput.value = text.trim();
                    targetInput.dispatchEvent(new Event('input'));
                    
                    // visual feedback effect
                    mehedi_pasteBtn.style.color = 'var(--primary-color)';
                    mehedi_pasteBtn.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        mehedi_pasteBtn.style.color = '';
                        mehedi_pasteBtn.style.transform = '';
                    }, 800);
                }
            } catch (err) {
                console.warn("Failed to read clipboard:", err);
                const manualText = prompt("Please paste your URL here:");
                if (manualText) {
                    targetInput.value = manualText.trim();
                    targetInput.dispatchEvent(new Event('input'));
                }
            }
        });
    }

    // ─── 4. Trigger ────────────────────────────────────────────────────────────
    if (mehedi_extractBtn) {
        mehedi_extractBtn.addEventListener('click', mehedi_executeExtraction);
    }

    // ─── 4. Main Extraction Pipeline ──────────────────────────────────────────
    async function mehedi_executeExtraction() {
        const shihab_targetUrlInput       = document.getElementById('shihab_targetUrl');
        const sshihabb007_statusTerminal  = document.getElementById('sshihabb007_statusTerminal');
        const mehedi_assetPresenter       = document.getElementById('mehedi_assetPresenter');
        const mehedi_galleryPresenter     = document.getElementById('mehedi_galleryPresenter');
        const mehedi_workerHint           = document.getElementById('mehedi_workerHint');
        const shihab_terminalProgress     = document.getElementById('shihab_terminalProgress');
        const sshihabb007_progressPercent = document.getElementById('sshihabb007_progressPercent');
        const shihab_assetIcon            = document.getElementById('shihab_assetIcon');
        const mehedi_galleryCount         = document.getElementById('mehedi_galleryCount');
        const mehedi_galleryGrid          = document.getElementById('mehedi_galleryGrid');
        const sshihabb007_assetTitle      = document.getElementById('sshihabb007_assetTitle');
        const mehedi_assetMeta            = document.getElementById('mehedi_assetMeta');
        const shihab_downloadBtn          = document.getElementById('shihab_downloadBtn');

        if (!shihab_targetUrlInput) return;

        const inputUrl = shihab_targetUrlInput.value.trim();
        if (!inputUrl) {
            alert("Please paste a valid media link first.");
            return;
        }

        const shihab_platform = sshihabb007_detectPlatform(inputUrl);
        const shihab_startTime = Date.now();

        shihab_trackEvent('universal_downloader_start_extraction', {
            platform: shihab_platform,
            format: sshihabb007_isAudioOnly ? 'audio' : 'video',
            url_domain: (function() {
                try { return new URL(inputUrl).hostname; } catch(e) { return 'invalid'; }
            })()
        });

        // Reset UI state safely with robust defensive guards
        if (mehedi_assetPresenter) mehedi_assetPresenter.classList.add('hidden');
        if (mehedi_galleryPresenter) mehedi_galleryPresenter.classList.add('hidden');
        if (mehedi_workerHint) mehedi_workerHint.classList.add('hidden');
        
        const mehedi_videoThumbnailContainer = document.getElementById('mehedi_videoThumbnailContainer');
        const mehedi_videoPlayer = document.getElementById('mehedi_videoPlayer');
        if (mehedi_videoThumbnailContainer) mehedi_videoThumbnailContainer.classList.add('hidden');
        if (mehedi_videoPlayer) {
            mehedi_videoPlayer.src = '';
            mehedi_videoPlayer.removeAttribute('poster');
            mehedi_videoPlayer.load();
        }

        if (sshihabb007_statusTerminal) sshihabb007_statusTerminal.classList.remove('hidden');
        if (shihab_terminalProgress) {
            shihab_terminalProgress.style.backgroundColor = '';
            shihab_terminalProgress.style.width = '0%';
        }
        if (sshihabb007_progressPercent) sshihabb007_progressPercent.innerText = '0%';

        if (shihab_assetIcon) {
            shihab_assetIcon.innerHTML = sshihabb007_detectPlatformIcon(inputUrl);
        }
        mehedi_writeLog("Detecting platform and routing request...", 10);

        // platform already detected above
        let mehedi_result = null;

        try {
            if (shihab_platform === 'tiktok') {
                // ── TikTok: tikwm.com GET API (CORS-enabled) ──────────────────
                mehedi_writeLog("TikTok detected · Routing to TikWM engine...", 25);
                mehedi_result = await shihab_fetchTikTok(inputUrl);

            } else if (shihab_platform === 'youtube') {
                // ── YouTube: Cobalt via CORS proxy ────────────────────────────
                mehedi_writeLog("YouTube detected · Initiating Cobalt proxy chain...", 25);
                mehedi_result = await sshihabb007_fetchViaCobaltProxy(inputUrl);

            } else {
                // ── All others: Cobalt via CORS proxy ─────────────────────────
                mehedi_writeLog("Routing to Cobalt universal engine...", 25);
                mehedi_result = await sshihabb007_fetchViaCobaltProxy(inputUrl);
            }
        } catch (err) {
            console.error("Extraction fatal error:", err);
        }

        // ── Render result ──────────────────────────────────────────────────────
        if (mehedi_result) {
            if (mehedi_result.status === 'picker' && Array.isArray(mehedi_result.picker)) {
                mehedi_writeLog("Success! Extracted gallery assets...", 100);

                shihab_trackEvent('universal_downloader_extraction_success', {
                    platform: shihab_platform,
                    format: sshihabb007_isAudioOnly ? 'audio' : 'video',
                    url_domain: (function() {
                        try { return new URL(inputUrl).hostname; } catch(e) { return 'invalid'; }
                    })(),
                    result_type: 'gallery',
                    duration_ms: Date.now() - shihab_startTime
                });

                const count = mehedi_result.picker.length;
                if (mehedi_galleryCount) {
                    mehedi_galleryCount.innerText = `${count} ${count === 1 ? 'Asset' : 'Assets'}`;
                }
                
                if (mehedi_galleryGrid) {
                    mehedi_galleryGrid.innerHTML = '';

                    mehedi_result.picker.forEach((item, index) => {
                        const itemUrl = item.url;
                        const mediaSrc = item.thumb || item.url;
                        const isVideo = item.type === 'video';

                        const card = document.createElement('div');
                        card.className = "relative rounded-2xl overflow-hidden group border border-solid transition duration-300 hover:scale-[1.03] shadow-md hover:shadow-xl";
                        card.style.cssText = "background-color: var(--bg-dark); border-color: var(--border-color); aspect-ratio: 1/1; position: relative;";

                        const img = document.createElement('img');
                        img.src = mediaSrc;
                        img.alt = `Slide ${index + 1}`;
                        img.className = "w-full h-full object-cover transition duration-300 group-hover:scale-110";
                        img.loading = "lazy";
                        card.appendChild(img);

                        if (isVideo) {
                            const playBadge = document.createElement('div');
                            playBadge.className = "absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] z-10 shadow-lg";
                            playBadge.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
                            playBadge.innerHTML = `<i class="fas fa-play"></i>`;
                            card.appendChild(playBadge);
                        }

                        // Number badge
                        const numBadge = document.createElement('div');
                        numBadge.className = "absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold z-10 shadow-sm";
                        numBadge.style.cssText = "background-color: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);";
                        numBadge.innerText = `#${index + 1}`;
                        card.appendChild(numBadge);

                        // Hover Overlay with action buttons
                        const overlay = document.createElement('div');
                        overlay.className = "absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition duration-200 z-20";
                        overlay.style.backgroundColor = "rgba(0,0,0,0.75)";

                        const btnContainer = document.createElement('div');
                        btnContainer.className = "flex gap-2 w-full";

                        // Download Button
                        const dlBtn = document.createElement('button');
                        dlBtn.type = 'button';
                        dlBtn.className = "flex-1 font-bold text-[10px] py-2 rounded-xl transition uppercase tracking-wider cursor-pointer border-none flex items-center justify-center gap-1 hover:brightness-110 active:scale-95";
                        dlBtn.style.cssText = "background-color: var(--primary-color); color: var(--bg-dark);";
                        dlBtn.innerHTML = `<i class="fas fa-arrow-down"></i> Save`;
                        
                        dlBtn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const originalHTML = dlBtn.innerHTML;
                            dlBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
                            dlBtn.disabled = true;
                            
                            shihab_trackEvent('universal_downloader_save_slide', {
                                index: index + 1,
                                type: isVideo ? 'video' : 'photo'
                            });

                            await mehedi_downloadFileDirectly(itemUrl, `shihab_extracted_${index + 1}.${isVideo ? 'mp4' : 'jpg'}`);
                            
                            dlBtn.innerHTML = `<i class="fas fa-check"></i> Done`;
                            setTimeout(() => {
                                dlBtn.innerHTML = originalHTML;
                                dlBtn.disabled = false;
                            }, 2000);
                        });

                        // Open link button
                        const openBtn = document.createElement('a');
                        openBtn.href = itemUrl;
                        openBtn.target = "_blank";
                        openBtn.className = "w-8 h-8 rounded-xl flex items-center justify-center transition border-none cursor-pointer hover:bg-white/20 text-white";
                        openBtn.style.backgroundColor = "rgba(255,255,255,0.1)";
                        openBtn.title = "View Original";
                        openBtn.innerHTML = `<i class="fas fa-external-link-alt text-[10px]"></i>`;

                        btnContainer.appendChild(dlBtn);
                        btnContainer.appendChild(openBtn);
                        overlay.appendChild(btnContainer);
                        card.appendChild(overlay);

                        mehedi_galleryGrid.appendChild(card);
                    });
                }

                setTimeout(() => {
                    if (sshihabb007_statusTerminal) sshihabb007_statusTerminal.classList.add('hidden');
                    if (mehedi_assetPresenter) mehedi_assetPresenter.classList.add('hidden');
                    if (mehedi_galleryPresenter) mehedi_galleryPresenter.classList.remove('hidden');
                }, 350);

            } else if (mehedi_result.url) {
                mehedi_writeLog("Success! Binding download stream...", 100);

                shihab_trackEvent('universal_downloader_extraction_success', {
                    platform: shihab_platform,
                    format: sshihabb007_isAudioOnly ? 'audio' : 'video',
                    url_domain: (function() {
                        try { return new URL(inputUrl).hostname; } catch(e) { return 'invalid'; }
                    })(),
                    result_type: 'single',
                    duration_ms: Date.now() - shihab_startTime
                });

                if (sshihabb007_assetTitle) sshihabb007_assetTitle.innerText = mehedi_result.title || "Lossless Media Asset";
                if (mehedi_assetMeta) {
                    mehedi_assetMeta.innerText = sshihabb007_isAudioOnly
                        ? "Format: MP3 Audio · Lossless Quality"
                        : (mehedi_result.quality || "High Definition · Lossless Stream");
                }

                if (shihab_downloadBtn) {
                    shihab_downloadBtn.href   = mehedi_result.url;
                    shihab_downloadBtn.target = '_blank';
                }

                // Render video thumbnail/preview player
                const mehedi_videoThumbnailContainer = document.getElementById('mehedi_videoThumbnailContainer');
                const mehedi_videoPlayer = document.getElementById('mehedi_videoPlayer');
                let shihab_thumbUrl = mehedi_result.thumbnail || mehedi_result.thumb || null;

                if (!shihab_thumbUrl && sshihabb007_detectPlatform(inputUrl) === 'youtube') {
                    const ytId = shihab_getYouTubeId(inputUrl);
                    if (ytId) {
                        shihab_thumbUrl = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
                    }
                }

                if (!sshihabb007_isAudioOnly && mehedi_result.url) {
                    if (mehedi_videoPlayer) {
                        mehedi_videoPlayer.src = mehedi_result.url;
                        if (shihab_thumbUrl) {
                            mehedi_videoPlayer.setAttribute('poster', shihab_thumbUrl);
                        } else {
                            mehedi_videoPlayer.removeAttribute('poster');
                        }
                        mehedi_videoPlayer.load();
                    }
                    if (mehedi_videoThumbnailContainer) {
                        mehedi_videoThumbnailContainer.classList.remove('hidden');
                    }
                } else {
                    if (mehedi_videoThumbnailContainer) {
                        mehedi_videoThumbnailContainer.classList.add('hidden');
                    }
                    if (mehedi_videoPlayer) {
                        mehedi_videoPlayer.src = '';
                        mehedi_videoPlayer.removeAttribute('poster');
                        mehedi_videoPlayer.load();
                    }
                }

                setTimeout(() => {
                    if (sshihabb007_statusTerminal) sshihabb007_statusTerminal.classList.add('hidden');
                    if (mehedi_galleryPresenter) mehedi_galleryPresenter.classList.add('hidden');
                    if (mehedi_assetPresenter) mehedi_assetPresenter.classList.remove('hidden');
                }, 350);
            } else {
                mehedi_writeLog(`<span style="color:#f87171;">All extraction routes failed.</span>`, 100);
                if (sshihabb007_progressPercent) sshihabb007_progressPercent.innerText = 'ERR';
                if (shihab_terminalProgress) shihab_terminalProgress.style.backgroundColor = '#ef4444';
                if (mehedi_workerHint) mehedi_workerHint.classList.remove('hidden');
                shihab_trackEvent('universal_downloader_extraction_failure', {
                    platform: shihab_platform,
                    format: sshihabb007_isAudioOnly ? 'audio' : 'video',
                    url_domain: (function() {
                        try { return new URL(inputUrl).hostname; } catch(e) { return 'invalid'; }
                    })(),
                    error_message: 'result_no_url_or_picker',
                    duration_ms: Date.now() - shihab_startTime
                });
            }
        } else {
            mehedi_writeLog(`<span style="color:#f87171;">All extraction routes failed.</span>`, 100);
            if (sshihabb007_progressPercent) sshihabb007_progressPercent.innerText = 'ERR';
            if (shihab_terminalProgress) shihab_terminalProgress.style.backgroundColor = '#ef4444';
            if (mehedi_workerHint) mehedi_workerHint.classList.remove('hidden');
            shihab_trackEvent('universal_downloader_extraction_failure', {
                platform: shihab_platform,
                format: sshihabb007_isAudioOnly ? 'audio' : 'video',
                url_domain: (function() {
                    try { return new URL(inputUrl).hostname; } catch(e) { return 'invalid'; }
                })(),
                error_message: 'fatal_null_result',
                duration_ms: Date.now() - shihab_startTime
            });
        }
    }

    // ─── 5. TikTok Extractor (tikwm.com · publicly CORS-safe) ────────────────
    async function shihab_fetchTikTok(videoUrl) {
        const sshihabb007_endpoints = [
            `https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`,
            `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`
        ];

        for (let i = 0; i < sshihabb007_endpoints.length; i++) {
            mehedi_writeLog(`TikWM API · Attempt ${i + 1}...`, 30 + i * 15);
            try {
                const res = await fetch(sshihabb007_endpoints[i]);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                if (data.code === 0 && data.data) {
                    const d = data.data;
                    // Support TikTok images slideshow
                    if (d.images && Array.isArray(d.images) && d.images.length > 0 && !sshihabb007_isAudioOnly) {
                        return {
                            status: 'picker',
                            picker: d.images.map(img => ({ type: 'photo', url: img, thumb: img })),
                            title: d.title || "TikTok Slideshow"
                        };
                    }
                    const videoLink = sshihabb007_isAudioOnly
                        ? (d.music_info?.play || d.play)
                        : (d.play || d.hdplay || d.wmplay);
                    return {
                        url:     videoLink,
                        title:   d.title || "TikTok Video",
                        quality: sshihabb007_isAudioOnly ? "Audio · MP3" : "HD Video · No Watermark",
                        thumbnail: d.cover || d.origin_cover || d.dynamic_cover || null
                    };
                }
            } catch (e) {
                console.warn(`TikWM attempt ${i+1} failed:`, e.message);
            }
        }
        return null;
    }

    // ─── 6. Universal Extractor via Cobalt + CORS Proxy ───────────────────────
    async function sshihabb007_fetchViaCobaltProxy(inputUrl) {
        // Cobalt v10 canonical request body
        const shihab_body = JSON.stringify({
            url:           inputUrl,
            videoQuality:  '1080',
            audioFormat:   sshihabb007_isAudioOnly ? 'mp3' : 'best',
            audioBitrate:  '320',
            downloadMode:  sshihabb007_isAudioOnly ? 'audio' : 'auto',
            filenameStyle: 'classic',
            disableMetadata: false
        });

        // 1. FIRST PRIORITY: Call your personal Cloudflare Worker DIRECTLY (no proxy wrapper needed!)
        const shihab_personalWorker = 'https://cobalt-cors-proxy-udownloader.sshihabb007.workers.dev/';
        mehedi_writeLog(`Connecting to personal Cloudflare Worker...`, 20);

        try {
            const workerRes = await fetch(shihab_personalWorker, {
                method:  'POST',
                headers: {
                    'Accept':       'application/json',
                    'Content-Type': 'application/json'
                },
                body: shihab_body
            });

            if (workerRes.ok) {
                const workerData = await workerRes.json();
                if ((workerData.status === 'stream' || workerData.status === 'redirect' ||
                     workerData.status === 'success' || workerData.status === 'tunnel') && workerData.url) {
                    return { 
                        url: workerData.url, 
                        title: workerData.text || "Media Stream", 
                        quality: "1080p HD · Lossless",
                        thumbnail: workerData.thumbnail || workerData.thumb || null
                    };
                }
                if (workerData.status === 'picker' && Array.isArray(workerData.picker) && workerData.picker.length > 0) {
                    return {
                        status: 'picker',
                        picker: workerData.picker,
                        title: workerData.text || "Extracted Slide Gallery"
                    };
                }
            }
        } catch (e) {
            console.warn("Personal Worker request failed, falling back to public Cobalt instances...", e.message);
        }

        // 2. SECOND PRIORITY: Public instances fallback (using CORS proxy wrappers)
        const sshihabb007_instances = [
            'https://fox.kittycat.boo/',
            'https://dog.kittycat.boo/',
            'https://cobaltapi.kittycat.boo/',
            'https://cobaltapi.squair.xyz/',
            'https://api.cobalt.liubquanti.click/',
            'https://api.dl.woof.monster/'
        ];

        // CORS proxy wrappers for public fallback
        const sshihabb007_proxyBuilders = [
            (t) => `https://corsproxy.io/?url=${encodeURIComponent(t)}`,
            (t) => `https://proxy.cors.sh/${t}`,
            (t) => t // Direct
        ];

        let mehedi_attempt = 0;
        const sshihabb007_total = sshihabb007_instances.length * sshihabb007_proxyBuilders.length;

        for (const shihab_instance of sshihabb007_instances) {
            for (const sshihabb007_buildProxy of sshihabb007_proxyBuilders) {
                mehedi_attempt++;
                const pct = Math.min(30 + Math.floor((mehedi_attempt / sshihabb007_total) * 60), 92);
                let label = shihab_instance;
                try { label = new URL(shihab_instance).hostname; } catch(e) {}

                mehedi_writeLog(`Fallback · <span style="color:var(--primary-color);">${label}</span> · Proxy ${mehedi_attempt}...`, pct);

                try {
                    const proxyUrl = sshihabb007_buildProxy(shihab_instance);
                    const res = await fetch(proxyUrl, {
                        method:  'POST',
                        headers: {
                            'Accept':       'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: shihab_body
                    });

                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const data = await res.json();

                    if ((data.status === 'stream' || data.status === 'redirect' ||
                         data.status === 'success' || data.status === 'tunnel') && data.url) {
                        return { 
                            url: data.url, 
                            title: data.text || "Media Stream", 
                            quality: "1080p HD · Lossless",
                            thumbnail: data.thumbnail || data.thumb || null
                        };
                    }
                    if (data.status === 'picker' && Array.isArray(data.picker) && data.picker.length > 0) {
                        return {
                            status: 'picker',
                            picker: data.picker,
                            title: data.text || "Extracted Slide Gallery"
                        };
                    }
                    if (data.status === 'error') break; // Try next instance if explicitly failed

                } catch (e) {
                    console.warn(`[Cobalt Fallback] ${label} via proxy ${mehedi_attempt}:`, e.message);
                }
            }
        }
        return null;
    }

    // ─── 7. Direct File Blob Downloader (bypasses CORS restrictions for save buttons) ───
    async function mehedi_downloadFileDirectly(url, filename) {
        try {
            // First attempt: fetch via premium public image proxy to bypass Instagram CDN CORS blocks
            const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const tempLink = document.createElement('a');
            tempLink.href = blobUrl;
            tempLink.download = filename;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 10000);
        } catch (err) {
            console.warn("Direct blob download failed, falling back to direct open:", err);
            // Fallback: Open in new tab so user can manual right-click save
            window.open(url, '_blank');
        }
    }

    // ─── 8. Terminal UI ────────────────────────────────────────────────────────
    function mehedi_writeLog(html, percent) {
        const mehedi_terminalLog          = document.getElementById('mehedi_terminalLog');
        const shihab_terminalProgress     = document.getElementById('shihab_terminalProgress');
        const sshihabb007_progressPercent = document.getElementById('sshihabb007_progressPercent');

        if (mehedi_terminalLog) {
            mehedi_terminalLog.innerHTML = `<span style="color:var(--text-muted);font-weight:700;">&gt;</span>&nbsp;${html}<span class="shihab_cursor_blink" style="color:var(--primary-color);margin-left:4px;">_</span>`;
        }
        if (shihab_terminalProgress && !isNaN(percent)) {
            shihab_terminalProgress.style.width = `${percent}%`;
        }
        if (sshihabb007_progressPercent && !isNaN(percent)) {
            sshihabb007_progressPercent.innerText = `${percent}%`;
        }
    }

    // ─── 9. Platform Detector ──────────────────────────────────────────────────
    function sshihabb007_detectPlatform(url) {
        const u = url.toLowerCase();
        if (u.includes('tiktok') || u.includes('vm.tiktok')) return 'tiktok';
        if (u.includes('youtube') || u.includes('youtu.be'))  return 'youtube';
        if (u.includes('instagram'))  return 'instagram';
        if (u.includes('twitter') || u.includes('x.com')) return 'twitter';
        if (u.includes('facebook') || u.includes('fb.'))  return 'facebook';
        return 'other';
    }

    // ─── 10. Platform Icon ─────────────────────────────────────────────────────
    function sshihabb007_detectPlatformIcon(url) {
        const p = sshihabb007_detectPlatform(url);
        const icons = {
            tiktok:    `<i class="fab fa-tiktok text-3xl" style="color:#69C9D0;"></i>`,
            youtube:   `<i class="fab fa-youtube text-3xl" style="color:#ff0000;"></i>`,
            instagram: `<i class="fab fa-instagram text-3xl" style="color:#E1306C;"></i>`,
            twitter:   `<i class="fab fa-twitter text-3xl" style="color:#1DA1F2;"></i>`,
            facebook:  `<i class="fab fa-facebook text-3xl" style="color:#1877F2;"></i>`,
            other:     `<i class="fas fa-play-circle text-3xl" style="color:var(--primary-color);"></i>`
        };
        return icons[p] || icons.other;
    }

    // YouTube ID extraction helper
    function shihab_getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mehedi_initUniversalDownloader);
} else {
    mehedi_initUniversalDownloader();
}

