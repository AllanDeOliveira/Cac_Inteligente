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
// O SafeAreaView do react-native é no-op no Android, e o Expo 54+ força edge-to-edge
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useFonts } from 'expo-font';
import { EBGaramond_600SemiBold } from '@expo-google-fonts/eb-garamond';
import { Archivo_400Regular, Archivo_500Medium, Archivo_600SemiBold } from '@expo-google-fonts/archivo';

// Cal e verde-sálvia do Pantanal: destaque em tom suave, nunca escuro nem saturado
const C = {
  marble: '#EAEEE4',   // papel com leve tom sálvia
  ink: '#1C211C',
  muted: '#5B6259',
  bronze: '#6E8B5B',   // verde-sálvia médio: o destaque do app
  bronzeInk: '#4C6440', // verde mais fechado, para texto e botões
  night: '#141816',
};
const WASH = 'rgba(28, 33, 28, 0.035)';
const HAIR = StyleSheet.hairlineWidth;
const F = {
  display: 'EBGaramond_600SemiBold',
  body: 'Archivo_400Regular',
  medium: 'Archivo_500Medium',
  semi: 'Archivo_600SemiBold',
};

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

// O Marco do Jauru é, no fundo, um par de coordenadas cravado em pedra. Mostramos as dos cinco.
const pad = (n) => String(n).padStart(2, '0');
const dms = (v, pos, neg) => {
  const t = Math.round(Math.abs(v) * 3600);
  return `${Math.floor(t / 3600)}°${pad(Math.floor((t % 3600) / 60))}'${pad(t % 60)}"${v >= 0 ? pos : neg}`;
};
const coords = (lat, lng) => `${dms(lat, 'N', 'S')} · ${dms(lng, 'E', 'W')}`;

// "Século XVIII - 1754" → "XVIII" no crachá, "Século XVIII · 1754" na ficha
const century = (period) => period.split(' ')[1];
const engraved = (period) => period.replace(' - ', ' · ');

if (__DEV__) {
  console.assert(dms(-16.0734, 'N', 'S') === '16°04\'24"S', 'dms: conversão básica');
  console.assert(dms(-16.99999, 'N', 'S') === '17°00\'00"S', 'dms: 60" precisa subir para o grau seguinte');
}

// Régua de agrimensor: a assinatura do app, e o gesto que o Marco do Jauru repete desde 1754
const TickRule = ({ ticks = 9 }) => (
  <View style={styles.rule}>
    {Array.from({ length: ticks }, (_, i) => <View key={i} style={styles.tick} />)}
  </View>
);

const ScreenHeader = ({ title, sub }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    <TickRule />
    <Text style={styles.headerSub}>{sub}</Text>
  </View>
);

// A mira do scanner, usada em dois tamanhos: no visor da câmera e como marca do botão
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

const NavItem = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={styles.navItem}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ selected: active }}
  >
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
    <View style={[styles.navUnderline, active && styles.navUnderlineActive]} />
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

  // Para a fala ao desmontar o app (a troca de tela é tratada em navigateTo)
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // Botão físico de voltar do Android: ficha e scanner voltam; mapa e lista saem do app
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

  // Fundo de cal enquanto as fontes carregam, para não piscar branco
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: C.marble }} />;

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
        <StatusBar barStyle="dark-content" />
        <View style={styles.splashContent}>
          <Text style={styles.splashEyebrow}>Mato Grosso · fundada em 1778</Text>
          <Text style={styles.splashTitle}>CÁCERES</Text>
          <Text style={styles.splashSubtitle}>Inteligente</Text>
          <TickRule ticks={11} />
          <Text style={styles.splashCoord}>{coords(-16.0718, -57.6787)}</Text>

          <Text style={styles.splashTagline}>
            Cinco monumentos, cinco placas. Aponte a câmera e ouça a história de cada um.
          </Text>

          <View style={styles.steps}>
            {[
              'Ache a placa do projeto no monumento.',
              'Toque no botão da câmera.',
              'Aponte para o QR Code e ouça.',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{i + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigateTo('map')} accessibilityRole="button">
            <Text style={styles.btnPrimaryText}>Explorar o mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* CORPO DO APLICATIVO (Telas Ativas) */}
      <View style={styles.mainContainer}>
        
        {/* ================= TELA: MAPA ================= */}
        {currentScreen === 'map' && (
          <View style={StyleSheet.absoluteFillObject}>
            <ScreenHeader title="Explorar" sub="Cinco monumentos no centro histórico e arredores." />
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
                  pinColor={C.bronze}
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
              <Text style={styles.mapTipText}>Toque num marcador para abrir a ficha</Text>
            </View>
          </View>
        )}

        {/* ================= TELA: SCANNER ================= */}
        {currentScreen === 'scanner' && (
          <View style={StyleSheet.absoluteFillObject}>
            <ScreenHeader title="Escanear" sub="Aponte para o QR Code da placa do monumento." />

            <View style={styles.cameraContainer}>
              {!cameraPermission ? (
                <View style={styles.permissionContainer}>
                  <ActivityIndicator color={C.bronze} />
                </View>
              ) : !cameraPermission.granted ? (
                <View style={styles.permissionContainer}>
                  <Text style={styles.permissionText}>O scanner precisa da câmera para ler o QR Code da placa.</Text>
                  <TouchableOpacity style={styles.btnPermission} onPress={requestCameraPermission} accessibilityRole="button">
                    <Text style={styles.btnPermissionText}>Permitir câmera</Text>
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
                    <Reticle size={224} arm={26} weight={3} color={C.bronze} />
                  </View>
                </CameraView>
              ) : (
                <View style={styles.permissionContainer}>
                  <ActivityIndicator size="large" color={C.bronze} />
                </View>
              )}
            </View>
          </View>
        )}

        {/* ================= TELA: LISTA ================= */}
        {currentScreen === 'list' && (
          <ScrollView contentContainerStyle={styles.listScroll}>
            <ScreenHeader title="Patrimônio" sub="Do Marco de 1754 à igreja dos anos 1950." />

            {MONUMENTS.map(monument => (
              <TouchableOpacity
                key={monument.id}
                style={styles.card}
                onPress={() => handleOpenDetails(monument.id)}
                accessibilityRole="button"
                accessibilityLabel={`${monument.title}, ${monument.period}`}
              >
                <Image source={MONUMENT_IMAGES[monument.id]} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardCentury}>{century(monument.period)}</Text>
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
            {/* Foto inteira, sem véu por cima: a inscrição vem embaixo, gravada na pedra */}
            <View style={styles.hero}>
              <Image source={MONUMENT_IMAGES[selectedMonument.id]} style={styles.heroImage} />
              <TouchableOpacity
                style={styles.btnBack}
                onPress={() => navigateTo(lastScreen)}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <Text style={styles.btnBackText}>←</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cartouche}>
              <Text style={styles.detailEyebrow}>{engraved(selectedMonument.period)}</Text>
              <Text style={styles.detailTitle}>{selectedMonument.title}</Text>
              <TickRule ticks={11} />
              <Text style={styles.detailCoord}>{coords(selectedMonument.lat, selectedMonument.lng)}</Text>
            </View>

            <View style={styles.detailContent}>
              <View style={styles.audioRow}>
                <View style={styles.audioInfo}>
                  <Text style={styles.audioTitle}>Áudio-guia</Text>
                  <Text style={styles.audioStatus}>
                    {isSpeaking ? 'Reproduzindo…' : 'Narração em voz alta'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.btnPlay}
                  onPress={handleSpeak}
                  accessibilityRole="button"
                  accessibilityLabel={isSpeaking ? 'Parar narração' : 'Ouvir narração'}
                >
                  <Text style={styles.btnPlayText}>{isSpeaking ? 'Parar' : 'Ouvir'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tabs}>
                {[['history', 'História'], ['curiosities', 'Curiosidades']].map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.tabBtn}
                    onPress={() => setActiveDetailTab(key)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: activeDetailTab === key }}
                  >
                    <Text style={[styles.tabText, activeDetailTab === key && styles.tabTextActive]}>{label}</Text>
                    <View style={[styles.tabRule, activeDetailTab === key && styles.tabRuleActive]} />
                  </TouchableOpacity>
                ))}
              </View>

              {activeDetailTab === 'history' ? (
                <Text style={styles.historyText}>{selectedMonument.history}</Text>
              ) : (
                selectedMonument.curiosities.map((item, idx) => (
                  <View key={idx} style={styles.curiosityRow}>
                    <View style={styles.curiosityMark} />
                    <Text style={styles.curiosityText}>{item}</Text>
                  </View>
                ))
              )}

              <View style={styles.locationBlock}>
                <Text style={styles.locationLabel}>Onde fica</Text>
                <Text style={styles.locationAddress}>{selectedMonument.address}</Text>
                <TouchableOpacity style={styles.btnSecondary} onPress={handleFocusOnMap} accessibilityRole="button">
                  <Text style={styles.btnSecondaryText}>Ver no mapa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

      </View>

      {/* ================= MENU DE NAVEGAÇÃO INFERIOR ================= */}
      {currentScreen !== 'splash' && currentScreen !== 'details' && (
        <View style={styles.navBar}>
          <NavItem label="Mapa" active={currentScreen === 'map'} onPress={() => navigateTo('map')} />

          {/* A marca do botão é a própria mira do scanner, em miniatura */}
          <TouchableOpacity
            style={[styles.navScanner, currentScreen === 'scanner' && styles.navScannerActive]}
            onPress={() => navigateTo('scanner')}
            accessibilityRole="button"
            accessibilityLabel="Escanear QR Code"
            accessibilityState={{ selected: currentScreen === 'scanner' }}
          >
            <Reticle size={22} arm={7} weight={2} color={C.marble} />
          </TouchableOpacity>

          <NavItem label="Locais" active={currentScreen === 'list'} onPress={() => navigateTo('list')} />
        </View>
      )}
    </SafeAreaView>
  );
}

// Superfícies gravadas, não flutuantes: filete de bronze, cantos cortados, nenhuma sombra.
const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: C.marble },
  mainContainer: { flex: 1 },

  // Régua de agrimensor
  rule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    borderTopWidth: HAIR,
    borderTopColor: C.bronze,
    marginVertical: 10,
  },
  tick: { width: HAIR, height: 5, backgroundColor: C.bronze },

  // Abertura: uma inscrição lapidar
  splashContainer: { flex: 1, backgroundColor: C.marble, justifyContent: 'center', alignItems: 'center' },
  splashContent: { width: '100%', maxWidth: 380, paddingHorizontal: 32 },
  splashEyebrow: { fontFamily: F.semi, fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: C.bronzeInk },
  splashTitle: { fontFamily: F.display, fontSize: 46, letterSpacing: 6, color: C.ink, marginTop: 14 },
  splashSubtitle: { fontFamily: F.display, fontSize: 22, letterSpacing: 2, color: C.bronzeInk },
  splashCoord: { fontFamily: F.medium, fontSize: 11, letterSpacing: 1.4, color: C.muted },
  splashTagline: { fontFamily: F.body, fontSize: 15, lineHeight: 24, color: C.ink, marginTop: 26 },
  steps: { marginTop: 26 },
  stepRow: { flexDirection: 'row', marginBottom: 12 },
  stepNumber: { fontFamily: F.semi, fontSize: 11, color: C.bronzeInk, width: 22, marginTop: 2 },
  stepText: { fontFamily: F.body, fontSize: 13, lineHeight: 19, color: C.muted, flex: 1 },
  btnPrimary: { marginTop: 28, paddingVertical: 15, borderRadius: 4, backgroundColor: C.ink, alignItems: 'center' },
  btnPrimaryText: { fontFamily: F.semi, fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase', color: C.marble },

  // Cabeçalho de tela
  header: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 14, backgroundColor: C.marble, zIndex: 10 },
  headerTitle: { fontFamily: F.display, fontSize: 30, color: C.ink },
  headerSub: { fontFamily: F.body, fontSize: 12, lineHeight: 17, color: C.muted },

  // Mapa
  map: { flex: 1 },
  mapTip: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    backgroundColor: C.marble,
    borderWidth: HAIR,
    borderColor: C.bronze,
    borderRadius: 3,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  mapTipText: { fontFamily: F.medium, fontSize: 11, color: C.bronzeInk },
  callout: { width: 190, backgroundColor: C.marble, borderWidth: HAIR, borderColor: C.bronze, borderRadius: 3, padding: 11 },
  calloutCentury: { fontFamily: F.semi, fontSize: 9, letterSpacing: 1.6, color: C.bronzeInk },
  calloutTitle: { fontFamily: F.display, fontSize: 17, color: C.ink, marginTop: 3 },
  calloutCoord: { fontFamily: F.medium, fontSize: 10, letterSpacing: 0.8, color: C.muted, marginTop: 4 },

  // Scanner: o único lugar escuro do app, porque a câmera pede
  cameraContainer: { flex: 1, backgroundColor: C.night, overflow: 'hidden' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  permissionText: { fontFamily: F.body, fontSize: 14, lineHeight: 22, color: '#C9C5BA', textAlign: 'center', marginBottom: 22 },
  btnPermission: { paddingVertical: 11, paddingHorizontal: 22, borderRadius: 4, borderWidth: HAIR, borderColor: C.bronze },
  btnPermissionText: { fontFamily: F.semi, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: C.bronze },
  scannerOverlay: { flex: 1, backgroundColor: 'rgba(20, 24, 22, 0.45)', justifyContent: 'center', alignItems: 'center' },

  // Lista
  listScroll: { paddingBottom: 28 },
  card: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 14,
    borderWidth: HAIR,
    borderColor: C.bronze,
    borderRadius: 4,
    backgroundColor: WASH,
    overflow: 'hidden',
  },
  cardImage: { width: 92, height: 104 },
  cardInfo: { flex: 1, paddingHorizontal: 14, justifyContent: 'center' },
  cardCentury: { fontFamily: F.semi, fontSize: 9, letterSpacing: 1.8, color: C.bronzeInk },
  cardTitle: { fontFamily: F.display, fontSize: 20, color: C.ink, marginTop: 2 },
  cardCoord: { fontFamily: F.medium, fontSize: 10, letterSpacing: 0.9, color: C.muted, marginTop: 5 },

  // Ficha do monumento
  detailContainer: { paddingBottom: 48 },
  hero: { height: 300 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  btnBack: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.marble,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBackText: { fontFamily: F.medium, fontSize: 17, color: C.ink },
  cartouche: { paddingHorizontal: 24, paddingTop: 22 },
  detailEyebrow: { fontFamily: F.semi, fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: C.bronzeInk },
  detailTitle: { fontFamily: F.display, fontSize: 34, lineHeight: 38, color: C.ink, marginTop: 6 },
  detailCoord: { fontFamily: F.medium, fontSize: 11, letterSpacing: 1.3, color: C.muted },
  detailContent: { paddingHorizontal: 24, paddingTop: 10 },

  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: HAIR,
    borderBottomWidth: HAIR,
    borderColor: C.bronze,
  },
  audioInfo: { flex: 1 },
  audioTitle: { fontFamily: F.semi, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: C.ink },
  audioStatus: { fontFamily: F.body, fontSize: 12, color: C.muted, marginTop: 3 },
  btnPlay: { paddingVertical: 9, paddingHorizontal: 20, borderRadius: 3, backgroundColor: C.bronzeInk },
  btnPlayText: { fontFamily: F.semi, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: C.marble },

  tabs: { flexDirection: 'row', marginTop: 24, marginBottom: 18 },
  tabBtn: { marginRight: 26 },
  tabText: { fontFamily: F.medium, fontSize: 13, color: C.muted, paddingBottom: 7 },
  tabTextActive: { fontFamily: F.semi, color: C.ink },
  tabRule: { height: 2, backgroundColor: 'transparent' },
  tabRuleActive: { backgroundColor: C.bronze },

  historyText: { fontFamily: F.body, fontSize: 15, lineHeight: 25, color: C.ink },
  curiosityRow: { flexDirection: 'row', marginBottom: 16 },
  curiosityMark: { width: 5, height: 5, backgroundColor: C.bronze, marginTop: 8, marginRight: 12 },
  curiosityText: { fontFamily: F.body, fontSize: 14, lineHeight: 22, color: C.ink, flex: 1 },

  locationBlock: { marginTop: 32, paddingTop: 18, borderTopWidth: HAIR, borderTopColor: C.bronze },
  locationLabel: { fontFamily: F.semi, fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: C.bronzeInk },
  locationAddress: { fontFamily: F.body, fontSize: 14, lineHeight: 21, color: C.ink, marginTop: 6, marginBottom: 16 },
  btnSecondary: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 3,
    borderWidth: HAIR,
    borderColor: C.ink,
  },
  btnSecondaryText: { fontFamily: F.semi, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: C.ink },

  // Navegação: barra no fluxo, não pílula flutuante
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 66,
    paddingBottom: 6,
    backgroundColor: C.marble,
    borderTopWidth: HAIR,
    borderTopColor: C.bronze,
  },
  navItem: { alignItems: 'center', paddingHorizontal: 6, paddingTop: 6 },
  navText: { fontFamily: F.medium, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: C.muted },
  navTextActive: { fontFamily: F.semi, color: C.ink },
  navUnderline: { height: 2, width: 18, marginTop: 6, backgroundColor: 'transparent' },
  navUnderlineActive: { backgroundColor: C.bronze },
  navScanner: { width: 50, height: 50, borderRadius: 4, backgroundColor: C.bronzeInk, justifyContent: 'center', alignItems: 'center' },
  navScannerActive: { backgroundColor: C.ink },
});
