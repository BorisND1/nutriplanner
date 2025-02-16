
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionPlans() {
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      // Pour l'instant, on simule juste la mise à niveau
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            tier: 'premium',
            started_at: new Date().toISOString(),
            ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
          }
        ]);

      if (error) throw error;

      // Mettre à jour le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ subscription_tier: 'premium' })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Abonnement premium activé !",
        description: "Profitez de toutes les fonctionnalités premium dès maintenant.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à niveau :', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à niveau l'abonnement pour le moment.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Choisissez votre plan</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Plan Gratuit</CardTitle>
            <CardDescription>Pour commencer à planifier vos repas</CardDescription>
            <div className="text-3xl font-bold mt-4">0€ / mois</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Création d'un profil personnel</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Calcul des besoins caloriques</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Planning de base (3 repas/jour)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Recommandations alimentaires basiques</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Région Europe uniquement</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Plan actuel</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Plan Premium</CardTitle>
            <CardDescription>Pour une expérience personnalisée complète</CardDescription>
            <div className="text-3xl font-bold mt-4">9.99€ / mois</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Toutes les fonctionnalités gratuites</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Planning personnalisé (3-6 repas)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Adaptation aux allergies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Alternatives économiques</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Toutes les régions disponibles</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Notifications personnalisées</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Historique illimité</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Support prioritaire</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleUpgrade}>Passer au Premium</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
