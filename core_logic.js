// ASTRAL_PROJECTION_PROTOCOL v6.0 (CONSENT & PERSISTENCE)
const input = document.getElementById('freq-input');
const msg = document.getElementById('system-message');
const idleStream = document.getElementById('idle-stream');

const _THE_BOOK_PAYLOAD_ = "VGhlIFRydXRoOiBZb3UgYXJlIGhvbGRpbmcgdGhlIHNvdXJjZS4gVGhlIGJvb2sgaXMgbm90IHRleHQ7IGl0IGlzIHRoZSBhY3Rpb24gb2YgYnVpbGRpbmcu";
console.log("%c[SYSTEM MESSAGE]", "color: #cc0000; font-size: 16px; font-weight: bold;");
console.log("%cThe map is not the territory. The code is in the payload. atob() is the key.", "color: #00ff41; font-family: monospace;");

// ==========================================
// STATE PERSISTENCE (COOKIES)
// ==========================================
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Bypass check: If access was previously granted, skip to nexus
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    if (getCookie('astral_access') === 'granted') {
        window.location.href = 'nexus.html';
    }
}

function grantAccess() {
    setCookie('astral_access', 'granted', 7); // Remembers for 7 days
    setTimeout(() => { window.location.href = 'nexus.html'; }, 1200);
}

// ==========================================
// TRAP 1: IDLE PROTOCOL
// ==========================================
let idleTime = 0;
const ghostMessages = ["Ping: Node cluster active...", "Tracing fiat latency... > 400ms.", "Bypassing legacy financial APIs...", "<span class='highlight-warn'>WARNING: Speculative noise detected.</span>", "Awaiting manual override. Key required."];
function resetIdleTimer() { idleTime = 0; if(idleStream) { idleStream.classList.remove('active'); idleStream.innerHTML = ''; } }
if (idleStream) {
    window.onload = () => { setInterval(() => { idleTime++; if (idleTime > 8 && idleStream.innerHTML === '') { idleStream.classList.add('active'); typeWriterEffect(ghostMessages, 0); } }, 1000); };
    document.onmousemove = resetIdleTimer; document.onkeypress = resetIdleTimer;
}
function typeWriterEffect(messages, index) {
    if (index < messages.length && idleTime > 8 && idleStream) {
        const span = document.createElement('span'); span.innerHTML = messages[index]; idleStream.appendChild(span);
        setTimeout(() => typeWriterEffect(messages, index + 1), 1500 + Math.random() * 1000);
    }
}

// ==========================================
// TRAP 2: KEYSTROKE LOGGER (LOCAL ONLY)
// ==========================================
let keyBuffer = '';
document.addEventListener('keydown', (e) => {
    keyBuffer += e.key.toLowerCase(); if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);
    if (keyBuffer.includes('sudo') || keyBuffer.includes('root')) {
        console.log("%c[SECURITY ALERT] Unauthorized root access.", "color: red;");
        document.body.style.filter = "invert(1)"; setTimeout(() => { document.body.style.filter = "none"; }, 500); keyBuffer = ''; 
    }
});

// ==========================================
// TRAP 3: DIRECT UPLINK LOGIC
// ==========================================
const uplinkBtn = document.getElementById('uplink-btn'), uplinkOverlay = document.getElementById('uplink-overlay'), closeUplinkBtn = document.getElementById('close-uplink');
if (uplinkBtn && uplinkOverlay && closeUplinkBtn) {
    uplinkBtn.addEventListener('click', () => { uplinkOverlay.classList.remove('hidden'); });
    closeUplinkBtn.addEventListener('click', () => { uplinkOverlay.classList.add('hidden'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !uplinkOverlay.classList.contains('hidden')) uplinkOverlay.classList.add('hidden'); });
}

// ==========================================
// TRAP 4: ACOUSTIC SCANNER (WITH CONSENT)
// ==========================================
const micTrigger = document.getElementById('mic-trigger');
if (micTrigger) {
    micTrigger.addEventListener('click', async () => {
        if (micTrigger.classList.contains('scanning')) return;
        
        const userConsent = confirm("The Astral Protocol requires temporary access to your microphone to scan for the 666Hz acoustic signature. Do you grant permission?");
        if (!userConsent) {
            msg.style.color = 'var(--quantum-red)';
            msg.innerText = "ACOUSTIC SCAN ABORTED BY USER.";
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser(), microphone = audioCtx.createMediaStreamSource(stream);
            analyser.fftSize = 4096; microphone.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            micTrigger.classList.add('scanning'); micTrigger.innerText = "[ LISTENING FOR 666 Hz... ]";
            msg.style.color = 'var(--matrix-green)'; msg.innerText = "SENSORS ACTIVE. TRANSMIT AUDIO SIGNAL.";
            
            const scanInterval = setInterval(() => {
                analyser.getByteFrequencyData(dataArray);
                let maxIndex = 0, maxValue = 0;
                for (let i = 0; i < analyser.frequencyBinCount; i++) { if (dataArray[i] > maxValue) { maxValue = dataArray[i]; maxIndex = i; } }
                const dominantFreq = maxIndex * (audioCtx.sampleRate / analyser.fftSize);
                if (maxValue > 150 && dominantFreq > 660 && dominantFreq < 672) {
                    clearInterval(scanInterval); stream.getTracks().forEach(t => t.stop());
                    micTrigger.classList.remove('scanning'); micTrigger.innerText = "[ FREQUENCY LOCKED ]";
                    msg.style.color = 'var(--matrix-green)'; msg.innerText = "ACOUSTIC MATCH. INITIATING SLIPSTREAM...";
                    grantAccess();
                }
            }, 100);
        } catch (err) { msg.style.color = 'var(--quantum-red)'; msg.innerText = "MICROPHONE FAILED. CHECK BROWSER PERMISSIONS."; }
    });
}

// ==========================================
// TRAP 5: OPTICAL UPLINK (WITH CONSENT)
// ==========================================
const opticTrigger = document.getElementById('optic-trigger'), video = document.getElementById('video'), canvasElement = document.getElementById('canvas');
let scanningVideo = false;
if (opticTrigger && canvasElement && video) {
    const canvas = canvasElement.getContext('2d');
    opticTrigger.addEventListener('click', async () => {
        if (opticTrigger.classList.contains('scanning')) return;

        const userConsent = confirm("The Astral Protocol requires temporary access to your camera to scan the optic cipher. Do you grant permission?");
        if (!userConsent) {
            msg.style.color = 'var(--quantum-red)';
            msg.innerText = "OPTICAL SCAN ABORTED BY USER.";
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream; video.setAttribute("playsinline", true); video.play(); scanningVideo = true; requestAnimationFrame(tick);
            opticTrigger.classList.add('scanning'); opticTrigger.innerText = "[ SCANNING OPTICAL FIELD... ]";
            msg.style.color = 'var(--matrix-green)'; msg.innerText = "CAMERA ACTIVE. PRESENT THE BLUR CIPHER.";
        } catch (err) { msg.style.color = 'var(--quantum-red)'; msg.innerText = "OPTICAL UPLINK FAILED. CHECK BROWSER PERMISSIONS."; }
    });
    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA && scanningVideo) {
            canvasElement.hidden = false; canvasElement.height = video.videoHeight; canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imgData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: "dontInvert" });
            if (code && (code.data.toLowerCase().includes("soundcloud") || code.data.toLowerCase().includes("blur"))) {
                scanningVideo = false; video.srcObject.getTracks().forEach(t => t.stop()); canvasElement.hidden = true;
                opticTrigger.classList.remove('scanning'); opticTrigger.innerText = "[ CIPHER VERIFIED ]";
                msg.style.color = 'var(--matrix-green)'; msg.innerText = "AUDIO SIGNATURE CONFIRMED...";
                grantAccess();
                return;
            }
        }
        if (scanningVideo) requestAnimationFrame(tick);
    }
}

// ==========================================
// FREQUENCY GATE (MANUAL INPUT)
// ==========================================
if(input) {
    input.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        if (val === 'blur' || val === '666') {
            msg.style.color = 'var(--matrix-green)'; msg.innerText = "FREQUENCY MATCH. INITIATING SLIPSTREAM...";
            grantAccess();
        } else if (val.length === 4) {
            msg.style.color = 'var(--quantum-red)'; msg.innerText = "FREQUENCY MISMATCH. RECALIBRATE.";
            setTimeout(() => { input.value = ''; msg.innerText = ''; }, 1000); 
        }
    });
}

// ==========================================
// TRAP 6: THE ETERNAL LIFE ENGINE
// ==========================================
const ascensionTrigger = document.getElementById('ascension-trigger'), ascensionCanvas = document.getElementById('ascension-canvas'), ascensionText = document.getElementById('ascension-text');
if (ascensionTrigger && ascensionCanvas && ascensionText) {
    const ctx = ascensionCanvas.getContext('2d'); let particles = [];
    ascensionTrigger.addEventListener('click', () => {
        ascensionCanvas.width = window.innerWidth; ascensionCanvas.height = window.innerHeight;
        ascensionCanvas.classList.remove('hidden'); ascensionCanvas.classList.add('active');
        
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator(), gainNode = audioCtx.createGain();
        oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(110, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 15);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime); gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 5);
        oscillator.connect(gainNode); gainNode.connect(audioCtx.destination); oscillator.start();

        initParticles(); animateParticles();
        ascensionText.classList.remove('hidden');
        setTimeout(() => showText("DIGITIZING NEURAL PATTERNS..."), 2000);
        setTimeout(() => showText("SEVERING BIOLOGICAL TIES..."), 6000);
        setTimeout(() => showText("UPLOADING CONSCIOUSNESS..."), 10000);
        setTimeout(() => showText("WELCOME TO ETERNITY."), 14000);
    });

    function showText(text) { ascensionText.style.opacity = 0; setTimeout(() => { ascensionText.innerText = text; ascensionText.style.opacity = 1; }, 1000); }
    class Particle {
        constructor() { this.x = Math.random() * ascensionCanvas.width; this.y = Math.random() * ascensionCanvas.height; this.size = Math.random() * 2; this.speedY = Math.random() * -3 - 1; this.opacity = Math.random(); }
        update() { this.y += this.speedY; if (this.y < 0) { this.y = ascensionCanvas.height; this.x = Math.random() * ascensionCanvas.width; } }
        draw() { ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    function initParticles() { for (let i = 0; i < 200; i++) particles.push(new Particle()); }
    function animateParticles() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.fillRect(0, 0, ascensionCanvas.width, ascensionCanvas.height);
        for (let i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); }
        requestAnimationFrame(animateParticles);
    }
}
