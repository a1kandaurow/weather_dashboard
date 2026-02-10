import { WeatherData } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherApi';

interface CurrentWeatherProps {
  weather: WeatherData;
  onSaveCity: () => void;
  isSaved: boolean;
}

export default function CurrentWeather({ weather, onSaveCity, isSaved }: CurrentWeatherProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-2xl p-8 text-white shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-bold mb-2">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-xl opacity-90 capitalize">{weather.description}</p>
        </div>
        <button
          onClick={onSaveCity}
          className={`p-3 rounded-full transition-all ${
            isSaved
              ? 'bg-yellow-400 text-yellow-900'
              : 'bg-white/20 hover:bg-white/30'
          }`}
          title={isSaved ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <svg
            className="w-6 h-6"
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={getWeatherIconUrl(weather.icon)}
            alt={weather.description}
            className="w-32 h-32"
          />
          <div>
            <div className="text-7xl font-bold">{weather.temperature}°</div>
            <div className="text-2xl opacity-80">
              Ощущается как {weather.feelsLike}°
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-right">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-80">Влажность</div>
            <div className="text-2xl font-semibold">{weather.humidity}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-80">Ветер</div>
            <div className="text-2xl font-semibold">{weather.windSpeed} км/ч</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-80">Давление</div>
            <div className="text-2xl font-semibold">{weather.pressure} гПа</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-sm opacity-80">Обновлено</div>
            <div className="text-lg font-semibold">
              {new Date(weather.timestamp * 1000).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
