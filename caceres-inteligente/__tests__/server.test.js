import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, MONUMENTS_DATA, scansLog } from '../server.js';

let server;
let baseUrl;

test('Inicializa o servidor HTTP para testes de integração', (t, done) => {
  server = createServer();
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
    done();
  });
});

test('GET /api/v1/health retorna status ok e contador de monumentos', async () => {
  const res = await fetch(`${baseUrl}/api/v1/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'caceres-inteligente-backend');
  assert.equal(data.monumentsCount, 5);
});

test('GET /api/v1/monuments retorna lista completa de monumentos', async () => {
  const res = await fetch(`${baseUrl}/api/v1/monuments`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/json');
  assert.equal(res.headers.get('etag'), '"v1-caceres-monuments"');
  
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.length, 5);
  assert.equal(body.data[0].id, 'marco-do-jauru');
});

test('GET /api/v1/monuments com ETag correspondente retorna 304 Not Modified', async () => {
  const res = await fetch(`${baseUrl}/api/v1/monuments`, {
    headers: { 'If-None-Match': '"v1-caceres-monuments"' }
  });
  assert.equal(res.status, 304);
});

test('GET /api/v1/monuments/:id retorna monumento específico por ID', async () => {
  const res = await fetch(`${baseUrl}/api/v1/monuments/catedral-sao-luiz`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.title, 'Catedral de São Luiz');
});

test('GET /api/v1/monuments/:id retorna 404 para ID inexistente', async () => {
  const res = await fetch(`${baseUrl}/api/v1/monuments/id-invalido`);
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('POST /api/v1/telemetry/scan registra escaneamento com sucesso', async () => {
  const initialCount = scansLog.length;
  const res = await fetch(`${baseUrl}/api/v1/telemetry/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monumentId: 'marco-do-jauru', deviceOS: 'android' })
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.monumentId, 'marco-do-jauru');
  assert.equal(body.data.deviceOS, 'android');
  assert.equal(scansLog.length, initialCount + 1);
});

test('POST /api/v1/telemetry/scan rejeita requisição sem monumentId', async () => {
  const res = await fetch(`${baseUrl}/api/v1/telemetry/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceOS: 'ios' })
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('Encerra o servidor de testes', (t, done) => {
  server.close(done);
});
