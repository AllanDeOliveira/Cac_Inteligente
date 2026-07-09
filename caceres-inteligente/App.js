import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Vibration,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import MapView, { Marker, Callout } from 'react-native-maps';

// Resolução da Tela
const { width, height } = Dimensions.get('window');

// Dicionário de Imagens Locais (React Native exige imports estáticos no require)
const MONUMENT_IMAGES = {
  "marco-do-jauru": require('./assets/images/marco_do_jauru.png'),
  "catedral-sao-luiz": require('./assets/images/catedral_sao_luiz.png'),
  "fazenda-jacobina": require('./assets/images/fazenda_jacobina.png'),
  "porto-caceres-rio-paraguai": require('./assets/images/porto_caceres.png'),
  "igreja-perpetuo-socorro": require('./assets/images/igreja_perpetuo_socorro.png'),
};

// Banco de Dados de Monumentos Históricos
const MONUMENTS = [
  {
    id: "marco-do-jauru",
    title: "Marco do Jauru",
    period: "Século XVIII - 1754",
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
    title: "Catedral de São Luiz",
    period: "Século XX - 1919",
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
    title: "Porto e Rio Paraguai",
    period: "Século XIX/XX - Comercial",
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
    title: "Igreja Perpétuo Socorro",
    period: "Século XX - 1950",
    address: "Av. Sete de Setembro, Bairro Perpétuo Socorro, Cáceres - MT",
    lat: -16.0701,
    lng: -57.6750,
    history: "A Igreja de Nossa Senhora do Perpétuo Socorro é um marco histórico do crescimento de Cáceres para além da praça central no século XX. Construída nos anos 1950 sob a influência dos missionários Redentoristas americanos que se instalaram na cidade, a igreja apresenta linhas arquitetônicas neoclássicas simplificadas e se tornou o epicentro social e religioso de um dos bairros mais tradicionais da cidade. O local representa o intercâmbio cultural e espiritual de Cáceres com missões estrangeiras, abrigando festas tradicionais e manifestações culturais típicas cacerenses.",
    curiosities: [
      "Os padres redentoristas americanos trouxeram novos métodos pedagogos e sociais para a Cáceres dos anos 50, influenciando a educação local.",
      "A festa de Nossa Senhora do Perpétuo Socorro é uma das celebrações comunitárias mais tradicionais da cidade, atraindo milhares de fiéis anualmente.",
      "A praça adjacente à igreja serve como ponto de encontro histórico de famílias e jovens nas noites quentes cacerenses."
    ]
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [lastScreen, setLastScreen] = useState('map');
  const [activeDetailTab, setActiveDetailTab] = useState('history');
  
  // Estados para Câmera
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Estados para Áudio Guia
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Referência para o Mapa
  const mapRef = useRef(null);

  // Efeito para desligar câmera e fala se o app fechar ou mudar de tela
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const navigateTo = (screen) => {
    // Para a fala ao mudar de tela
    Speech.stop();
    setIsSpeaking(false);

    if (currentScreen !== 'details' && currentScreen !== 'splash') {
      setLastScreen(currentScreen);
    }
    
    if (screen === 'scanner') {
      setScanned(false);
      setCameraActive(true);
    } else {
      setCameraActive(false);
    }
    
    setCurrentScreen(screen);
  };

  const handleOpenDetails = (id) => {
    const monument = MONUMENTS.find(m => m.id === id);
    if (monument) {
      setSelectedMonument(monument);
      setActiveDetailTab('history');
      navigateTo('details');
    }
  };

  // Lógica de escaneamento do QR Code
  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    
    const cleanId = data.trim().toLowerCase();
    const monument = MONUMENTS.find(m => m.id === cleanId);

    if (monument) {
      setScanned(true);
      setCameraActive(false);
      Vibration.vibrate(150);
      
      // Abre detalhes do local escaneado
      setSelectedMonument(monument);
      setActiveDetailTab('history');
      setCurrentScreen('details');
    } else {
      // Ignora leituras inválidas para evitar interrupções de escaneamento
      console.warn("Código inválido escaneado:", data);
    }
  };

  // Lógica do Áudio-Guia (TTS)
  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      if (selectedMonument) {
        setIsSpeaking(true);
        Speech.speak(`${selectedMonument.title}. ${selectedMonument.history}`, {
          language: 'pt-BR',
          rate: 0.95,
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    }
  };

  const handleFocusOnMap = () => {
    if (selectedMonument) {
      navigateTo('map');
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: selectedMonument.lat,
            longitude: selectedMonument.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);
        }
      }, 300);
    }
  };

  // ================= TELA: SPLASH SCREEN =================
  if (currentScreen === 'splash') {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.splashContent}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>📍</Text>
          </View>
          <Text style={styles.splashTitle}>Cáceres <Text style={styles.goldText}>Inteligente</Text></Text>
          <Text style={styles.splashTagline}>Explore a história guardada nos monumentos da Princesinha do Paraguai.</Text>
          
          <View style={styles.splashCard}>
            <Text style={styles.splashCardTitle}>Como funciona?</Text>
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
              <Text style={styles.stepText}>Ache um local com a placa do projeto.</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
              <Text style={styles.stepText}>Abra o scanner no aplicativo.</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
              <Text style={styles.stepText}>Escaneie o QR Code e ouça a história!</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigateTo('map')}>
            <Text style={styles.btnPrimaryText}>Começar Exploração  ➔</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* CORPO DO APLICATIVO (Telas Ativas) */}
      <View style={styles.mainContainer}>
        
        {/* ================= TELA: MAPA ================= */}
        {currentScreen === 'map' && (
          <View style={StyleSheet.absoluteFillObject}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Explorar Cáceres</Text>
              <Text style={styles.headerSub}>Encontre pontos históricos perto de você</Text>
            </View>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: -16.0718,
                longitude: -57.6787,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              userInterfaceStyle="dark"
            >
              {MONUMENTS.map(monument => (
                <Marker
                  key={monument.id}
                  coordinate={{ latitude: monument.lat, longitude: monument.lng }}
                  pinColor="#dfb15b"
                >
                  <Callout tooltip onPress={() => handleOpenDetails(monument.id)}>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{monument.title}</Text>
                      <Text style={styles.calloutPeriod}>{monument.period}</Text>
                      <Text style={styles.calloutBtn}>Toque para ver a história</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
            <View style={styles.mapTip}>
              <Text style={styles.mapTipText}>Toque nos pins dourados para explorar</Text>
            </View>
          </View>
        )}

        {/* ================= TELA: SCANNER ================= */}
        {currentScreen === 'scanner' && (
          <View style={StyleSheet.absoluteFillObject}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Escanear QR Code</Text>
              <Text style={styles.headerSub}>Aponte a câmera para o código no monumento</Text>
            </View>
            
            <View style={styles.cameraContainer}>
              {!cameraPermission ? (
                <View style={styles.permissionContainer}>
                  <Text style={styles.permissionText}>Carregando permissões...</Text>
                </View>
              ) : !cameraPermission.granted ? (
                <View style={styles.permissionContainer}>
                  <Text style={styles.permissionText}>Acesso à câmera é necessário para ler o QR Code.</Text>
                  <TouchableOpacity style={styles.btnSecondary} onPress={requestCameraPermission}>
                    <Text style={styles.btnSecondaryText}>Conceder Permissão</Text>
                  </TouchableOpacity>
                </View>
              ) : cameraActive ? (
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                  onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                >
                  <View style={styles.scannerOverlay}>
                    <View style={styles.scannerTarget}>
                      <View style={[styles.corner, styles.topLeft]} />
                      <View style={[styles.corner, styles.topRight]} />
                      <View style={[styles.corner, styles.bottomLeft]} />
                      <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                  </View>
                </CameraView>
              ) : (
                <View style={styles.permissionContainer}>
                  <ActivityIndicator size="large" color="#dfb15b" />
                </View>
              )}
            </View>
            
            <View style={styles.scannerTip}>
              <Text style={styles.scannerTipText}>Caso não esteja em Cáceres, use a aba "Simular" para testar o escaneamento.</Text>
            </View>
          </View>
        )}

        {/* ================= TELA: LISTA ================= */}
        {currentScreen === 'list' && (
          <ScrollView contentContainerStyle={styles.listScroll}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Patrimônio Histórico</Text>
              <Text style={styles.headerSub}>Lista de monumentos cadastrados</Text>
            </View>
            
            {MONUMENTS.map(monument => (
              <TouchableOpacity
                key={monument.id}
                style={styles.monumentCard}
                onPress={() => handleOpenDetails(monument.id)}
              >
                <Image source={MONUMENT_IMAGES[monument.id]} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardBadge}>{monument.period.split(" ")[0]}</Text>
                  <Text style={styles.cardTitle}>{monument.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{monument.history}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ================= TELA: SIMULADOR ================= */}
        {currentScreen === 'simulator' && (
          <ScrollView contentContainerStyle={styles.listScroll}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Simulador de Testes</Text>
              <Text style={styles.headerSub}>Simule o escaneamento de placas históricas</Text>
            </View>
            
            <View style={styles.simulatorCard}>
              <Text style={styles.simulatorCardText}>
                Como você está desenvolvendo em ambiente simulado ou computador, use estes botões para testar o comportamento que ocorreria ao ler a placa no local.
              </Text>
              
              <Text style={styles.simulatorSectionTitle}>Simulação Rápida</Text>
              {MONUMENTS.map(monument => (
                <TouchableOpacity
                  key={monument.id}
                  style={styles.btnSimItem}
                  onPress={() => handleOpenDetails(monument.id)}
                >
                  <Text style={styles.btnSimItemText}>{monument.title}</Text>
                  <Text style={styles.btnSimArrow}>➔</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ================= TELA: DETALHES ================= */}
        {currentScreen === 'details' && selectedMonument && (
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.detailsHero}>
              <Image source={MONUMENT_IMAGES[selectedMonument.id]} style={styles.detailHeroImage} />
              <View style={styles.detailHeroGradient} />
              
              <TouchableOpacity style={styles.btnBackCircle} onPress={() => navigateTo(lastScreen)}>
                <Text style={styles.btnBackCircleText}>◀</Text>
              </TouchableOpacity>
              
              <View style={styles.detailHeroInfo}>
                <Text style={styles.detailBadgeText}>{selectedMonument.period}</Text>
                <Text style={styles.detailHeroTitle}>{selectedMonument.title}</Text>
              </View>
            </View>

            <View style={styles.detailContent}>
              {/* Player do Áudio Guia */}
              <View style={styles.audioPlayerCard}>
                <View style={styles.audioInfo}>
                  <Text style={styles.audioIcon}>{isSpeaking ? "🔊" : "🔈"}</Text>
                  <View>
                    <Text style={styles.audioTitle}>Áudio Guia</Text>
                    <Text style={styles.audioStatus}>
                      {isSpeaking ? "Reproduzindo áudio-guia..." : "Toque no Play para ouvir"}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.btnPlay} onPress={handleSpeak}>
                  <Text style={styles.btnPlayText}>{isSpeaking ? "⏹ Parar" : "▶ Ouvir"}</Text>
                </TouchableOpacity>
              </View>

              {/* Abas */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tabBtn, activeDetailTab === 'history' && styles.tabBtnActive]}
                  onPress={() => setActiveDetailTab('history')}
                >
                  <Text style={[styles.tabBtnText, activeDetailTab === 'history' && styles.tabBtnTextActive]}>História</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, activeDetailTab === 'curiosities' && styles.tabBtnActive]}
                  onPress={() => setActiveDetailTab('curiosities')}
                >
                  <Text style={[styles.tabBtnText, activeDetailTab === 'curiosities' && styles.tabBtnTextActive]}>Curiosidades</Text>
                </TouchableOpacity>
              </View>

              {/* Conteúdo das Abas */}
              {activeDetailTab === 'history' ? (
                <Text style={styles.historyText}>{selectedMonument.history}</Text>
              ) : (
                <View style={styles.curiositiesContainer}>
                  {selectedMonument.curiosities.map((item, idx) => (
                    <View key={idx} style={styles.curiosityRow}>
                      <Text style={styles.curiosityBullet}>✦</Text>
                      <Text style={styles.curiosityText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Card de Localização */}
              <View style={styles.locationCard}>
                <Text style={styles.locationCardTitle}>Localização</Text>
                <Text style={styles.locationCardDesc}>{selectedMonument.address}</Text>
                <TouchableOpacity style={styles.btnSecondary} onPress={handleFocusOnMap}>
                  <Text style={styles.btnSecondaryText}>🗺 Ver no Mapa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

      </View>

      {/* ================= MENU DE NAVEGAÇÃO INFERIOR ================= */}
      {currentScreen !== 'splash' && currentScreen !== 'details' && (
        <View style={styles.navBar}>
          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'map' && styles.navItemActive]}
            onPress={() => navigateTo('map')}
          >
            <Text style={styles.navIcon}>🗺</Text>
            <Text style={[styles.navText, currentScreen === 'map' && styles.navTextActive]}>Mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'list' && styles.navItemActive]}
            onPress={() => navigateTo('list')}
          >
            <Text style={styles.navIcon}>📜</Text>
            <Text style={[styles.navText, currentScreen === 'list' && styles.navTextActive]}>Locais</Text>
          </TouchableOpacity>

          {/* Botão de Scanner Central */}
          <TouchableOpacity
            style={styles.navScannerBtn}
            onPress={() => navigateTo('scanner')}
          >
            <View style={[styles.navScannerBtnInner, currentScreen === 'scanner' && styles.navScannerBtnInnerActive]}>
              <Text style={styles.scannerIconText}>📷</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, currentScreen === 'simulator' && styles.navItemActive]}
            onPress={() => navigateTo('simulator')}
          >
            <Text style={styles.navIcon}>⚙️</Text>
            <Text style={[styles.navText, currentScreen === 'simulator' && styles.navTextActive]}>Simular</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// Estilos de Interface
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#08100c',
  },
  mainContainer: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#050d09',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
  },
  logoIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: 'rgba(223, 177, 91, 0.15)',
    borderWidth: 2,
    borderColor: '#dfb15b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIconText: {
    fontSize: 34,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    marginBottom: 8,
  },
  goldText: {
    color: '#dfb15b',
  },
  splashTagline: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  splashCard: {
    width: '100%',
    backgroundColor: 'rgba(18, 32, 25, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 35,
  },
  splashCardTitle: {
    color: '#dfb15b',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfb15b',
    backgroundColor: 'rgba(223, 177, 91, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#dfb15b',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    color: '#f3f4f6',
    fontSize: 13,
    flex: 1,
  },
  btnPrimary: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#dfb15b',
    alignItems: 'center',
    shadowColor: '#dfb15b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnPrimaryText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    zIndex: 10,
    backgroundColor: '#08100c',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSub: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  map: {
    flex: 1,
  },
  mapTip: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(8, 16, 12, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mapTipText: {
    color: '#dfb15b',
    fontSize: 12,
    fontWeight: '600',
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#111827',
  },
  calloutPeriod: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  calloutBtn: {
    color: '#059669',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionText: {
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 220,
    height: 220,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#dfb15b',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scannerTip: {
    padding: 20,
    backgroundColor: '#08100c',
  },
  scannerTipText: {
    color: '#9ca3af',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  listScroll: {
    paddingBottom: 100,
  },
  monumentCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(18, 32, 25, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(223, 177, 91, 0.15)',
    borderColor: '#dfb15b',
    borderWidth: 1,
    color: '#dfb15b',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    color: '#9ca3af',
    fontSize: 11,
    lineHeight: 15,
  },
  simulatorCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(18, 32, 25, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
  },
  simulatorCardText: {
    color: '#9ca3af',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  simulatorSectionTitle: {
    color: '#dfb15b',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 8,
  },
  btnSimItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    marginBottom: 8,
  },
  btnSimItemText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  btnSimArrow: {
    color: '#dfb15b',
  },
  detailContainer: {
    paddingBottom: 60,
  },
  detailsHero: {
    height: 280,
    position: 'relative',
  },
  detailHeroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailHeroGradient: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '60%',
    backgroundColor: 'rgba(8,16,12,0.9)',
    opacity: 0.9,
    // Em produção seria gradiente, mas por simplicidade cobrimos com overlay
  },
  btnBackCircle: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(8, 16, 12, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBackCircleText: {
    color: '#fff',
    fontSize: 16,
  },
  detailHeroInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  detailBadgeText: {
    color: '#dfb15b',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailHeroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailContent: {
    padding: 20,
  },
  audioPlayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(223, 177, 91, 0.1)',
    borderColor: 'rgba(223, 177, 91, 0.25)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  audioTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  audioStatus: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  btnPlay: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#dfb15b',
  },
  btnPlayText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    position: 'relative',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#dfb15b',
  },
  tabBtnText: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 14,
  },
  tabBtnTextActive: {
    color: '#dfb15b',
  },
  historyText: {
    color: '#f3f4f6',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  curiositiesContainer: {
    marginTop: 4,
  },
  curiosityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  curiosityBullet: {
    color: '#dfb15b',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 14,
  },
  curiosityText: {
    color: '#f3f4f6',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  locationCard: {
    marginTop: 25,
    backgroundColor: 'rgba(18, 32, 25, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
  },
  locationCardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  locationCardDesc: {
    color: '#9ca3af',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  btnSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  navBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: 'rgba(8, 16, 12, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  navItemActive: {
    // Pode adicionar destaque especial
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    color: '#9ca3af',
    fontSize: 9,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#dfb15b',
  },
  navScannerBtn: {
    top: -20,
    shadowColor: '#dfb15b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  navScannerBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dfb15b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#08100c',
  },
  navScannerBtnInnerActive: {
    backgroundColor: '#10b981',
  },
  scannerIconText: {
    fontSize: 22,
  }
});
