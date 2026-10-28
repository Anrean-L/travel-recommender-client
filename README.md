# Travel Recommender Client

A web client that suggests nearby places based on your location, weather, and walking distance. It displays local weather, recommended places, reasons to visit, walking times and distances, and links to Google Maps and venue websites.

Built with React 19, TypeScript 6, Vite 8, and CSS.

## Getting started

You will need Node.js 24, pnpm, and a running backend that provides a `GET /recommend` endpoint. This repository contains the frontend only.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://127.0.0.1:5173> and allow location access. The development server binds to the local address only. If port `5173` is already in use, startup will fail.

The client connects to `http://localhost:8080` by default. To use a different API address, create a `.env.local` file in the project root:

```dotenv
VITE_API_BASE=http://localhost:8080
```

Use the base URL without a trailing `/` or the `/recommend` path. Restart the development server after changing this variable.

The browser calls the backend directly; no Vite proxy is configured. The backend must allow CORS requests from the frontend origin, such as `http://127.0.0.1:5173`.

## How it works

When the page opens, the client requests the device location with an 8-second timeout. If permission is denied or the location cannot be obtained, it calls the API without `lat` and `lon`. The backend determines how to handle requests without coordinates.

Search parameters are currently defined in [src/api/recommendations.ts](src/api/recommendations.ts): a radius of 1,000 meters and up to 10 results. There are no controls for changing these values in the interface yet.

The page displays:

- Weather conditions, actual and feels-like temperatures, wind speed and direction.
- Each place's name, category, and recommendation reason.
- Walking time, route distance, and an address when provided.
- A Google Maps link and a venue website link when provided.

Reload the page to fetch recommendations again or apply a change to location permissions.

## API

Example request with coordinates:

```http
GET /recommend?lat=55.75&lon=37.62&radius_m=1000&max_results=10
```

The client expects a JSON response with the following fields. The full response contract is defined in [src/types.ts](src/types.ts).

| Field | Contents |
| --- | --- |
| `location` | Coordinates: `lat` and `lon` |
| `weather` | Temperature, precipitation, humidity, wind, and a weather description |
| `places` | An array of places with coordinates, recommendation reasons, scores, distances, and walking times |

For unsuccessful HTTP responses, the client displays the JSON `error` field. If that field is missing or the response is not JSON, it displays `Request failed: <status>`.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server at `127.0.0.1:5173` |
| `pnpm build` | Run TypeScript checks and build into `dist/` |
| `pnpm lint` | Check the code with ESLint |
| `pnpm preview` | Preview the production build locally |

There is currently no automated test script.

## Building and deploying

```bash
pnpm build
pnpm preview
```

Deploy the contents of `dist/` to a static hosting service. Use `pnpm preview` to check the build locally.

`VITE_API_BASE` is embedded at build time, so set the production API address before running `pnpm build`. Changing the variable afterward will not update the built files. Variables prefixed with `VITE_` are exposed to the browser; do not store secrets in them.

Use HTTPS for geolocation on a deployed site; local development is supported on loopback addresses. If the frontend uses HTTPS, the API must also be accessible over HTTPS. Configure the backend to allow CORS requests from the deployed frontend origin.

## Project structure

```text
src/
  api/
    geolocation.ts      # Browser location access
    recommendations.ts  # Recommendation requests and API error handling
  App.tsx               # Data loading and user interface
  App.css               # Page and card styles
  index.css             # Global styles
  main.tsx              # React entry point
  types.ts              # API response types
public/                 # Static assets
vite.config.ts          # Vite configuration
```
