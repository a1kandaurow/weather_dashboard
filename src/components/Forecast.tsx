import { ForecastDay } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherApi';

interface ForecastProps {
  forecast: ForecastDay[];
}

export default function Forecast({ forecast }: ForecastProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Прогноз на 5 дней
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {index === 0 ? 'Сегодня' : day.date.split('.')[0] + '.' + day.date.split('.')[1]}
            </div>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
              className="w-16 h-16 mx-auto"
            />
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {day.temp}°
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {day.tempMin}° / {day.tempMax}°
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 capitalize leading-tight">
              {day.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
