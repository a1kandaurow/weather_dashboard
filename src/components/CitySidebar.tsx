import { useEffect, useState } from "react";
import { SavedCity } from "../types/weather";
import { getCurrentWeather } from "../services/weatherApi";
import { getWeatherIconUrl } from "../services/weatherApi";

interface CityWeatherCard {
  city: SavedCity;
  temperature?: number;
  icon?: string;
  description?: string;
  isLoading: boolean;
}

interface CitySidebarProps {
  cities: SavedCity[];
  onSelectCity: (city: string) => void;
  onRemoveCity: (city: SavedCity) => void;
  currentCity?: string;
}

export default function CitySidebar({
  cities,
  onSelectCity,
  onRemoveCity,
  currentCity,
}: CitySidebarProps) {
  const [cityWeathers, setCityWeathers] = useState<
    Map<string, CityWeatherCard>
  >(new Map());

  useEffect(() => {
    // Загружаем погоду для каждого сохранённого города
    cities.forEach(async (city) => {
      const cityKey = `${city.name}-${city.country}`;

      setCityWeathers((prev) =>
        new Map(prev).set(cityKey, {
          city,
          isLoading: true,
        }),
      );

      try {
        const weather = await getCurrentWeather(city.name);
        setCityWeathers((prev) =>
          new Map(prev).set(cityKey, {
            city,
            temperature: weather.temperature,
            icon: weather.icon,
            description: weather.description,
            isLoading: false,
          }),
        );
      } catch (error) {
        setCityWeathers((prev) =>
          new Map(prev).set(cityKey, {
            city,
            isLoading: false,
          }),
        );
      }
    });

    // Удаляем карточки городов, которых больше нет в списке
    setCityWeathers((prev) => {
      const newMap = new Map(prev);
      newMap.forEach((_, key) => {
        const exists = cities.some((c) => `${c.name}-${c.country}` === key);
        if (!exists) {
          newMap.delete(key);
        }
      });
      return newMap;
    });
  }, [cities]);

  if (cities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl h-full flex items-center justify-center">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm">
            Добавьте города
            <br />
            нажав на ⭐
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Мои города
      </h2>
      <div className="space-y-3">
        {cities.map((city) => {
          const cityKey = `${city.name}-${city.country}`;
          const weatherData = cityWeathers.get(cityKey);
          const isActive = currentCity === city.name;

          return (
            <div
              key={cityKey}
              onClick={() => onSelectCity(city.name)}
              className={`relative group cursor-pointer rounded-xl p-4 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCity(city);
                }}
                className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white/20 hover:bg-white/30 text-white"
                    : "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                } opacity-0 group-hover:opacity-100`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="flex items-start sm:items-center justify-between pr-8 gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-bold text-base sm:text-lg truncate ${isActive ? "text-white" : "text-gray-800 dark:text-white"}`}
                  >
                    {city.name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {city.country}
                  </p>
                  {weatherData?.description && (
                    <p
                      className={`text-xs mt-1 capitalize line-clamp-1 ${isActive ? "text-white/70" : "text-gray-400 dark:text-gray-500"}`}
                    >
                      {weatherData.description}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {weatherData?.isLoading ? (
                    <div className="animate-spin">
                      <svg
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${isActive ? "text-white/50" : "text-gray-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  ) : weatherData?.temperature !== undefined ? (
                    <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                      {weatherData.icon && (
                        <img
                          src={getWeatherIconUrl(weatherData.icon)}
                          alt=""
                          className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
                        />
                      )}
                      <span
                        className={`text-xl sm:text-2xl lg:text-3xl font-bold whitespace-nowrap ${isActive ? "text-white" : "text-gray-800 dark:text-white"}`}
                      >
                        {weatherData.temperature}°
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
