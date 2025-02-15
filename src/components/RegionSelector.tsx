
import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin } from "lucide-react";
import { Control } from "react-hook-form";

interface RegionSelectorProps {
  control: Control<any>;
  name: string;
  onRegionChange?: (region: string) => void;
}

export const REGIONS = [
  { value: "Europe", label: "Europe", symbol: "€" },
  { value: "Afrique", label: "Afrique", symbol: "CFA" },
  { value: "Asie", label: "Asie", symbol: "¥" },
  { value: "Amérique du Nord", label: "Amérique du Nord", symbol: "$" },
  { value: "Amérique du Sud", label: "Amérique du Sud", symbol: "R$" },
  { value: "Océanie", label: "Océanie", symbol: "$" },
  { value: "Moyen-Orient", label: "Moyen-Orient", symbol: "د.إ" }
] as const;

export const RegionSelector: React.FC<RegionSelectorProps> = ({ control, name, onRegionChange }) => {
  const { region, currencyInfo, loading, error } = useGeolocation();
  const { toast } = useToast();

  React.useEffect(() => {
    if (region) {
      onRegionChange?.(region);
      toast({
        title: "Région détectée",
        description: `Nous avons détecté que vous êtes en ${region}. Les prix seront affichés en ${currencyInfo?.currencySymbol || ''}.`,
        duration: 5000,
      });
    }
  }, [region, currencyInfo, onRegionChange, toast]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Région</FormLabel>
          <div className="space-y-2">
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onRegionChange?.(value);
              }} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre région" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{region.label}</span>
                      <span className="text-muted-foreground">{region.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              {loading ? (
                <Button variant="outline" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Détection en cours...
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        () => {},
                        () => {
                          toast({
                            title: "Erreur",
                            description: "Impossible d'accéder à votre position",
                            variant: "destructive",
                          });
                        }
                      );
                    }
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Détecter ma région
                </Button>
              )}
            </div>
          </div>
          <FormDescription>
            Sélectionnez votre région pour obtenir des recommandations adaptées à vos habitudes alimentaires locales et voir les prix dans votre devise
          </FormDescription>
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
};
