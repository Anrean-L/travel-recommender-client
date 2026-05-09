import './App.css';
import getDeviceLocation from './geolocation';
import { fetchRecommendations } from './api/recommendations';
import type { RecommendationResponse, Coordinates } from './types';
import { useRef, useState, useEffect } from 'react';

function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

function formatWindDirection(degrees: number): string {
    if (degrees <= 22.5 || degrees >= 337.5) {
        return 'N';
    }
    if (degrees < 67.5) {
        return 'NE';
    }
    if (degrees <= 112.5) {
        return 'E';
    }
    if (degrees < 157.5) {
        return 'SE';
    }
    if (degrees <= 202.5) {
        return "S";
    }
    if (degrees < 247.5) {
        return "SW";
    }
    if (degrees <= 292.5) {
        return "W";
    }
    return 'NW';
}

function App() {
    const [data, setData] = useState<RecommendationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const alreadyLoaded = useRef(false);

    useEffect(() => {
        if (alreadyLoaded.current) {
            return;
        }
        alreadyLoaded.current = true;
        async function loadRecommendations() {
            setIsLoading(true);
            setError(null);
            console.log('loading places...');

            try {
                let coords: Coordinates | undefined;

                try {
                    coords = await getDeviceLocation();
                } catch {
                    coords = undefined;
                }
                const result = await fetchRecommendations(coords);
                setData(result);
            } catch (e) {
                setError(
                    e instanceof Error ? e.message : 'Something wend wrong',
                );
            } finally {
                setIsLoading(false);
                console.log('places are loaded');
            }
        }
        loadRecommendations();
    }, []);
    return (
        <main className='page'>
            <section className='hero'>
                <h1>Place recommender</h1>
                <p>
                    Recommendations based on your location, weather and walking
                    distance.
                </p>
            </section>

            {isLoading && <p className='loading'>Searching for places nearby...</p>}

            {error && <p className='error'>{error}</p>}

            {data && (
                <>
                    <section className='weather-card'>
                        <h2>Weather nearby</h2>
                        <p className='weather-main'>
                            {data.weather.description}
                        </p>
                        <p>
                            {Math.round(data.weather.temperature)}°C, feels like{' '}
                            {Math.round(data.weather.apparent_temperature)}°C
                        </p>
                        <p>
                            Wind: {Math.round(data.weather.wind_speed)} km/h · {formatWindDirection(data.weather.wind_direction)}
                            {}
                        </p>
                    </section>

                    <section className='places'>
                        <h2>Recommended places</h2>

                        <div className='place-list'>
                            {data.places.map(item => (
                                <article
                                    className='place-card'
                                    key={`${item.place.coords.lat}-${item.place.coords.lon}`}>
                                    <div className='place-header'>
                                        <h3>{item.place.name}</h3>
                                        <span>{item.place.kind}</span>
                                    </div>

                                    <p className='reason'>{item.reason}</p>

                                    <p>
                                        Walk: {Math.round(item.walk_time_min)}{' '}
                                        min ·{' '}
                                        {formatDistance(item.route_distance_m)}
                                    </p>

                                    {item.place.address && (
                                        <p className='muted'>
                                            {item.place.address}
                                        </p>
                                    )}

                                    {item.place.website && (
                                        <a
                                            href={item.place.website}
                                            target='_blank'
                                            rel='noreferrer'>
                                            Website
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}

export default App;
