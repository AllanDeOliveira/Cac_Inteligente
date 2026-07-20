# Cáceres Inteligente 🏛️📱

O **Cáceres Inteligente** é um aplicativo móvel voltado para o turismo histórico-cultural e a promoção da acessibilidade na histórica cidade de Cáceres, no estado de Mato Grosso (conhecida como a *Princesinha do Paraguai*). O projeto combina geolocalização, leitura de placas com QR Code e áudio guia por síntese de voz para proporcionar uma experiência imersiva e inclusiva aos visitantes e moradores da cidade.

Este aplicativo é parte integrante de um **Trabalho de Mestrado**, com foco na preservação do patrimônio histórico e na democratização do acesso à informação cultural por meio de tecnologias digitais.

---

## 🌟 Recursos Principais

- **Leitura de QR Code 📷**: Permite escanear as placas físicas instaladas nos monumentos históricos de Cáceres usando a câmera do dispositivo, abrindo instantaneamente a ficha histórica do local.
- **Áudio Guia (Acessibilidade) 🔊**: Utiliza síntese de voz (Text-to-Speech) para narrar a história e curiosidades dos monumentos em português, promovendo inclusão para pessoas com deficiência visual ou dificuldades de leitura.
- **Mapa Interativo 🗺️**: Integração com mapas para exibição georreferenciada dos monumentos históricos na cidade de Cáceres-MT, auxiliando o usuário a se localizar e planejar rotas de visitação.
- **Ficha Histórica Completa 📜**: Informações detalhadas sobre a história e curiosidades dos principais monumentos, incluindo:
  - **Marco do Jauru** (Símbolo geopolítico de 1754)
  - **Catedral de São Luiz** (Arquitetura neogótica de 1919)
  - **Sede da Fazenda Jacobina** (Histórica fazenda de 1775)
  - **Porto antigo e Rio Paraguai** (Artéria comercial e histórica da cidade)
  - **Igreja Perpétuo Socorro** (Bairro Perpétuo Socorro, construído nos anos 1950)
- **Design Regional Elegante 🌿**: A identidade visual do aplicativo utiliza uma paleta de cores inspirada no Pantanal mato-grossense (tons de cal e verde-sálvia), proporcionando uma interface leve, legível e de aspecto premium.

---

## 🛠️ Tecnologias Utilizadas

### Aplicativo Mobile (Fase 2 - Atual)
O projeto móvel foi construído utilizando as seguintes tecnologias e bibliotecas do ecossistema:
- **React Native**: Framework para desenvolvimento de aplicativos móveis multiplataforma.
- **Expo SDK 57**: Plataforma e conjunto de ferramentas para desenvolvimento ágil com React Native.
- **Expo Camera**: Para acesso e controle da câmera durante a leitura dos QR Codes.
- **Expo Speech**: Para reprodução de áudio guia via conversão de texto em fala.
- **React Native Maps**: Para renderização e interação com mapas e marcadores geográficos.
- **React Native Safe Area Context**: Tratamento de espaçamentos em telas com entalhes (notches) e bordas arredondadas.
- **Expo Font & Google Fonts**: Tipografias personalizadas (*Archivo* para legibilidade do corpo de texto e *EB Garamond* para títulos tradicionais).

### Protótipo Web (Fase 1 - Histórico)
No início do projeto, foi desenvolvido um protótipo para navegadores com tecnologias fundamentais:
- **HTML5 Semântico e Vanilla CSS** (Layout responsivo com design escuro e glassmorphism)
- **html5-qrcode** (Leitor de câmera no navegador)
- **Leaflet.js** (Mapa dinâmico com filtros escuros de design)

> [!NOTE]
> O código do protótipo web da Fase 1 foi removido do branch principal e está preservado na tag [`fase-1-web-prototype`](../../tree/fase-1-web-prototype). Para acessá-lo localmente, execute `git checkout fase-1-web-prototype`.

---

## 📂 Estrutura do Repositório

```text
├── caceres-inteligente/      # Projeto do Aplicativo Mobile Nativo (Expo)
│   ├── App.js                # Telas, controle de navegação e áudio-guia nativo
│   ├── assets/               # Ícones do app e imagens dos patrimônios históricos
│   └── package.json          # Configurações e dependências do projeto
│
├── LICENSE                   # Licença GNU GPL v3.0 do projeto
└── README.md                 # Documentação principal do repositório (esta página)
```

---

## 🎓 Contexto Acadêmico

Este projeto está sendo desenvolvido no âmbito de pesquisa de pós-graduação.

---

## 📄 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0 (GPLv3)** — uma licença copyleft forte que garante que o software permaneça livre e de código aberto. Qualquer trabalho derivado ou redistribuição deste projeto também deve ter seu código-fonte aberto sob os mesmos termos. Consulte o arquivo [LICENSE](LICENSE) para ler os termos completos.