
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseGeolocationResult {
  region: string | null;
  currencyInfo: {
    currencyCode: string;
    currencySymbol: string;
    exchangeRateToEuro: number;
    exchange_rates_updated_at?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): UseGeolocationResult => {
  const [region, setRegion] = useState<string | null>(null);
  const [currencyInfo, setCurrencyInfo] = useState<{
    currencyCode: string;
    currencySymbol: string;
    exchangeRateToEuro: number;
    exchange_rates_updated_at?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyInfo = async (region: string) => {
    const { data, error } = await supabase
      .from('currency_by_region')
      .select('currency_code, currency_symbol, exchange_rate_to_euro, exchange_rates_updated_at')
      .eq('region', region)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération des informations de devise:", error);
      return null;
    }

    return {
      currencyCode: data.currency_code,
      currencySymbol: data.currency_symbol,
      exchangeRateToEuro: data.exchange_rate_to_euro,
      exchange_rates_updated_at: data.exchange_rates_updated_at
    };
  };

  useEffect(() => {
    const detectRegion = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("La géolocalisation n'est pas supportée par votre navigateur"));
            return;
          }
          
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        // Utiliser l'API de géocodage inverse pour obtenir le pays
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();

        // Mapper le pays à une région
        let detectedRegion = 'Europe'; // Par défaut
        const country = data.address.country;

        // Logique de mapping des pays vers les régions
        if (['France', 'Germany', 'Spain', 'Italy'].includes(country)) {
          detectedRegion = 'Europe';
        } else if (['United States', 'Canada', 'Mexico'].includes(country)) {
          detectedRegion = 'Amérique du Nord';
        } else if (['Brazil', 'Argentina', 'Chile'].includes(country)) {
          detectedRegion = 'Amérique du Sud';
        } else if (['China', 'Japan', 'South Korea'].includes(country)) {
          detectedRegion = 'Asie';
        } else if (['South Africa', 'Nigeria', 'Kenya'].includes(country)) {
          detectedRegion = 'Afrique';
        } else if (['Australia', 'New Zealand'].includes(country)) {
          detectedRegion = 'Océanie';
        } else if (['Saudi Arabia', 'UAE', 'Qatar'].includes(country)) {
          detectedRegion = 'Moyen-Orient';
        }

        setRegion(detectedRegion);
        const currencyData = await getCurrencyInfo(detectedRegion);
        if (currencyData) {
          setCurrencyInfo(currencyData);
        }

      } catch (err) {
        console.error('Erreur de géolocalisation:', err);
        setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      } finally {
        setLoading(false);
      }
    };

    detectRegion();
  }, []);

  return { region, currencyInfo, loading, error };
};
