import api from './api';
import mock from '../mocks/forecastData.json';

export const getForecastSummary = async (placeId) => {
  try {
    const { data } = await api.get(`/forecast/summary?placeId=${placeId}`);
    return data;
  } catch (err) {
    return mock;
  }
};

export const getForecastForItem = async (itemId, days = 14) => {
  try {
    const { data } = await api.get(`/forecast/item/${itemId}?days=${days}`);
    return data;
  } catch (err) {
    // synthesize simple series from mock
    return { itemId, series: Array.from({ length: days }).map((_, i) => ({ day: i + 1, predicted: Math.round(10 + Math.random() * 20) })) };
  }
};

export default { getForecastSummary, getForecastForItem };
