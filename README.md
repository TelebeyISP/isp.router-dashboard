# Telebey Open5GS Router Dashboard

<p align="center">
  <img src="docs/assets/screenshots/02-overview.png" alt="Network Overview with ApiGate online" width="920">
</p>

Administration UI for the Telebey Open5GS 4G/5G core. It manages subscribers (IMSI / K / OPc), APN data profiles, and WebUI accounts, and it connects northbound to **[ApiGate](https://github.com/TelebeyISP/ApiGate.git)**.

## Screenshots

Live run against ApiGate (`GET /health` + `GET /plans`). Images are stored in this repo under [`docs/assets/screenshots/`](docs/assets/screenshots/).

<p align="center">
  <img src="docs/assets/screenshots/01-login.png" alt="Sign in" width="920">
</p>

<p align="center">
  <img src="docs/assets/screenshots/03-apigate.png" alt="ApiGate gateway page — Online, 3 plans" width="920">
</p>

<p align="center">
  <img src="docs/assets/screenshots/04-subscribers.png" alt="SIM management" width="920">
</p>

<p align="center">
  <img src="docs/assets/screenshots/05-profiles.png" alt="Data plans" width="920">
</p>

<p align="center">
  <img src="docs/assets/screenshots/06-accounts.png" alt="Accounts and security" width="920">
</p>

| Sign in | Overview | ApiGate |
| :---: | :---: | :---: |
| <img src="docs/assets/screenshots/01-login.png" alt="Login" width="280"> | <img src="docs/assets/screenshots/02-overview.png" alt="Overview" width="280"> | <img src="docs/assets/screenshots/03-apigate.png" alt="ApiGate" width="280"> |
| **SIMs** | **Data plans** | **Accounts** |
| <img src="docs/assets/screenshots/04-subscribers.png" alt="SIMs" width="280"> | <img src="docs/assets/screenshots/05-profiles.png" alt="Profiles" width="280"> | <img src="docs/assets/screenshots/06-accounts.png" alt="Accounts" width="280"> |

## Demo video

GitHub README pages do not play `<video>` tags. Open the MP4 on GitHub:

**[▶ Watch router-dashboard-demo.mp4](https://github.com/TelebeyISP/isp.router-dashboard/blob/main/docs/assets/screenshots/router-dashboard-demo.mp4)**

[![Demo video preview — ApiGate connected](docs/assets/screenshots/03-apigate.png)](https://github.com/TelebeyISP/isp.router-dashboard/blob/main/docs/assets/screenshots/router-dashboard-demo.mp4)

Direct file: [docs/assets/screenshots/router-dashboard-demo.mp4](docs/assets/screenshots/router-dashboard-demo.mp4)

## Quick start (WebUI)

Development defaults:

- URL: `http://localhost:9999`
- Username: `admin`
- Password: `1423`

```bash
# MongoDB must be reachable at mongodb://127.0.0.1:27017/open5gs
cd webui
cp .env.example .env   # optional
npm install
npm run dev
```

The dashboard binds to `0.0.0.0:9999` by default and probes ApiGate at `http://127.0.0.1:4000`.

## Connect to ApiGate

Clone and run [TelebeyISP/ApiGate](https://github.com/TelebeyISP/ApiGate.git) next to this repository (or point `APIGATE_URL` at an existing instance).

```bash
git clone https://github.com/TelebeyISP/ApiGate.git ../ApiGate
```

The WebUI does **not** call ApiGate from the browser (CORS is not required). The Node server proxies:

| Dashboard route | Upstream ApiGate |
| --- | --- |
| `GET /api/apigate/health` | `GET /health` |
| `GET /api/apigate/plans` | `GET /plans` |
| `GET /api/apigate/status` | health + plans + optional `/auth/me` and `/sim` |

Environment variables (see `webui/.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `APIGATE_URL` | `http://127.0.0.1:4000` | ApiGate base URL |
| `APIGATE_TIMEOUT_MS` | `4000` | Upstream timeout |
| `APIGATE_EMAIL` / `APIGATE_PASSWORD` | unset | Optional service login to list SIMs |
| `APIGATE_TOKEN` | unset | Optional bearer token instead of login |
| `OPEN5GS_MONGODB_URI` (ApiGate) | `mongodb://mongo:27017/nextgepc` | Set this to the same Open5GS DB as the dashboard (`mongodb://mongodb:27017/open5gs` in Compose) |

The **ApiGate** sidebar view shows gateway health, latency, advertised data plans, and (when service auth is configured) SIMs owned by the service account. Swagger lives at `$APIGATE_URL/api/docs`.

### Docker Compose (dashboard + ApiGate)

```bash
git clone https://github.com/TelebeyISP/ApiGate.git ../ApiGate
export APIGATE_PATH=../ApiGate
docker compose -f docker-compose.apigate.yml up --build
```

- Dashboard: http://localhost:9999
- ApiGate health: http://localhost:4000/health
- ApiGate Swagger: http://localhost:4000/api/docs

## Tests

```bash
cd webui
npm run test:apigate
```

This checks the ApiGate client against a local fixture server and against an unreachable URL.

## Open5GS core

The rest of this tree is Open5GS. Follow the [Open5GS documentation](https://open5gs.org/open5gs/docs/) to build and run AMF, SMF, UPF, and the other network functions. The WebUI reads and writes the Open5GS MongoDB subscriber database used by HSS/UDR.

## License

Open5GS sources are available under [GNU AGPL v3.0](LICENSE).
