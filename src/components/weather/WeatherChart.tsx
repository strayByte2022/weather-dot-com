'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HistoricalWeatherResponse } from '@/lib/types/weather';
import { formatDateTime } from '@/lib/utils/date';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherChartProps {
  data: HistoricalWeatherResponse;
}

export function WeatherChart({ data }: WeatherChartProps) {
  const chartData = {
    labels: data.list.map(item => formatDateTime(item.dt).local),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.list.map(item => item.main.temp),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Humidity (%)',
        data: data.list.map(item => item.main.humidity),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Wind Speed (m/s)',
        data: data.list.map(item => item.wind.speed),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weather History',
        color: 'white',
      },
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white', maxRotation: 45 },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="mt-4 p-4 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg">
      <Line options={options} data={chartData} />
    </div>
  );
}