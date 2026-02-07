import { useState, useEffect } from 'react';
import mock from '../mocks/dashboardData.json';
import { getInventory, getTransactions } from '../services/inventoryService';
import { getForecastSummary } from '../services/forecastService';

export default function useDashboard(placeId = 'demo'){
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load(){
      setLoading(true);
      try{
        const [inventory, forecast] = await Promise.all([
          getInventory(placeId).catch(() => null),
          getForecastSummary(placeId).catch(() => null)
        ]);
        const combined = { ...(mock || {}), inventory, forecast };
        if (mounted) setData(combined);
      }catch(e){
        if (mounted) setData(mock);
      }finally{ if (mounted) setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [placeId]);

  return { data, loading };
}
