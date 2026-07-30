# Indian Org Chart — Expo mobile app

Android/iOS companion for [indianorgchart.netlify.app](https://indianorgchart.netlify.app), built with **Expo** so you can test instantly in **Expo Go**.

## Features

- **Dashboard** — office/person/jurisdiction coverage metrics
- **Explore** — full-text search across the live Accountable India index
- **Geography** — state picker, DM coverage, local offices
- **Quality** — verification / fill rates, pending & vacant samples

Data is fetched live from:

`https://indianorgchart.netlify.app/data/accountable-india.json`

(~12 MB on first open; progress is shown.)

## Test on Expo Go (Android)

1. Install **Expo Go** from the Play Store.
2. From the repo root:

```bash
cd mobile
npm install
npx expo start
```

3. Scan the QR code with Expo Go (or the Camera app on some devices).
4. Wait for the first dataset download, then browse the tabs.

### Tips

- Phone and computer must be on the same Wi‑Fi (or use tunnel mode: `npx expo start --tunnel`).
- If Metro can’t resolve `@/` imports, restart with `npx expo start -c`.
- Chat/wiki from the web app are not in this mobile cut yet.

## Scripts

| Command | Purpose |
|---------|---------|
| `npx expo start` | Dev server + QR for Expo Go |
| `npx expo start --android` | Open on connected Android emulator/device |
| `npx expo start --tunnel` | Expo Go over the internet (ngrok) |
