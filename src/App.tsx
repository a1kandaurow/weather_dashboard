import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

import {
  WeatherData,
  ForecastDay,
  HourlyForecast,
  SavedCity,
} from "./types/weather";
import {
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
} from "./services/weatherApi";

import Search from "./components/Search";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import TemperatureChart from "./components/TemperatureChart";
import ErrorMessage from "./components/ErrorMessage";
import CitySidebar from "./components/CitySidebar";
import CityMap from "./components/CityMap";

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyForecast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCities, setSavedCities] = useLocalStorage<SavedCity[]>(
    "saved-cities",
    [],
  );

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData, hourlyForecastData] = await Promise.all(
        [getCurrentWeather(city), getForecast(city), getHourlyForecast(city)],
      );

      setWeather(weatherData);
      setForecast(forecastData);
      setHourlyData(hourlyForecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setWeather(null);
      setForecast([]);
      setHourlyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCity = () => {
    if (!weather) return;

    const cityExists = savedCities.some(
      (city) => city.name === weather.city && city.country === weather.country,
    );

    if (cityExists) {
      setSavedCities(
        savedCities.filter(
          (city) =>
            !(city.name === weather.city && city.country === weather.country),
        ),
      );
    } else {
      setSavedCities([
        ...savedCities,
        {
          name: weather.city,
          country: weather.country,
          lat: weather.lat, // теперь реальные координаты
          lon: weather.lon, // теперь реальные координаты
        },
      ]);
    }
  };

  const handleRemoveCity = (cityToRemove: SavedCity) => {
    setSavedCities(
      savedCities.filter(
        (city) =>
          !(
            city.name === cityToRemove.name &&
            city.country === cityToRemove.country
          ),
      ),
    );
  };

  const isCitySaved = weather
    ? savedCities.some(
        (city) =>
          city.name === weather.city && city.country === weather.country,
      )
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
            ☀️ Weather Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Актуальная погода и прогноз на 5 дней
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Левая панель - сохранённые города */}
          <div className="xl:col-span-3">
            <CitySidebar
              cities={savedCities}
              onSelectCity={handleSearch}
              onRemoveCity={handleRemoveCity}
              currentCity={weather?.city}
            />
          </div>

          {/* Основной контент */}
          <div className="xl:col-span-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <Search onSearch={handleSearch} isLoading={isLoading} />

              {error && (
                <ErrorMessage
                  message={error}
                  onDismiss={() => setError(null)}
                />
              )}

              {weather && (
                <div className="space-y-6">
                  <CurrentWeather
                    weather={weather}
                    onSaveCity={handleSaveCity}
                    isSaved={isCitySaved}
                  />

                  {hourlyData.length > 0 && (
                    <TemperatureChart data={hourlyData} />
                  )}

                  {forecast.length > 0 && <Forecast forecast={forecast} />}
                </div>
              )}

              {!weather && !isLoading && !error && (
                <div className="text-center py-16">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    Введите название города для просмотра погоды
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Правая панель - карта */}
          <div className="xl:col-span-3 min-h-[500px]">
            {weather ? (
              <CityMap
                cityName={weather.city}
                lat={weather.lat}
                lon={weather.lon}
                temperature={weather.temperature}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl h-full flex items-center justify-center">
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-sm">Выберите город</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
