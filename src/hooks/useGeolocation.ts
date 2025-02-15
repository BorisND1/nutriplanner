
import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  region: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    region: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: "La géolocalisation n'est pas supportée par votre navigateur",
        region: null
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
          );
          const data = await response.json();
          
          // Mapper le continent avec nos régions
          let region;
          switch (data.continent) {
            case "Europe":
              region = "Europe";
              break;
            case "Africa":
              region = "Afrique";
              break;
            case "Asia":
              region = "Asie";
              break;
            case "North America":
              region = "Amérique du Nord";
              break;
            case "South America":
              region = "Amérique du Sud";
              break;
            case "Oceania":
              region = "Océanie";
              break;
            default:
              if (["Saudi Arabia", "Iran", "Iraq", "Syria", "Lebanon", "Israel", "Jordan", "Egypt", "Turkey"].includes(data.countryName)) {
                region = "Moyen-Orient";
              } else {
                region = "Europe"; // Fallback par défaut
              }
          }

          setState({
            loading: false,
            error: null,
            region
          });
        } catch (error) {
          setState({
            loading: false,
            error: "Erreur lors de la détection de la région",
            region: null
          });
        }
      },
      (error) => {
        setState({
          loading: false,
          error: "Erreur lors de la géolocalisation",
          region: null
        });
      }
    );
  }, []);

  return state;
};
