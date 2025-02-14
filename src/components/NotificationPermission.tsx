
import { useState } from 'react';
import { getToken } from "firebase/messaging";
import { messaging } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell } from 'lucide-react';

export function NotificationPermission() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const requestNotificationPermission = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Obtenir le token FCM
        const token = await getToken(messaging, {
          vapidKey: "fMSFsa05KL71wzl8zQ01LA9l5lfzapUiPw1SILjSdtk",
        });
        console.log("Token FCM :", token);
        
        toast({
          title: "Notifications activées",
          description: "Vous recevrez désormais des notifications pour vos repas.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Notifications refusées",
          description: "Vous ne recevrez pas de notifications. Vous pouvez changer cela dans les paramètres de votre navigateur.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation des notifications.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={requestNotificationPermission} 
      disabled={loading}
      variant="outline"
      className="flex gap-2 items-center"
    >
      <Bell className="h-4 w-4" />
      {loading ? "Activation..." : "Activer les notifications"}
    </Button>
  );
}
