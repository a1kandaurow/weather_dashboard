import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Фикс для иконок маркеров (проблема с Vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface CityMapProps {
  cityName: string;
  lat: number;
  lon: number;
  temperature?: number;
}

// Компонент для автоматического центрирования карты
function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], 10, {
      animate: true,
      duration: 1,
    });
  }, [lat, lon, map]);

  return null;
}

export default function CityMap({
  cityName,
  lat,
  lon,
  temperature,
}: CityMapProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          📍 Карта
        </h2>
      </div>

      <div className="relative h-[calc(100%-4rem)]">
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lon]}>
            <Popup>
              <div className="text-center">
                <strong className="text-lg">{cityName}</strong>
                {temperature !== undefined && (
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {temperature}°C
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>
      </div>
    </div>
  );
}
