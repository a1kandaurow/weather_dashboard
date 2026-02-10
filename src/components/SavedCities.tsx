import { SavedCity } from '../types/weather';

interface SavedCitiesProps {
  cities: SavedCity[];
  onSelectCity: (city: string) => void;
  onRemoveCity: (city: SavedCity) => void;
}

export default function SavedCities({ cities, onSelectCity, onRemoveCity }: SavedCitiesProps) {
  if (cities.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Избранные города
      </h3>
      <div className="flex flex-wrap gap-2">
        {cities.map((city, index) => (
          <div
            key={index}
            className="group relative bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg px-4 py-2 transition-all"
          >
            <button
              onClick={() => onSelectCity(city.name)}
              className="text-blue-800 dark:text-blue-300 font-medium"
            >
              {city.name}, {city.country}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCity(city);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
