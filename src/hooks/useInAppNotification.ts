
import { useEffect } from 'react';
import { onMessage } from "firebase/messaging";
import { messaging } from "@/integrations/firebase/client";
import { useToast } from "@/hooks/use-toast";

export function useInAppNotification() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message reçu :", payload);
      
      if (payload.notification) {
        // Afficher une notification native si disponible
        if (Notification.permission === "granted") {
          const notificationTitle = payload.notification.title;
          const notificationOptions = {
            body: payload.notification.body,
            icon: "/favicon.ico", // Utilisation de l'icône par défaut de l'application
          };
          new Notification(notificationTitle, notificationOptions);
        }

        // Afficher également un toast dans l'interface
        toast({
          title: payload.notification.title,
          description: payload.notification.body,
        });
      }
    });

    // Cleanup lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [toast]);
}
