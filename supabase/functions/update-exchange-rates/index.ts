
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const OPENEXCHANGERATES_API_KEY = Deno.env.get('OPENEXCHANGERATES_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
}

Deno.serve(async (req) => {
  try {
    // Fetch latest exchange rates from OpenExchangeRates
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${OPENEXCHANGERATES_API_KEY}&base=EUR`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data: ExchangeRatesResponse = await response.json();

    // Get all regions from our database
    const { data: regions, error: regionsError } = await supabase
      .from('currency_by_region')
      .select('region, currency_code');

    if (regionsError) {
      throw regionsError;
    }

    // Update exchange rates for each region
    for (const region of regions) {
      const { currency_code } = region;
      const exchangeRate = data.rates[currency_code];

      if (exchangeRate) {
        const { error: updateError } = await supabase
          .from('currency_by_region')
          .update({
            exchange_rate_to_euro: 1 / exchangeRate,
            exchange_rates_updated_at: new Date().toISOString()
          })
          .eq('currency_code', currency_code);

        if (updateError) {
          console.error(`Error updating ${currency_code}:`, updateError);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
