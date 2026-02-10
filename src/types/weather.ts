export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  timestamp: number;
  lat: number;
  lon: number;
  weatherMain: string;
}

export interface ForecastDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
}

export interface SavedCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
