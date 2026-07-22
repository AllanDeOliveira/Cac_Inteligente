// Servidor Backend REST para Cáceres Inteligente
// Proporciona API de monumentos, controle de versão ETag e telemetria de escaneamentos.

import http from 'node:http';

export const MONUMENTS_DATA = [
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

export const scansLog = [];

export const createServer = () => {
  return http.createServer((req, res) => {
    // Habilita CORS para requisições do App Mobile/Web
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = reqUrl.pathname;

    // Rota: GET /api/v1/health
    if (req.method === 'GET' && pathname === '/api/v1/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        service: 'caceres-inteligente-backend',
        version: '1.0.0',
        monumentsCount: MONUMENTS_DATA.length,
        totalScansRecorded: scansLog.length,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Rota: GET /api/v1/monuments
    if (req.method === 'GET' && pathname === '/api/v1/monuments') {
      const etag = '"v1-caceres-monuments"';
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304);
        res.end();
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(JSON.stringify({
        success: true,
        data: MONUMENTS_DATA
      }));
      return;
    }

    // Rota: GET /api/v1/monuments/:id
    if (req.method === 'GET' && pathname.startsWith('/api/v1/monuments/')) {
      const id = pathname.replace('/api/v1/monuments/', '').trim().toLowerCase();
      const monument = MONUMENTS_DATA.find(m => m.id === id);

      if (monument) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: monument }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Monumento não encontrado' }));
      }
      return;
    }

    // Rota: POST /api/v1/telemetry/scan
    if (req.method === 'POST' && pathname === '/api/v1/telemetry/scan') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!payload.monumentId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'monumentId é obrigatório' }));
            return;
          }

          const scanEntry = {
            id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            monumentId: payload.monumentId,
            deviceOS: payload.deviceOS || 'unknown',
            scannedAt: new Date().toISOString()
          };

          scansLog.push(scanEntry);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: scanEntry }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'JSON inválido' }));
        }
      });
      return;
    }

    // 404 para rotas desconhecidas
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Rota não encontrada' }));
  });
};

// Execução standalone
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const PORT = process.env.PORT || 3000;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`[Cáceres Inteligente Backend] Servidor rodando na porta ${PORT}`);
  });
}
