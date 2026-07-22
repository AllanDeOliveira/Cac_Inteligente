import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
  StatusBar,
  Vibration,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useFonts } from 'expo-font';
import { EBGaramond_600SemiBold } from '@expo-google-fonts/eb-garamond';
import { Archivo_400Regular, Archivo_500Medium, Archivo_600SemiBold } from '@expo-google-fonts/archivo';
import { coords, century, engraved, findMonumentById } from './utils.js';

// DIREÇÃO B: "Sinalização Urbana & Painel Tátil"
// Cores: Fundo Noturno (#0D131A), Placa de Aço (#1E2836), Amarelo Lima Guia (#E6FF44), Alerta Solar (#FF6B4A), Branco Puro (#FFFFFF)
const C = {
  night: '#0D131A',
  panel: '#1E2836',
  panelBorder: '#2E3D52',
  lime: '#E6FF44',
  limeText: '#0D131A',
  coral: '#FF6B4A',
  white: '#FFFFFF',
  muted: '#94A3B8',
};

const HAIR = StyleSheet.hairlineWidth;
const F = {
  display: 'EBGaramond_600SemiBold',
  body: 'Archivo_400Regular',
  medium: 'Archivo_500Medium',
  semi: 'Archivo_600SemiBold',
};

// Dicionário de Imagens Locais
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

// Régua / Divisor Tátil estilo Placa Urbana
const SignalRule = () => (
  <View style={styles.signalRule}>
    <View style={styles.signalRuleSegment} />
    <View style={styles.signalRuleDot} />
  </View>
);

const ScreenHeader = ({ title, sub, badge }) => (
  <View style={styles.header}>
    <View style={styles.headerTopRow}>
      <Text style={styles.headerTitle}>{title.toUpperCase()}</Text>
      {badge && (
        <View style={styles.badgeLime}>
          <Text style={styles.badgeLimeText}>{badge}</Text>
        </View>
      )}
    </View>
    <SignalRule />
    <Text style={styles.headerSub}>{sub}</Text>
  </View>
);

// Mira do scanner em Amarelo Lima Guia
const CORNERS = [
  { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0 },
  { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0 },
  { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0 },
  { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0 },
];

const Reticle = ({ size, arm, weight, color }) => (
  <View style={{ width: size, height: size }}>
    {CORNERS.map((corner, i) => (
      <View
        key={i}
        style={[{ position: 'absolute', width: arm, height: arm, borderColor: color, borderWidth: weight }, corner]}
      />
    ))}
  </View>
);

const NavItem = ({ label, icon, active, onPress }) => (
  <TouchableOpacity
    style={[styles.navItem, active && styles.navItemActive]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ selected: active }}
  >
    <Text style={[styles.navText, active && styles.navTextActive]}>{icon} {label}</Text>
  </TouchableOpacity>
);

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

  const [fontsLoaded] = useFonts({
    EBGaramond_600SemiBold,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
  });

  const navigateTo = (screen) => {
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

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentScreen === 'details' || currentScreen === 'scanner') {
        navigateTo(lastScreen);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [currentScreen, lastScreen]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: C.night }} />;

  const handleOpenDetails = (id) => {
    const monument = findMonumentById(MONUMENTS, id);
    if (monument) {
      setSelectedMonument(monument);
      setActiveDetailTab('history');
      navigateTo('details');
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    const monument = findMonumentById(MONUMENTS, data);

    if (monument) {
      setScanned(true);
      setCameraActive(false);
      Vibration.vibrate(150);
      setSelectedMonument(monument);
      setActiveDetailTab('history');
      setCurrentScreen('details');
    } else {
      console.warn("Código inválido escaneado:", data);
    }
  };

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
        <StatusBar barStyle="light-content" backgroundColor={C.night} />
        <View style={styles.splashContent}>
          <View style={styles.badgeLime}>
            <Text style={styles.badgeLimeText}>SINALIZAÇÃO URBANA E ACESSIBILIDADE</Text>
          </View>
          
          <Text style={styles.splashTitle}>CÁCERES</Text>
          <Text style={styles.splashSubtitle}>GUIA INTELIGENTE</Text>
          <SignalRule />
          <Text style={styles.splashCoord}>{coords(-16.0718, -57.6787)}</Text>

          <Text style={styles.splashTagline}>
            Placas de sinalização tátil com escaneamento instantâneo de QR Code e sintetizador de áudio-guia presencial.
          </Text>

          <View style={styles.steps}>
            {[
              'Localize a placa física no monumento cacerense.',
              'Acione o leitor óptico por QR Code.',
              'Ouça a história completa pelo alto-falante.',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.btnPrimaryLime}
            onPress={() => navigateTo('map')}
            accessibilityRole="button"
            accessibilityLabel="Iniciar navegação no mapa urbano"
          >
            <Text style={styles.btnPrimaryLimeText}>ABRIR PAINEL DA CIDADE →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor={C.night} />
      
      <View style={styles.mainContainer}>
        
        {/* ================= TELA: MAPA ================= */}
        {currentScreen === 'map' && (
          <View style={StyleSheet.absoluteFillObject}>
            <ScreenHeader
              title="Mapa de Sinalização"
              sub="5 placas patrimoniais georreferenciadas na cidade."
              badge="GPS ATIVO"
            />
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: -16.0718,
                longitude: -57.6787,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              {MONUMENTS.map(monument => (
                <Marker
                  key={monument.id}
                  coordinate={{ latitude: monument.lat, longitude: monument.lng }}
                  pinColor={C.coral}
                >
                  <Callout tooltip onPress={() => handleOpenDetails(monument.id)}>
                    <View style={styles.callout}>
                      <Text style={styles.calloutCentury}>{century(monument.period)}</Text>
                      <Text style={styles.calloutTitle}>{monument.title}</Text>
                      <Text style={styles.calloutCoord}>{coords(monument.lat, monument.lng)}</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
            <View style={styles.mapTip}>
              <Text style={styles.mapTipText}>📍 TOQUE NO MARCADOR PARA ABRIR O FICHO DA PLACA</Text>
            </View>
          </View>
        )}

        {/* ================= TELA: SCANNER ================= */}
        {currentScreen === 'scanner' && (
          <View style={StyleSheet.absoluteFillObject}>
            <ScreenHeader
              title="Leitor Óptico QR"
              sub="Alinhe a mira frontal com o código gravado na placa de rua."
              badge="CÂMERA"
            />

            <View style={styles.cameraContainer}>
              {!cameraPermission ? (
                <View style={styles.permissionContainer}>
                  <ActivityIndicator color={C.lime} size="large" />
                </View>
              ) : !cameraPermission.granted ? (
                <View style={styles.permissionContainer}>
                  <Text style={styles.permissionText}>Acesso à câmera é obrigatório para leitura das placas de sinalização patrimonial.</Text>
                  <TouchableOpacity style={styles.btnPrimaryLime} onPress={requestCameraPermission} accessibilityRole="button">
                    <Text style={styles.btnPrimaryLimeText}>AUTORIZAR CÂMERA</Text>
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
                    <Reticle size={240} arm={30} weight={4} color={C.lime} />
                    <Text style={styles.scannerGuideText}>BUSCANDO PLACA PATRIMONIAL...</Text>
                  </View>
                </CameraView>
              ) : (
                <View style={styles.permissionContainer}>
                  <ActivityIndicator size="large" color={C.lime} />
                </View>
              )}
            </View>
          </View>
        )}

        {/* ================= TELA: LISTA ================= */}
        {currentScreen === 'list' && (
          <ScrollView contentContainerStyle={styles.listScroll}>
            <ScreenHeader
              title="Catálogo de Placas"
              sub="Relação completa de pontos históricos de Cáceres."
              badge="5 PONTOS"
            />

            {MONUMENTS.map((monument, idx) => (
              <TouchableOpacity
                key={monument.id}
                style={styles.card}
                onPress={() => handleOpenDetails(monument.id)}
                accessibilityRole="button"
                accessibilityLabel={`Placa 0${idx + 1}: ${monument.title}, ${monument.period}`}
              >
                <Image source={MONUMENT_IMAGES[monument.id]} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardIndex}>PLACA 0{idx + 1}</Text>
                    <View style={styles.cardCenturyBadge}>
                      <Text style={styles.cardCenturyText}>{century(monument.period)}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{monument.title}</Text>
                  <Text style={styles.cardCoord}>{coords(monument.lat, monument.lng)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ================= TELA: DETALHES ================= */}
        {currentScreen === 'details' && selectedMonument && (
          <ScrollView contentContainerStyle={styles.detailContainer}>
            <View style={styles.hero}>
              <Image source={MONUMENT_IMAGES[selectedMonument.id]} style={styles.heroImage} />
              <TouchableOpacity
                style={styles.btnBack}
                onPress={() => navigateTo(lastScreen)}
                accessibilityRole="button"
                accessibilityLabel="Voltar para a tela anterior"
              >
                <Text style={styles.btnBackText}>← VOLTAR</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cartouche}>
              <View style={styles.cartoucheBadgeRow}>
                <View style={styles.badgeLime}>
                  <Text style={styles.badgeLimeText}>{engraved(selectedMonument.period)}</Text>
                </View>
              </View>
              <Text style={styles.detailTitle}>{selectedMonument.title.toUpperCase()}</Text>
              <SignalRule />
              <Text style={styles.detailCoord}>COORD: {coords(selectedMonument.lat, selectedMonument.lng)}</Text>
            </View>

            <View style={styles.detailContent}>
              
              {/* PAINEL TÁTIL DE ÁUDIO-GUIA (BOTÃO GIGANTE DE ALTO CONTRASTE) */}
              <TouchableOpacity
                style={[styles.btnAudioTactile, isSpeaking && styles.btnAudioTactileActive]}
                onPress={handleSpeak}
                accessibilityRole="button"
                accessibilityLabel={isSpeaking ? 'Parar narração de voz' : 'Ouvir narração de voz completa'}
              >
                <Text style={styles.btnAudioIcon}>{isSpeaking ? '⏹' : '🔊'}</Text>
                <View style={styles.btnAudioTextContainer}>
                  <Text style={styles.btnAudioTitle}>
                    {isSpeaking ? 'PARAR NARRAÇÃO' : 'OUVIR ÁUDIO-GUIA PRESENCIAL'}
                  </Text>
                  <Text style={styles.btnAudioSub}>
                    {isSpeaking ? 'Síntese de voz em reprodução…' : 'Toque para ouvir a narração acessível em voz alta'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* TABS NAVEGAÇÃO DE CONTEÚDO */}
              <View style={styles.tabs}>
                {[['history', 'HISTÓRIA COMPLETA'], ['curiosities', 'CURIOSIDADES']].map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.tabBtn, activeDetailTab === key && styles.tabBtnActive]}
                    onPress={() => setActiveDetailTab(key)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: activeDetailTab === key }}
                  >
                    <Text style={[styles.tabText, activeDetailTab === key && styles.tabTextActive]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {activeDetailTab === 'history' ? (
                <View style={styles.historyBox}>
                  <Text style={styles.historyText}>{selectedMonument.history}</Text>
                </View>
              ) : (
                selectedMonument.curiosities.map((item, idx) => (
                  <View key={idx} style={styles.curiosityRow}>
                    <View style={styles.curiosityBadge}>
                      <Text style={styles.curiosityBadgeText}>0{idx + 1}</Text>
                    </View>
                    <Text style={styles.curiosityText}>{item}</Text>
                  </View>
                ))
              )}

              <View style={styles.locationBlock}>
                <Text style={styles.locationLabel}>LOCALIZAÇÃO URBANA</Text>
                <Text style={styles.locationAddress}>{selectedMonument.address}</Text>
                <TouchableOpacity
                  style={styles.btnSecondaryCoral}
                  onPress={handleFocusOnMap}
                  accessibilityRole="button"
                >
                  <Text style={styles.btnSecondaryCoralText}>📍 CENTRALIZAR NO MAPA</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

      </View>

      {/* ================= MENU DE NAVEGAÇÃO INFERIOR ================= */}
      {currentScreen !== 'splash' && currentScreen !== 'details' && (
        <View style={styles.navBar}>
          <NavItem
            label="MAPA"
            icon="🗺️"
            active={currentScreen === 'map'}
            onPress={() => navigateTo('map')}
          />

          <TouchableOpacity
            style={[styles.navScanner, currentScreen === 'scanner' && styles.navScannerActive]}
            onPress={() => navigateTo('scanner')}
            accessibilityRole="button"
            accessibilityLabel="Escanear QR Code de Placa de Sinalização"
            accessibilityState={{ selected: currentScreen === 'scanner' }}
          >
            <Reticle size={24} arm={7} weight={2.5} color={C.limeText} />
            <Text style={styles.navScannerLabel}>ESCANEAR</Text>
          </TouchableOpacity>

          <NavItem
            label="PLACAS"
            icon="📜"
            active={currentScreen === 'list'}
            onPress={() => navigateTo('list')}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

// ESTILOS: Direção B - Sinalização Urbana de Alto Contraste
const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: C.night },
  mainContainer: { flex: 1 },

  // Regra / Divisor Tátil de Sinalização
  signalRule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  signalRuleSegment: { flex: 1, height: 2, backgroundColor: C.panelBorder },
  signalRuleDot: { width: 6, height: 6, backgroundColor: C.lime, marginLeft: 8 },

  // Abertura / Splash
  splashContainer: { flex: 1, backgroundColor: C.night, justifyContent: 'center', alignItems: 'center' },
  splashContent: { width: '100%', maxWidth: 400, paddingHorizontal: 28 },
  splashTitle: { fontFamily: F.display, fontSize: 44, letterSpacing: 4, color: C.white, marginTop: 14 },
  splashSubtitle: { fontFamily: F.semi, fontSize: 18, letterSpacing: 2, color: C.lime },
  splashCoord: { fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4, color: C.muted },
  splashTagline: { fontFamily: F.body, fontSize: 15, lineHeight: 24, color: C.white, marginTop: 22 },
  steps: { marginTop: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.lime,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: { fontFamily: F.semi, fontSize: 12, color: C.lime },
  stepText: { fontFamily: F.body, fontSize: 13, lineHeight: 19, color: C.white, flex: 1 },
  
  // Botões Primários em Amarelo Lima
  btnPrimaryLime: {
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 6,
    backgroundColor: C.lime,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.lime,
  },
  btnPrimaryLimeText: { fontFamily: F.semi, fontSize: 13, letterSpacing: 1.4, color: C.limeText },

  // Badge de Acessibilidade / Status
  badgeLime: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: C.lime,
    borderRadius: 3,
  },
  badgeLimeText: { fontFamily: F.semi, fontSize: 10, letterSpacing: 1.2, color: C.limeText },

  // Cabeçalho de Tela
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, backgroundColor: C.night, borderBottomWidth: 1, borderBottomColor: C.panelBorder },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontFamily: F.semi, fontSize: 20, letterSpacing: 1, color: C.white },
  headerSub: { fontFamily: F.body, fontSize: 12, lineHeight: 17, color: C.muted },

  // Mapa
  map: { flex: 1 },
  mapTip: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: C.night,
    borderWidth: 1,
    borderColor: C.lime,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mapTipText: { fontFamily: F.semi, fontSize: 11, letterSpacing: 1, color: C.lime },
  callout: { width: 210, backgroundColor: C.night, borderWidth: 1, borderColor: C.lime, borderRadius: 4, padding: 12 },
  calloutCentury: { fontFamily: F.semi, fontSize: 10, letterSpacing: 1.5, color: C.lime },
  calloutTitle: { fontFamily: F.display, fontSize: 18, color: C.white, marginTop: 2 },
  calloutCoord: { fontFamily: F.medium, fontSize: 10, letterSpacing: 0.8, color: C.muted, marginTop: 4 },

  // Scanner
  cameraContainer: { flex: 1, backgroundColor: C.night, overflow: 'hidden' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  permissionText: { fontFamily: F.body, fontSize: 14, lineHeight: 22, color: C.white, textAlign: 'center', marginBottom: 22 },
  scannerOverlay: { flex: 1, backgroundColor: 'rgba(13, 19, 26, 0.65)', justifyContent: 'center', alignItems: 'center' },
  scannerGuideText: { fontFamily: F.semi, fontSize: 12, letterSpacing: 1.5, color: C.lime, marginTop: 24 },

  // Lista
  listScroll: { paddingBottom: 28 },
  card: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: C.panelBorder,
    borderRadius: 6,
    backgroundColor: C.panel,
    overflow: 'hidden',
  },
  cardImage: { width: 100, height: 110 },
  cardInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, justifyContent: 'center' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardIndex: { fontFamily: F.semi, fontSize: 10, letterSpacing: 1.4, color: C.muted },
  cardCenturyBadge: { backgroundColor: C.night, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, borderWidth: 1, borderColor: C.lime },
  cardCenturyText: { fontFamily: F.semi, fontSize: 9, color: C.lime },
  cardTitle: { fontFamily: F.display, fontSize: 20, color: C.white },
  cardCoord: { fontFamily: F.medium, fontSize: 10, letterSpacing: 0.8, color: C.muted, marginTop: 4 },

  // Ficha de Detalhes
  detailContainer: { paddingBottom: 48 },
  hero: { height: 260 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  btnBack: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
    backgroundColor: C.night,
    borderWidth: 1,
    borderColor: C.lime,
  },
  btnBackText: { fontFamily: F.semi, fontSize: 11, letterSpacing: 1, color: C.lime },
  cartouche: { paddingHorizontal: 24, paddingTop: 20 },
  cartoucheBadgeRow: { marginBottom: 8 },
  detailTitle: { fontFamily: F.display, fontSize: 32, lineHeight: 36, color: C.white },
  detailCoord: { fontFamily: F.medium, fontSize: 11, letterSpacing: 1.2, color: C.muted },
  detailContent: { paddingHorizontal: 24, paddingTop: 14 },

  // Botão Áudio Guia Tátil (Proeminente)
  btnAudioTactile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.lime,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginVertical: 14,
  },
  btnAudioTactileActive: {
    backgroundColor: C.coral,
  },
  btnAudioIcon: { fontSize: 28, marginRight: 14 },
  btnAudioTextContainer: { flex: 1 },
  btnAudioTitle: { fontFamily: F.semi, fontSize: 14, letterSpacing: 1.1, color: C.limeText },
  btnAudioSub: { fontFamily: F.body, fontSize: 12, color: C.limeText, marginTop: 2 },

  // Tabs de Conteúdo
  tabs: { flexDirection: 'row', marginTop: 12, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: C.panel, borderWidth: 1, borderColor: C.panelBorder, marginRight: 8, borderRadius: 4 },
  tabBtnActive: { backgroundColor: C.night, borderColor: C.lime },
  tabText: { fontFamily: F.medium, fontSize: 11, letterSpacing: 1, color: C.muted },
  tabTextActive: { fontFamily: F.semi, color: C.lime },

  historyBox: { backgroundColor: C.panel, padding: 18, borderRadius: 6, borderWidth: 1, borderColor: C.panelBorder },
  historyText: { fontFamily: F.body, fontSize: 15, lineHeight: 25, color: C.white },
  
  curiosityRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, backgroundColor: C.panel, padding: 14, borderRadius: 6, borderWidth: 1, borderColor: C.panelBorder },
  curiosityBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.night, borderWidth: 1, borderColor: C.lime, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  curiosityBadgeText: { fontFamily: F.semi, fontSize: 11, color: C.lime },
  curiosityText: { fontFamily: F.body, fontSize: 14, lineHeight: 22, color: C.white, flex: 1 },

  locationBlock: { marginTop: 24, paddingTop: 18, borderTopWidth: 1, borderTopColor: C.panelBorder },
  locationLabel: { fontFamily: F.semi, fontSize: 11, letterSpacing: 1.6, color: C.lime },
  locationAddress: { fontFamily: F.body, fontSize: 14, lineHeight: 21, color: C.white, marginTop: 6, marginBottom: 16 },
  btnSecondaryCoral: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.coral,
  },
  btnSecondaryCoralText: { fontFamily: F.semi, fontSize: 11, letterSpacing: 1.2, color: C.coral },

  // Barra de Navegação Inferior
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justify.content: 'space-around',
    height: 72,
    paddingBottom: 8,
    backgroundColor: C.night,
    borderTopWidth: 1,
    borderTopColor: C.panelBorder,
  },
  navItem: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: C.panel },
  navItemActive: { backgroundColor: C.panelBorder, borderWidth: 1, borderColor: C.lime },
  navText: { fontFamily: F.medium, fontSize: 11, letterSpacing: 1, color: C.muted },
  navTextActive: { fontFamily: F.semi, color: C.lime },
  navScanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: C.lime,
  },
  navScannerActive: { backgroundColor: C.coral },
  navScannerLabel: { fontFamily: F.semi, fontSize: 12, letterSpacing: 1.2, color: C.limeText, marginLeft: 8 },
});
