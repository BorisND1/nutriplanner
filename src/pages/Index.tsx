
import { BudgetConverter } from "@/components/BudgetConverter";
import { ProfileForm } from "@/components/ProfileForm";

export default function Index() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Bienvenue</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <BudgetConverter />
        <ProfileForm />
      </div>
    </div>
  );
}
