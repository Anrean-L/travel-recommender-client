import type { Coordinates, RecommendationResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

export async function fetchRecommendations(
    coords?: Coordinates,
): Promise<RecommendationResponse> {
    const params = new URLSearchParams();
    if (coords) {
        params.set('lat', String(coords.lat));
        params.set('lon', String(coords.lon));
    }
    params.set('radius_m', '1000');
    params.set('max_results', '10');

    const response = await fetch(`${API_BASE}/recommend?${params.toString()}`);
    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? `Request failed: ${response.status}`);
    }
    return response.json();
}
