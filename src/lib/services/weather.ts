import axios from 'axios';
import { WeatherResponse, HistoricalWeatherResponse } from '../types/weather';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherResponse> => {
  try {
    const response = await axios.get<WeatherResponse>(`${API_URL}weather`, {
      params: {
        lat,
        lon
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getHistoricalWeather = async (lat: number, lon: number): Promise<HistoricalWeatherResponse> => {
  try {
    const response = await axios.get<HistoricalWeatherResponse>(`${API_URL}weather/history`, {
      params: {
        lat,
        lon
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    throw error;
  }
};