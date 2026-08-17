const assert = require('assert');
const http = require('http');
const apigate = require('./apigate');

async function main() {
  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: '2026-01-01T00:00:00.000Z' }));
      return;
    }
    if (req.url === '/plans') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([
        { id: 'plan-1', name: 'eSIM 5GB', dataLimitMb: 5120, priceCents: 999, validityDays: 30, isActive: true }
      ]));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  process.env.APIGATE_URL = 'http://127.0.0.1:' + port;

  const health = await apigate.health();
  assert.strictEqual(health.ok, true, 'health should succeed against the fixture server');
  assert.strictEqual(health.data.status, 'ok');

  const status = await apigate.status();
  assert.strictEqual(status.connected, true);
  assert.strictEqual(status.plans.count, 1);
  assert.strictEqual(status.plans.items[0].name, 'eSIM 5GB');
  assert.strictEqual(status.auth.configured, false);

  server.close();

  process.env.APIGATE_URL = 'http://127.0.0.1:1';
  const down = await apigate.health();
  assert.strictEqual(down.ok, false, 'health should fail when ApiGate is down');

  console.log('apigate.selftest: ok');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
