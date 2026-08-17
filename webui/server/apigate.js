const axios = require('axios');

const DEFAULT_URL = 'http://127.0.0.1:4000';
const timeout = Number(process.env.APIGATE_TIMEOUT_MS || 4000);

function baseURL() {
  return (process.env.APIGATE_URL || DEFAULT_URL).replace(/\/$/, '');
}

function client(headers) {
  return axios.create({
    baseURL: baseURL(),
    timeout,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}),
    validateStatus: function () { return true; }
  });
}

function errorMessage(err) {
  if (err && err.code === 'ECONNREFUSED') {
    return 'Connection refused — is ApiGate running at ' + baseURL() + '?';
  }
  if (err && err.code === 'ECONNABORTED') {
    return 'Request timed out after ' + timeout + 'ms';
  }
  return (err && err.message) || 'Unknown ApiGate error';
}

async function probe(path, headers) {
  const started = Date.now();
  try {
    const res = await client(headers).get(path);
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      latencyMs: Date.now() - started,
      data: res.data
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      latencyMs: Date.now() - started,
      error: errorMessage(err)
    };
  }
}

async function health() {
  return probe('/health');
}

async function getPlans() {
  return probe('/plans');
}

async function login(email, password) {
  const started = Date.now();
  try {
    const res = await client().post('/auth/login', { email: email, password: password });
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      latencyMs: Date.now() - started,
      data: res.data
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      latencyMs: Date.now() - started,
      error: errorMessage(err)
    };
  }
}

async function getMe(accessToken) {
  return probe('/auth/me', { Authorization: 'Bearer ' + accessToken });
}

async function getSims(accessToken) {
  return probe('/sim', { Authorization: 'Bearer ' + accessToken });
}

let cachedToken = null;
let cachedTokenAt = 0;

async function serviceToken() {
  if (process.env.APIGATE_TOKEN) {
    return { ok: true, token: process.env.APIGATE_TOKEN, source: 'APIGATE_TOKEN' };
  }

  const email = process.env.APIGATE_EMAIL;
  const password = process.env.APIGATE_PASSWORD;
  if (!email || !password) {
    return { ok: false, source: 'none' };
  }

  if (cachedToken && (Date.now() - cachedTokenAt) < 10 * 60 * 1000) {
    return { ok: true, token: cachedToken, source: 'login-cache' };
  }

  const result = await login(email, password);
  const token = result.data && (result.data.access_token || result.data.accessToken);
  if (!result.ok || !token) {
    return { ok: false, source: 'login', status: result.status, error: result.error || result.data };
  }

  cachedToken = token;
  cachedTokenAt = Date.now();
  return { ok: true, token: token, source: 'login' };
}

async function status() {
  const healthResult = await health();
  const plansResult = healthResult.ok ? await getPlans() : { ok: false, status: 0, data: [] };
  const auth = await serviceToken();

  let me = null;
  let sims = null;
  if (healthResult.ok && auth.ok) {
    me = await getMe(auth.token);
    sims = await getSims(auth.token);
  }

  const plans = Array.isArray(plansResult.data) ? plansResult.data : [];
  const simList = sims && Array.isArray(sims.data) ? sims.data : [];

  return {
    connected: !!healthResult.ok,
    url: baseURL(),
    repository: 'https://github.com/TelebeyISP/ApiGate.git',
    docs: baseURL() + '/api/docs',
    health: healthResult,
    plans: {
      ok: !!plansResult.ok,
      status: plansResult.status,
      count: plans.length,
      items: plans
    },
    auth: {
      configured: auth.source !== 'none',
      source: auth.source,
      ok: !!auth.ok,
      user: me && me.data ? me.data : null
    },
    sims: {
      ok: !!(sims && sims.ok),
      status: sims ? sims.status : 0,
      count: simList.length,
      items: simList
    }
  };
}

module.exports = {
  baseURL: baseURL,
  health: health,
  getPlans: getPlans,
  login: login,
  getMe: getMe,
  getSims: getSims,
  serviceToken: serviceToken,
  status: status
};
