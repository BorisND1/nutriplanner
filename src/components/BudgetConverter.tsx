
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";

interface BudgetConverterProps {
  defaultBudget?: number;
  onBudgetChange?: (budget: number) => void;
}

export function BudgetConverter({ defaultBudget = 100, onBudgetChange }: BudgetConverterProps) {
  const [localBudget, setLocalBudget] = React.useState(defaultBudget);
  const [inputCurrency, setInputCurrency] = React.useState<"EUR" | "LOCAL">("EUR");
  const { region, currencyInfo, loading: geoLoading } = useGeolocation();

  const { data: convertedBudget, isLoading: conversionLoading } = useQuery({
    queryKey: ['convertBudget', localBudget, region, inputCurrency],
    queryFn: async () => {
      if (!region || !currencyInfo) return localBudget;

      const { exchangeRateToEuro } = currencyInfo;
      
      if (inputCurrency === "EUR") {
        // Convert from EUR to local currency
        return (localBudget * exchangeRateToEuro).toFixed(2);
      } else {
        // Convert from local currency to EUR
        return (localBudget / exchangeRateToEuro).toFixed(2);
      }
    },
    enabled: !!region && !!currencyInfo,
  });

  const handleBudgetChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setLocalBudget(numericValue);
    if (inputCurrency === "EUR") {
      onBudgetChange?.(numericValue);
    } else if (currencyInfo) {
      // Convert local currency to EUR before calling onBudgetChange
      onBudgetChange?.(numericValue / currencyInfo.exchangeRateToEuro);
    }
  };

  const loading = geoLoading || conversionLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Votre budget</CardTitle>
        <CardDescription>
          Définissez votre budget dans votre devise préférée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {region && currencyInfo && (
          <RadioGroup
            value={inputCurrency}
            onValueChange={(value: "EUR" | "LOCAL") => setInputCurrency(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EUR" id="eur" />
              <Label htmlFor="eur">Euros (€)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LOCAL" id="local" />
              <Label htmlFor="local">{`Devise locale (${currencyInfo.currencySymbol})`}</Label>
            </div>
          </RadioGroup>
        )}

        <div className="space-y-2">
          <Label htmlFor="budget">
            {inputCurrency === "EUR" 
              ? "Budget en euros (€)" 
              : `Budget en ${currencyInfo?.currencySymbol || ''}`}
          </Label>
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
          <Label>
            {inputCurrency === "EUR" 
              ? `Budget converti (${currencyInfo?.currencySymbol || ''})` 
              : "Budget en euros (€)"}
          </Label>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <div className="p-2 bg-muted rounded-md">
              <p className="text-lg font-medium">
                {convertedBudget} {inputCurrency === "EUR" ? currencyInfo?.currencySymbol : "€"}
                {region && <span className="text-sm text-muted-foreground ml-2">({region})</span>}
              </p>
            </div>
          )}
        </div>

        {currencyInfo?.exchange_rates_updated_at && (
          <p className="text-sm text-muted-foreground">
            Taux de change mis à jour le{" "}
            {new Date(currencyInfo.exchange_rates_updated_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
