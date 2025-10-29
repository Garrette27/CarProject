# CarProject

## Environment configuration

This app reads the backend base URL from a Vite env variable `VITE_API_URL`.

1) Create a `.env` file in the project root (same folder as `package.json`):

```
VITE_API_URL=https://your-backend-url.example.com
```

Tip: See `.env.example` for the key you need. For local backend testing, you can use:

```
VITE_API_URL=http://localhost:3000
```

2) After changing `.env`, restart the dev server or rebuild for production so Vite picks up new values.

## Development

```
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```
npm run build
```

Deploy the `dist/` directory to your host.
