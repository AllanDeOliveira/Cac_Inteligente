import test from 'node:test';
import assert from 'node:assert/strict';
import { pad, dms, coords, century, engraved, findMonumentById, fetchMonumentsFromApi, sendScanTelemetryApi } from '../utils.js';

test('pad formata números com zero à esquerda', () => {
  assert.equal(pad(4), '04');
  assert.equal(pad(12), '12');
  assert.equal(pad(0), '00');
});

test('dms converte coordenadas decimais em Graus, Minutos e Segundos', () => {
  assert.equal(dms(-16.0734, 'N', 'S'), '16°04\'24"S');
  assert.equal(dms(-57.6791, 'E', 'W'), '57°40\'45"W');
});

test('coords concatena latitude e longitude formatadas em DMS', () => {
  assert.equal(coords(-16.0734, -57.6791), '16°04\'24"S · 57°40\'45"W');
});

test('century extrai a numeração do século a partir do período', () => {
  assert.equal(century('Século XVIII - 1754'), 'XVIII');
  assert.equal(century('Século XX - 1919'), 'XX');
  assert.equal(century('Século XIX/XX - Comercial'), 'XIX/XX');
});

test('engraved substitui hífen por ponto médio elegante', () => {
  assert.equal(engraved('Século XVIII - 1754'), 'Século XVIII · 1754');
});

test('findMonumentById encontra monumento por ID exato e trata variações de caixa e espaço', () => {
  const monuments = [
    { id: 'marco-do-jauru', title: 'Marco do Jauru' },
    { id: 'catedral-sao-luiz', title: 'Catedral de São Luiz' }
  ];

  assert.deepEqual(findMonumentById(monuments, 'marco-do-jauru'), { id: 'marco-do-jauru', title: 'Marco do Jauru' });
  assert.deepEqual(findMonumentById(monuments, '  MARCO-DO-JAURU  '), { id: 'marco-do-jauru', title: 'Marco do Jauru' });
  assert.equal(findMonumentById(monuments, 'inexistente'), null);
});

test('fetchMonumentsFromApi retorna fallback local em caso de erro/offline', async () => {
  const fallback = [{ id: 'marco-do-jauru', title: 'Marco do Jauru' }];
  const data = await fetchMonumentsFromApi('http://localhost:9999-invalido', fallback);
  assert.deepEqual(data, fallback);
});

test('sendScanTelemetryApi retorna false sem estourar exceção quando offline', async () => {
  const success = await sendScanTelemetryApi('http://localhost:9999-invalido', 'marco-do-jauru');
  assert.equal(success, false);
});
