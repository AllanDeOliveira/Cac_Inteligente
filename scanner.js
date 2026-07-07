/**
 * ==========================================
 * CÁCERES INTELIGENTE - QR CODE SCANNER
 * ==========================================
 */

const QrScanner = {
    html5QrCode: null,
    scannerId: "interactive-scanner",
    isScanning: false,
    currentFacingMode: "environment", // 'environment' para câmera traseira, 'user' para frontal

    // Inicializa a câmera e começa a escanear
    start: async function() {
        if (this.isScanning) return;
        
        const container = document.getElementById(this.scannerId);
        if (!container) return;
        
        container.innerHTML = ""; // Limpa qualquer conteúdo anterior

        try {
            this.html5QrCode = new Html5Qrcode(this.scannerId);
            
            const config = {
                fps: 10,
                qrbox: (width, height) => {
                    // Retorna uma caixa de scan proporcional ao tamanho do container
                    const minSize = Math.min(width, height);
                    return {
                        width: Math.floor(minSize * 0.65),
                        height: Math.floor(minSize * 0.65)
                    };
                },
                aspectRatio: 1.0
            };

            await this.html5QrCode.start(
                { facingMode: this.currentFacingMode },
                config,
                (decodedText, decodedResult) => {
                    // Sucesso no scan
                    this.onScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // Erro de leitura comum (silencioso para não encher o console de logs de tentativas)
                }
            );

            this.isScanning = true;
            console.log("Scanner de QR Code iniciado com câmera:", this.currentFacingMode);
            
            // Atualiza classe ativa no botão central da nav-bar
            const scanBtn = document.querySelector(".scanner-btn");
            if (scanBtn) scanBtn.classList.add("active");

        } catch (err) {
            console.error("Erro ao iniciar o scanner de QR Code:", err);
            container.innerHTML = `
                <div class="scanner-error" style="padding: 30px; text-align: center; color: #ef4444; font-size: 0.85rem;">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 12px;">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p>Não foi possível acessar a câmera do aparelho.</p>
                    <p style="margin-top: 8px; font-size: 0.75rem; color: #9ca3af;">Verifique as permissões de câmera do seu navegador.</p>
                </div>
            `;
        }
    },

    // Para a câmera
    stop: async function() {
        if (!this.isScanning || !this.html5QrCode) return;

        try {
            await this.html5QrCode.stop();
            this.isScanning = false;
            this.html5QrCode = null;
            
            // Limpa o container para liberar recursos da câmera
            const container = document.getElementById(this.scannerId);
            if (container) container.innerHTML = "";
            
            // Remove classe ativa do botão central da nav-bar
            const scanBtn = document.querySelector(".scanner-btn");
            if (scanBtn) scanBtn.classList.remove("active");
            
            console.log("Scanner de QR Code parado com sucesso.");
        } catch (err) {
            console.error("Erro ao parar o scanner de QR Code:", err);
        }
    },

    // Alternar entre câmera frontal e traseira
    toggleCamera: async function() {
        if (!this.isScanning) return;
        
        await this.stop();
        this.currentFacingMode = this.currentFacingMode === "environment" ? "user" : "environment";
        await this.start();
    },

    // Tratamento de sucesso na leitura
    onScanSuccess: function(decodedText) {
        // Valida se o texto escaneado corresponde ao ID de algum monumento
        const cleanId = decodedText.trim().toLowerCase();
        const isValidMonument = MONUMENTS.some(m => m.id === cleanId);
        
        if (isValidMonument) {
            // Emite som de sucesso
            this.playSuccessBeep();
            
            // Vibração física caso suportado
            if (navigator.vibrate) {
                navigator.vibrate(150);
            }
            
            // Para a câmera e redireciona
            this.stop().then(() => {
                openMonumentDetails(cleanId);
            });
        } else {
            console.warn("QR Code escaneado não pertence a um monumento válido:", decodedText);
            // Avisa o usuário mas continua escanendo
            showToast("QR Code inválido ou não pertencente ao projeto.");
        }
    },

    // Emite um bipe sonoro eletrônico usando a API AudioContext do navegador (sem arquivos adicionais)
    playSuccessBeep: function() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = "sine";
            // Frequência de 1000Hz (som limpo de bip de caixa)
            oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
            // Bip curto de 150ms
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (e) {
            console.error("Erro ao emitir o som de bip do scanner:", e);
        }
    }
};

// Toast simples de notificação interna no aplicativo
function showToast(message) {
    // Cria elemento de toast dinâmico se não existir
    let toast = document.getElementById("app-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "app-toast";
        toast.style.cssText = `
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: rgba(239, 68, 68, 0.95);
            color: white;
            padding: 10px 20px;
            border-radius: 30px;
            font-size: 0.8rem;
            font-weight: 500;
            z-index: 2000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            pointer-events: none;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        document.querySelector(".app-container").appendChild(toast);
    }
    
    toast.innerText = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(-20px)";
    }, 2500);
}

// Configura evento de clique no botão de alternar câmera
document.addEventListener("DOMContentLoaded", () => {
    const btnToggle = document.getElementById("btn-toggle-camera");
    if (btnToggle) {
        btnToggle.addEventListener("click", () => {
            QrScanner.toggleCamera();
        });
    }
});

// Expõe globalmente
window.QrScanner = QrScanner;
window.showToast = showToast;
