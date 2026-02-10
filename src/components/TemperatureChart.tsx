import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyForecast } from '../types/weather';

interface TemperatureChartProps {
  data: HourlyForecast[];
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = data.map(item => ({
    time: item.time,
    temperature: item.temp,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Температура на 24 часа
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [`${value}°C`, 'Температура']}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
