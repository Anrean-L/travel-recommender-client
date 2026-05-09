import type { Coordinates } from './types';

export default function getDeviceLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            reject,
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 60_000,
            },
        );
    });
}
