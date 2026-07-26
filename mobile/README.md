# Indian Govt Org Chart — Android (Expo)

React Native / Expo client for the [Indian Government Org Chart](https://indianorgchart.netlify.app) web app. Test on a physical Android phone with **Expo Go**.

## Test with Expo Go (Android)

1. Install **[Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)** from the Play Store.
2. On your computer (same Wi‑Fi as the phone):

```bash
cd mobile
npm install
npm start
```

3. Scan the QR code in the terminal with Expo Go (or the system camera / Expo Go scanner).
4. The app loads Dashboard, Explore, Geography, Quality, AI Agent, and Wiki.

Tunnel mode (different networks):

```bash
npx expo start --tunnel
```

## What it uses

| Feature | Source |
|---------|--------|
| Dataset | `https://indianorgchart.netlify.app/data/accountable-india.json` |
| AI Agent | `POST https://indianorgchart.netlify.app/api/chat` |

You need network access on the device. The AI agent requires the production Netlify function (and `DEEPSEEK_API_KEY` on Netlify).

## Scripts

```bash
npm start          # Expo dev server (QR for Expo Go)
npm run android    # Open on Android emulator / device if adb is available
npm run web        # Optional web preview via Metro
```

From the repo root:

```bash
npm run mobile     # starts Expo in ./mobile
```

## Project layout

```
mobile/
├── app/                 # Expo Router screens + tabs
├── components/          # Shared UI
├── lib/                 # Dataset loader, theme, wiki summaries
├── constants/Colors.ts
└── app.json             # Expo config (Android package, splash, icons)
```

## Notes

- This is the first native shell of the web product — charts are simplified (bar lists instead of Recharts), and the wiki is a short in-app summary.
- For a store build later, use [EAS Build](https://docs.expo.dev/build/introduction/); Expo Go is for day-to-day testing only.
