
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
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: 'food-planner-notification',
            actions: [
              {
                action: 'ajuster',
                title: 'Ajuster l\'horaire'
              }
            ]
          };
          
          new Notification(notificationTitle, notificationOptions);
        }

        // Afficher également un toast dans l'interface
        toast({
          title: payload.notification.title,
          description: payload.notification.body,
          duration: 10000, // 10 secondes pour laisser le temps de réagir
        });
      }
    });

    // Cleanup lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [toast]);
}
