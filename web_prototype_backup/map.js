/**
 * ==========================================
 * CÁCERES INTELIGENTE - LEAFLET INTERACTIVE MAP
 * ==========================================
 */

const AppMap = {
    map: null,
    markers: {},

    // Inicializa o mapa
    init: function() {
        const container = document.getElementById("map-container");
        if (!container) return;

        // Coordenadas centrais de Cáceres - MT
        const caceresCoords = [-16.0718, -57.6787];
        
        // Inicializa o mapa do Leaflet
        this.map = L.map("map-container", {
            zoomControl: false // Oculta o padrão para criarmos um posicionado melhor ou personalizado
        });

        // Define a visualização padrão
        this.map.setView(caceresCoords, 14);

        // Adiciona controle de zoom no canto superior direito para não bater com o cabeçalho
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);

        // Camada do OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        // Adiciona marcadores dos monumentos históricos
        this.addMonumentMarkers();
    },

    // Adiciona os pins personalizados de cada monumento histórico
    addMonumentMarkers: function() {
        if (!this.map || !window.MONUMENTS) return;

        window.MONUMENTS.forEach(monument => {
            // Cria um ícone HTML personalizado com CSS (marker-pin)
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin" id="marker-pin-${monument.id}"></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            // Cria o marker e o adiciona ao mapa
            const marker = L.marker([monument.lat, monument.lng], { icon: customIcon })
                .addTo(this.map);
            
            // Adiciona popup informativo rápido
            marker.bindPopup(`
                <div class="map-popup-content" style="color: var(--text-dark); font-family: var(--font-body); padding: 4px;">
                    <strong style="font-family: var(--font-title); font-size: 0.95rem; display:block; margin-bottom:4px;">${monument.title}</strong>
                    <span style="font-size: 0.75rem; color: #6b7280; display:block; margin-bottom:8px;">${monument.period}</span>
                    <button onclick="window.openMonumentDetails('${monument.id}')" style="
                        background: #08100c; 
                        color: #dfb15b; 
                        border: none; 
                        padding: 6px 12px; 
                        border-radius: 8px; 
                        font-size: 0.75rem; 
                        font-family: var(--font-title); 
                        font-weight: 600; 
                        cursor: pointer; 
                        width: 100%;
                        display: block;
                        text-align: center;
                    ">Ver Detalhes</button>
                </div>
            `);

            // Salva a referência do marker para podermos focar futuramente
            this.markers[monument.id] = marker;
        });
    },

    // Foca o mapa em um monumento específico (ex: quando o usuário clica em "Ver no mapa" a partir da tela de detalhes)
    focusOnMonument: function(id) {
        const monument = window.MONUMENTS.find(m => m.id === id);
        const marker = this.markers[id];

        if (this.map && monument && marker) {
            // Move o mapa com animação suave
            this.map.setView([monument.lat, monument.lng], 16, {
                animate: true,
                duration: 1.0
            });
            
            // Abre o popup do marcador
            setTimeout(() => {
                marker.openPopup();
            }, 1000);
        }
    },

    // Força o recálculo do layout do Leaflet (necessário após exibir o container do mapa que estava invisível)
    invalidateSize: function() {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize(true);
            }, 200);
        }
    }
};

// Inicializa o mapa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    AppMap.init();
});

// Expõe globalmente
window.AppMap = AppMap;
