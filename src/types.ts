export type Coordinates = {
    lat: number;
    lon: number;
};

export type WeatherInfo = {
    temperature: number;
    apparent_temperature: number;
    relative_humidity: number;
    rain: number;
    snowfall: number;
    wind_speed: number;
    wind_direction: number;
    description: string;
};

export type ScoredPlace = {
    place: {
        name: string;
        kind: string;
        envirnoment: string;
        coords: Coordinates;
        address: string;
        website: string;
        opening_hours: string;
    };
    reason: string;
    walk_time_min: number;
    route_distance_m: number;
    straight_distance_m: number;
    score: number;
};

export type RecommendationResponse = {
    location: Coordinates;
    weather: WeatherInfo;
    places: ScoredPlace[];
};
