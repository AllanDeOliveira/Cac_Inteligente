/**
 * ==========================================
 * CÁCERES INTELIGENTE - CORE APP LOGIC
 * ==========================================
 */

// Banco de Dados dos Monumentos Históricos de Cáceres
const MONUMENTS = [
    {
        id: "marco-do-jauru",
        title: "Marco do Jauru",
        period: "Século XVIII - 1754",
        image: "images/marco_do_jauru.png",
        address: "Praça Barão do Rio Branco, Centro, Cáceres - MT",
        lat: -16.0734,
        lng: -57.6791,
        history: "O Marco do Jauru é um monumento histórico de extrema importância para a geopolítica sul-americana. Feito de cantaria de mármore português de Lisboa, foi erguido originalmente na foz do Rio Jauru em 2 de fevereiro de 1754 pelos comissários demarcadores do Tratado de Madri de 1750. Ele representava o limite territorial definitivo entre os impérios de Portugal e Espanha na América do Sul. Em 1883, por iniciativa do Coronel Antônio Maria Coelho, o marco foi transportado de barco pelo Rio Paraguai até a praça central de Cáceres, em frente à Catedral de São Luiz, onde permanece como o maior símbolo cívico e de resistência territorial da cidade.",
        curiosities: [
            "O monumento foi esculpido em Portugal e veio desmontado em caravanas navais até o coração do continente sul-americano.",
            "Possui quatro faces que exibem as armas esculpidas de Portugal e da Espanha, dividindo formalmente as possessões das coroas europeias.",
            "A movimentação do monumento em 1883 foi uma operação militar e logística complexa de grande orgulho cívico para a região."
        ]
    },
    {
        id: "catedral-sao-luiz",
        title: "Catedral de São Luiz de Cáceres",
        period: "Século XX - 1919",
        image: "images/catedral_sao_luiz.png",
        address: "Praça Barão do Rio Branco, Centro, Cáceres - MT",
        lat: -16.0725,
        lng: -57.6788,
        history: "A Catedral de São Luiz de Cáceres é um dos mais belos exemplares de arquitetura neogótica no estado de Mato Grosso. Dedicada a São Luiz, padroeiro da cidade, a construção da atual catedral teve início em 1919 sob a liderança de dom Galibert, bispo da diocese. Ela substituiu a antiga matriz colonial que se encontrava em ruínas. A catedral chama atenção pelas suas belíssimas linhas ogivais ascendentes, vitrais importados da Europa que retratam passagens bíblicas, e uma imponente torre sineira. É o coração espiritual de Cáceres e domina o horizonte urbano da praça central da cidade.",
        curiosities: [
            "Os vitrais da catedral foram trazidos de navio diretamente da França, representando um luxo arquitetônico para a época no interior do Brasil.",
            "Sua planta interna segue o clássico estilo de cruz latina com pé-direito alto que proporciona uma acústica e ventilação incríveis.",
            "São Luiz de Cáceres foi fundada em 1778, mas a catedral em estilo neogótico só foi totalmente concluída e consagrada décadas após o início de suas obras."
        ]
    },
    {
        id: "fazenda-jacobina",
        title: "Sede da Fazenda Jacobina",
        period: "Século XVIII - 1775",
        image: "images/fazenda_jacobina.png",
        address: "Zona Rural (Acesso pela BR-070), Cáceres - MT",
        lat: -16.1432,
        lng: -57.5927,
        history: "Fundada por Leonardo de Oliveira em 1775, a Fazenda Jacobina foi a maior, mais rica e mais famosa fazenda de gado, açúcar e aguardente da província de Mato Grosso durante o período colonial e imperial. Seu casarão em estilo colonial com dezenas de cômodos, capela interna e senzala, abrigou centenas de escravizados e recebeu ilustres naturalistas europeus, como Langsdorff e Castelnau. A fazenda desempenhou papel crucial no abastecimento militar da região e no desenvolvimento socioeconômico da fronteira oeste, sendo palco de momentos marcantes de opulência e também de conflitos sociais e revoltas de escravizados.",
        curiosities: [
            "A Jacobina chegou a ter mais de 200 escravizados simultâneos, funcionando quase como uma vila autônoma no meio do sertão mato-grossense.",
            "O naturalista francês Francis de Castelnau a descreveu em 1845 como um verdadeiro 'palácio no deserto' devido à riqueza de seus proprietários.",
            "A capela da fazenda guarda afrescos históricos pintados com pigmentos naturais extraídos da própria flora local."
        ]
    },
    {
        id: "porto-caceres-rio-paraguai",
        title: "Porto de Cáceres e Rio Paraguai",
        period: "Século XIX/XX - Comercial",
        image: "images/porto_caceres.png",
        address: "Rua Comandante Balduíno, Orla do Rio Paraguai, Cáceres - MT",
        lat: -16.0761,
        lng: -57.6811,
        history: "O Rio Paraguai é a artéria vital que permitiu o nascimento, sobrevivência e ascensão comercial de Cáceres. A navegação fluvial regular, estabelecida de forma intensa a partir da segunda metade do século XIX com a abertura da navegação internacional da bacia platina, transformou o Porto de Cáceres em um ponto estratégico de entrada e saída de mercadorias. Por aqui passavam grandes barcos a vapor que traziam novidades da Europa e levavam borracha, poaia (ipecacuanha), couro e charque. Os casarões coloniais da orla do porto refletem esse período áureo de comércio fervilhante com Montevidéu e Buenos Aires.",
        curiosities: [
            "Cáceres tinha uma alfândega federal movimentadíssima no século XIX, recebendo produtos importados diretamente de portos europeus antes mesmo de chegarem a Cuiabá.",
            "O Rio Paraguai banha o pantanal mato-grossense e Cáceres é conhecida internacionalmente como o principal portal fluvial de entrada para o ecoturismo na região.",
            "Nas proximidades do porto antigo, ainda funcionam pequenos estaleiros e o comércio de pescadores artesanais locais."
        ]
    },
    {
        id: "igreja-perpetuo-socorro",
        title: "Igreja de N. Sra. do Perpétuo Socorro",
        period: "Século XX - 1950",
        image: "images/igreja_perpetuo_socorro.png",
        address: "Av. Sete de Setembro, Bairro Perpétuo Socorro, Cáceres - MT",
        lat: -16.0701,
        lng: -57.6750,
        history: "A Igreja de Nossa Senhora do Perpétuo Socorro é um marco histórico do crescimento de Cáceres para além da praça central no século XX. Construída nos anos 1950 sob a influência dos missionários Redentoristas americanos que se instalaram na cidade, a igreja apresenta linhas arquitetônicas neoclássicas simplificadas e se tornou o epicentro social e religioso de um dos bairros mais tradicionais da cidade. O local representa o intercâmbio cultural e espiritual de Cáceres com missões estrangeiras, abrigando festas tradicionais e manifestações culturais típicas cacerenses.",
        curiosities: [
            "Os padres redentoristas americanos trouxeram novos métodos pedagógicos e sociais para a Cáceres dos anos 50, influenciando a educação local.",
            "A festa de Nossa Senhora do Perpétuo Socorro é uma das celebrações comunitárias mais tradicionais da cidade, atraindo milhares de fiéis anualmente.",
            "A praça adjacente à igreja serve como ponto de encontro histórico de famílias e jovens nas noites quentes cacerenses."
        ]
    }
];

// Estado da Aplicação
const AppState = {
    currentScreen: "screen-splash",
    selectedMonument: null
};

// Inicialização da Aplicação
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initMonumentsList();
    initSimulator();
    
    // Configura botões específicos
    document.getElementById("btn-start").addEventListener("click", () => {
        // Mostra a barra de navegação inferior ao sair do splash
        document.getElementById("app-nav-bar").classList.remove("hidden");
        navigateTo("screen-map");
    });
    
    document.getElementById("btn-back-details").addEventListener("click", () => {
        // Para o áudio guia ao voltar
        if (window.AudioGuide) {
            window.AudioGuide.stop();
        }
        
        // Retorna para a tela de onde o usuário veio (ou Lista por padrão)
        if (AppState.lastScreen) {
            navigateTo(AppState.lastScreen);
        } else {
            navigateTo("screen-list");
        }
    });

    document.getElementById("btn-show-on-map").addEventListener("click", () => {
        if (AppState.selectedMonument) {
            navigateTo("screen-map");
            // Centraliza o mapa no monumento com zoom alto e abre o popup
            if (window.AppMap) {
                window.AppMap.focusOnMonument(AppState.selectedMonument.id);
            }
        }
    });

    // Abas de detalhes
    const tabButtons = document.querySelectorAll(".tab-detail-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            tabButtons.forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-detail-content").forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            const targetTab = btn.getAttribute("data-tab");
            document.getElementById(targetTab).classList.add("active");
        });
    });
});

// Navegação entre telas
function navigateTo(screenId) {
    if (screenId === AppState.currentScreen) return;
    
    // Salva a tela anterior antes de mudar (exceto se for detalhes ou splash)
    if (AppState.currentScreen !== "screen-details" && AppState.currentScreen !== "screen-splash") {
        AppState.lastScreen = AppState.currentScreen;
    }
    
    // Remove ativo da tela anterior
    const prevScreen = document.getElementById(AppState.currentScreen);
    if (prevScreen) prevScreen.classList.remove("active");
    
    // Adiciona ativo na nova tela
    const nextScreen = document.getElementById(screenId);
    if (nextScreen) nextScreen.classList.add("active");
    
    // Atualiza estado
    AppState.currentScreen = screenId;
    
    // Atualiza menu de navegação ativo
    updateNavSelection(screenId);
    
    // Ações especiais ao entrar em cada tela
    if (screenId === "screen-scan") {
        if (window.QrScanner) {
            window.QrScanner.start();
        }
    } else {
        // Se sair da tela do scanner, desliga a câmera
        if (window.QrScanner) {
            window.QrScanner.stop();
        }
    }
    
    if (screenId === "screen-map") {
        // Força o Leaflet a recalcular tamanho caso tenha sido carregado oculto
        if (window.AppMap) {
            window.AppMap.invalidateSize();
        }
    }
}

// Configura navegação do menu inferior
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-bar .nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetScreen = item.getAttribute("data-screen");
            if (targetScreen) {
                navigateTo(targetScreen);
            }
        });
    });
}

// Atualiza a marcação visual no menu inferior
function updateNavSelection(screenId) {
    const navItems = document.querySelectorAll(".nav-bar .nav-item");
    navItems.forEach(item => {
        const targetScreen = item.getAttribute("data-screen");
        if (targetScreen === screenId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    
    // Se a tela ativa for detalhes ou splash, oculta o menu inferior para imersão
    const navBar = document.getElementById("app-nav-bar");
    if (screenId === "screen-splash" || screenId === "screen-details") {
        navBar.classList.add("hidden");
    } else {
        navBar.classList.remove("hidden");
    }
}

// Inicializa a lista de monumentos (Tela de Locais)
function initMonumentsList() {
    const container = document.getElementById("monuments-list-container");
    container.innerHTML = "";
    
    MONUMENTS.forEach(monument => {
        const card = document.createElement("div");
        card.className = "monument-card";
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${monument.image}" alt="${monument.title}">
                <span class="card-badge">${monument.period.split(" ")[0]}</span>
            </div>
            <div class="card-info">
                <div>
                    <h3>${monument.title}</h3>
                    <p>${monument.history}</p>
                </div>
                <div class="card-action-indicator">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>
        `;
        
        card.addEventListener("click", () => {
            openMonumentDetails(monument.id);
        });
        
        container.appendChild(card);
    });
}

// Abre a tela de detalhes de um monumento específico
function openMonumentDetails(id) {
    const monument = MONUMENTS.find(m => m.id === id);
    if (!monument) return;
    
    AppState.selectedMonument = monument;
    
    // Preenche informações na tela de detalhes
    document.getElementById("detail-image").src = monument.image;
    document.getElementById("detail-image").alt = monument.title;
    document.getElementById("detail-title").innerText = monument.title;
    document.getElementById("detail-period").innerText = monument.period;
    document.getElementById("detail-history-text").innerText = monument.history;
    document.getElementById("detail-address").innerText = monument.address;
    
    // Curiosidades
    const curiositiesContainer = document.getElementById("detail-curiosities-list");
    curiositiesContainer.innerHTML = "";
    monument.curiosities.forEach(curiosity => {
        const li = document.createElement("li");
        li.innerText = curiosity;
        curiositiesContainer.appendChild(li);
    });
    
    // Reseta abas para histórico ativo por padrão
    document.querySelectorAll(".tab-detail-btn").forEach(b => {
        if (b.getAttribute("data-tab") === "tab-history") b.classList.add("active");
        else b.classList.remove("active");
    });
    document.getElementById("tab-history").classList.add("active");
    document.getElementById("tab-curiosity").classList.remove("active");
    
    // Prepara o áudio guia para este monumento
    if (window.AudioGuide) {
        window.AudioGuide.prepare(monument.title, monument.history);
    }
    
    navigateTo("screen-details");
}

// Inicializa o simulador de testes
function initSimulator() {
    const quickBtnContainer = document.getElementById("simulator-quick-buttons");
    const qrGalleryContainer = document.getElementById("simulator-qr-gallery");
    
    quickBtnContainer.innerHTML = "";
    qrGalleryContainer.innerHTML = "";
    
    MONUMENTS.forEach(monument => {
        // 1. Botão de Simulação Rápida
        const btn = document.createElement("button");
        btn.className = "btn-sim-quick";
        btn.innerHTML = `<span>${monument.title}</span>`;
        btn.addEventListener("click", () => {
            // Simula o escaneamento abrindo os detalhes do monumento diretamente
            openMonumentDetails(monument.id);
        });
        quickBtnContainer.appendChild(btn);
        
        // 2. Galeria de QR Codes reais para escaneamento
        const qrCard = document.createElement("div");
        qrCard.className = "qr-card";
        
        // URL da API externa que gera o QR Code. O conteúdo do QR code é o ID do monumento histórico
        // que o nosso leitor decodificará para abrir o monumento.
        const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${monument.id}&color=08100c`;
        
        qrCard.innerHTML = `
            <div class="qr-card-img">
                <img src="${qrDataUrl}" alt="QR Code ${monument.title}" width="130" height="130" loading="lazy">
            </div>
            <span>${monument.title}</span>
        `;
        qrGalleryContainer.appendChild(qrCard);
    });
}

// Expõe globalmente
window.AppState = AppState;
window.MONUMENTS = MONUMENTS;
window.navigateTo = navigateTo;
window.openMonumentDetails = openMonumentDetails;
