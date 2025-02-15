
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface RegionSelectorProps {
  control: any;
  name: string;
}

export const REGIONS = [
  { value: "Europe", label: "Europe" },
  { value: "Afrique", label: "Afrique" },
  { value: "Asie", label: "Asie" },
  { value: "Amérique du Nord", label: "Amérique du Nord" },
  { value: "Amérique du Sud", label: "Amérique du Sud" },
  { value: "Océanie", label: "Océanie" },
  { value: "Moyen-Orient", label: "Moyen-Orient" }
] as const;

export const RegionSelector: React.FC<RegionSelectorProps> = ({ control, name }) => {
  const { region, loading, error } = useGeolocation();
  const { toast } = useToast();
  const form = control._formState;

  React.useEffect(() => {
    if (region && !form.defaultValues?.region) {
      control._fields[name]?._f.onChange(region);
      toast({
        title: "Région détectée",
        description: `Votre région a été détectée : ${region}`,
      });
    }
  }, [region, control, name, form.defaultValues?.region]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Région</FormLabel>
          <div className="space-y-2">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre région" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
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
                  Détecter ma région
                </Button>
              )}
            </div>
          </div>
          <FormDescription>
            Sélectionnez votre région pour obtenir des recommandations adaptées à vos habitudes alimentaires locales
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
