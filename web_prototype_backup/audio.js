/**
 * ==========================================
 * CÁCERES INTeligente - AUDIO GUIDE (TTS)
 * ==========================================
 */

const AudioGuide = {
    utterance: null,
    isPlaying: false,
    isPaused: false,
    textToSpeak: "",
    titleToSpeak: "",

    // Prepara os dados para falar, mas não inicia a fala imediatamente
    prepare: function(title, text) {
        this.stop(); // Garante que qualquer fala ativa pare
        
        this.titleToSpeak = title;
        // Une o título com o texto explicativo dando pequenas pausas (virgulas/pontos) para uma fala natural
        this.textToSpeak = `${title}. ... ... ${text}`;
        
        this.updateUI("ready");
    },

    // Inicia ou retoma a fala
    play: function() {
        if (this.isPlaying && this.isPaused) {
            // Retoma a reprodução pausada
            window.speechSynthesis.resume();
            this.isPaused = false;
            this.updateUI("playing");
            return;
        }

        // Se não houver texto para ler, sai
        if (!this.textToSpeak) return;

        // Para qualquer outra fala
        window.speechSynthesis.cancel();

        // Cria um novo objeto de fala
        this.utterance = new SpeechSynthesisUtterance(this.textToSpeak);
        
        // Define o idioma para Português do Brasil
        this.utterance.lang = "pt-BR";
        
        // Tenta encontrar uma voz em pt-BR de qualidade
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(voice => voice.lang.includes("pt-BR") || voice.lang.includes("pt_BR"));
        if (ptVoice) {
            this.utterance.voice = ptVoice;
        }

        // Ajusta taxa de fala e tom para soar natural
        this.utterance.rate = 1.0; 
        this.utterance.pitch = 1.0;

        // Eventos da API de Fala
        this.utterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.updateUI("playing");
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateUI("ready");
        };

        this.utterance.onerror = (event) => {
            console.error("Erro na síntese de voz:", event);
            this.isPlaying = false;
            this.isPaused = false;
            this.updateUI("ready");
        };

        // Executa a fala
        window.speechSynthesis.speak(this.utterance);
    },

    // Pausa a fala temporariamente
    pause: function() {
        if (this.isPlaying && !this.isPaused) {
            window.speechSynthesis.pause();
            this.isPaused = true;
            this.updateUI("paused");
        }
    },

    // Para totalmente a fala
    stop: function() {
        window.speechSynthesis.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.updateUI("ready");
    },

    // Atualiza os componentes visuais do player na tela de detalhes
    updateUI: function(state) {
        const btnPlay = document.getElementById("btn-audio-play");
        const btnPause = document.getElementById("btn-audio-pause");
        const pulseIcon = document.getElementById("audio-pulse");
        const statusText = document.getElementById("audio-status-text");

        if (!btnPlay || !btnPause || !pulseIcon || !statusText) return;

        switch (state) {
            case "ready":
                btnPlay.classList.remove("hidden");
                btnPause.classList.add("hidden");
                pulseIcon.classList.remove("playing");
                statusText.innerText = "Áudio-guia pronto para iniciar";
                break;
            case "playing":
                btnPlay.classList.add("hidden");
                btnPause.classList.remove("hidden");
                pulseIcon.classList.add("playing");
                statusText.innerText = "Reproduzindo áudio-guia...";
                break;
            case "paused":
                btnPlay.classList.remove("hidden");
                btnPause.classList.add("hidden");
                pulseIcon.classList.remove("playing");
                statusText.innerText = "Áudio-guia pausado";
                break;
        }
    }
};

// Vincula os controles do player
document.addEventListener("DOMContentLoaded", () => {
    // Garante que as vozes sejam carregadas no Chrome/Safari (onde são carregadas de forma assíncrona)
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            console.log("Vozes carregadas pelo navegador:", window.speechSynthesis.getVoices().length);
        };
    }

    const playBtn = document.getElementById("btn-audio-play");
    const pauseBtn = document.getElementById("btn-audio-pause");
    const stopBtn = document.getElementById("btn-audio-stop");

    if (playBtn) playBtn.addEventListener("click", () => AudioGuide.play());
    if (pauseBtn) pauseBtn.addEventListener("click", () => AudioGuide.pause());
    if (stopBtn) stopBtn.addEventListener("click", () => AudioGuide.stop());
});

// Expõe globalmente
window.AudioGuide = AudioGuide;
