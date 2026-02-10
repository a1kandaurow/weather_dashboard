import { WeatherData, ForecastDay, HourlyForecast } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Город не найден');
    }
    throw new Error('Ошибка при получении данных о погоде');
  }

  const data = await response.json();

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // м/с в км/ч
    pressure: data.main.pressure,
    timestamp: data.dt,
  };
}

export async function getForecast(city: string): Promise<ForecastDay[]> {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
  );

  if (!response.ok) {
    throw new Error('Ошибка при получении прогноза');
  }

  const data = await response.json();

  // Группируем по дням и берём полуденную температуру
  const dailyData: { [key: string]: any[] } = {};

  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('ru-RU');
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  return Object.entries(dailyData).slice(0, 5).map(([date, items]) => {
    // Берём данные около полудня (12:00)
    const noonItem = items.find(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= 11 && hour <= 13;
    }) || items[0];

    const temps = items.map(item => item.main.temp);

    return {
      date,
      temp: Math.round(noonItem.main.temp),
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      description: noonItem.weather[0].description,
      icon: noonItem.weather[0].icon,
      humidity: noonItem.main.humidity,
    };
  });
}

export async function getHourlyForecast(city: string): Promise<HourlyForecast[]> {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
  );

  if (!response.ok) {
    throw new Error('Ошибка при получении почасового прогноза');
  }

  const data = await response.json();

  // Берём следующие 8 записей (24 часа, каждые 3 часа)
  return data.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
  }));
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
