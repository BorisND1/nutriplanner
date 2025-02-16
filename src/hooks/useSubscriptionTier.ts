
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useSubscriptionTier() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium'>('free');

  useEffect(() => {
    async function checkSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setSubscriptionTier(profile.subscription_tier);
        setIsPremium(profile.subscription_tier === 'premium');
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, []);

  return { isLoading, isPremium, subscriptionTier };
}
