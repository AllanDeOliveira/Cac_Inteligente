# Cáceres Inteligente 📍

O **Cáceres Inteligente** é um aplicativo mobile e web focado na valorização, resgate e turismo do patrimônio histórico da cidade de Cáceres, Mato Grosso (conhecida como a *Princesinha do Paraguai*). 

O projeto funciona permitindo que moradores e turistas encontrem pontos históricos pelo mapa e, ao visitá-los, realizem o escaneamento de placas de **QR Code** instaladas nos monumentos para abrir a ficha histórica detalhada acompanhada de um **áudio-guia por voz** nativo.

---

## 🛠️ Tecnologias Utilizadas

### Aplicativo Mobile (Fase 2 - Atual)
* **React Native + Expo** (Framework multiplataforma para Android e iOS)
* **expo-camera** (Scanner nativo de QR Code)
* **expo-speech** (Síntese de voz nativa - Text-to-Speech)
* **react-native-maps** (Mapa interativo com marcações de pins)

### Protótipo Web (Fase 1 - Histórico)
* **HTML5 Semântico e Vanilla CSS** (Layout responsivo com design escuro e glassmorphism)
* **html5-qrcode** (Leitor de câmera no navegador)
* **Leaflet.js** (Mapa dinâmico com filtros escuros de design)

> O código do protótipo web foi preservado na tag [`fase-1-web-prototype`](../../tree/fase-1-web-prototype). Para acessá-lo localmente: `git checkout fase-1-web-prototype`.

---

## 📂 Estrutura do Repositório

```text
├── caceres-inteligente/      # Projeto do Aplicativo Mobile Nativo (Expo)
│   ├── App.js                # Telas, controle de navegação e áudio-guia nativo
│   ├── assets/               # Ícones do app e imagens dos patrimônios históricos
│   └── package.json          # Configurações e dependências do projeto
│
└── README.md                 # Documentação principal do projeto
```

> **Nota:** o Protótipo Web (Fase 1) foi removido do branch principal e está preservado na tag `fase-1-web-prototype`.

---

## 🏛️ Patrimônios Históricos Cadastrados no Protótipo

1. **Marco do Jauru** (Praça Barão do Rio Branco) - Peça de mármore português erguida em 1754 para demarcar o limite entre os impérios português e espanhol pelo Tratado de Madri.
2. **Catedral de São Luiz de Cáceres** (Praça Barão do Rio Branco) - Imponente catedral de estilo neogótica construída a partir de 1919.
3. **Sede da Fazenda Jacobina** - A mais rica fazenda de gado, açúcar e aguardente da província de Mato Grosso no período imperial.
4. **Porto de Cáceres e Rio Paraguai** - Artéria comercial vital que ligava a cidade com a bacia platina de Montevidéu e Buenos Aires.
5. **Igreja de Nossa Senhora do Perpétuo Socorro** - Importante marco de relevância religiosa fundado na década de 1950.

---

## 🚀 Como Executar o Aplicativo Mobile (Expo)

### Pré-requisitos
* **Node.js** instalado na máquina.
* Aplicativo **Expo Go** instalado no celular (disponível para Android e iOS).
* **Android Studio** instalado (opcional, caso queira emular no computador).

### Passo a Passo
1. Entre na pasta do projeto mobile:
   ```bash
   cd caceres-inteligente
   ```
2. Instale as dependências de pacotes:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```
4. No terminal aparecerá um **QR Code**:
   * **No Android:** Abra o *Expo Go*, clique em *Scan QR Code* e leia o código.
   * **No iOS:** Abra a *Câmera nativa do iPhone*, aponte para o QR Code e toque no link para abrir no *Expo Go*.

---

## 💻 Configurações do Ambiente Android (Desenvolvedores)

Se você deseja executar o emulador do Android Studio na sua máquina, certifique-se de configurar as seguintes variáveis de ambiente no Windows:

* **ANDROID_HOME**: `C:\Users\<Seu-Usuario>\AppData\Local\Android\Sdk`
* **JAVA_HOME**: `C:\Program Files\Android\Android Studio\jbr` (JDK integrado do Studio)
* **Adições ao Path**: 
  * `%ANDROID_HOME%\emulator`
  * `%ANDROID_HOME%\platform-tools`