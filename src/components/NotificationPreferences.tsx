
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const notificationSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  notification_enabled: z.boolean(),
  notification_advance_minutes: z.number().min(5).max(60),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export function NotificationPreferences() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      first_name: "",
      notification_enabled: true,
      notification_advance_minutes: 15,
    },
  });

  useEffect(() => {
    async function loadPreferences() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          form.reset({
            first_name: profile.first_name || "",
            notification_enabled: profile.notification_enabled,
            notification_advance_minutes: profile.notification_advance_minutes,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des préférences:", error);
      }
    }

    loadPreferences();
  }, [form]);

  async function onSubmit(data: NotificationFormValues) {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          notification_enabled: data.notification_enabled,
          notification_advance_minutes: data.notification_advance_minutes,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des préférences.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>
          Configurez vos préférences pour les rappels de repas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Votre prénom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notification_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Activer les notifications</FormLabel>
                    <FormDescription>
                      Recevez des rappels avant vos repas
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notification_advance_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Délai de notification (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={5}
                      max={60}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Combien de minutes avant l'heure du repas souhaitez-vous être notifié ?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les préférences"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
