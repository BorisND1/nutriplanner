
import { ProfileForm } from "@/components/ProfileForm";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { useSubscriptionTier } from "@/hooks/useSubscriptionTier";

export default function Index() {
  const { isLoading, isPremium } = useSubscriptionTier();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        FoodPlanner
      </h1>
      {!isPremium && <SubscriptionPlans />}
      <ProfileForm />
    </div>
  );
}
