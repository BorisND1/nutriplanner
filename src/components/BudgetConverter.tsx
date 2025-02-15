
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface BudgetConverterProps {
  defaultBudget?: number;
  onBudgetChange?: (budget: number) => void;
}

export function BudgetConverter({ defaultBudget = 100, onBudgetChange }: BudgetConverterProps) {
  const [localBudget, setLocalBudget] = React.useState(defaultBudget);
  const { region, currencyInfo, loading: geoLoading } = useGeolocation();

  const { data: convertedBudget, isLoading: conversionLoading } = useQuery({
    queryKey: ['convertBudget', localBudget, region],
    queryFn: async () => {
      if (!region || !currencyInfo) return localBudget;

      const { exchangeRateToEuro } = currencyInfo;
      return (localBudget * exchangeRateToEuro).toFixed(2);
    },
    enabled: !!region && !!currencyInfo,
  });

  const handleBudgetChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setLocalBudget(numericValue);
    onBudgetChange?.(numericValue);
  };

  const loading = geoLoading || conversionLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Votre budget</CardTitle>
        <CardDescription>
          Définissez votre budget en euros, nous le convertirons automatiquement dans votre devise locale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget en euros (€)</Label>
          <Input
            id="budget"
            type="number"
            min="0"
            step="10"
            value={localBudget}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Budget converti {region ? `(${currencyInfo?.currencySymbol})` : ''}</Label>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <div className="p-2 bg-muted rounded-md">
              <p className="text-lg font-medium">
                {convertedBudget} {currencyInfo?.currencySymbol}
                {region && <span className="text-sm text-muted-foreground ml-2">({region})</span>}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
