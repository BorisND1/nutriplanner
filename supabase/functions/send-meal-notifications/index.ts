
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialisation du client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Récupération des notifications à envoyer
    const now = new Date()
    const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

    const { data: notifications, error } = await supabase
      .from('meal_notifications')
      .select(`
        *,
        profiles (
          first_name,
          email,
          notification_enabled,
          notification_advance_minutes
        )
      `)
      .eq('notification_sent', false)
      .filter('profiles.notification_enabled', 'eq', true)

    if (error) throw error

    // Envoi des notifications
    for (const notification of notifications) {
      const scheduledTime = new Date(`${now.toDateString()} ${notification.scheduled_time}`)
      const notifyTime = new Date(scheduledTime.getTime() - (notification.profiles.notification_advance_minutes * 60000))

      if (now >= notifyTime && now <= scheduledTime) {
        // Ici, vous pouvez implémenter l'envoi de notification par email ou autre
        console.log(`Envoi de notification à ${notification.profiles.email} pour le repas ${notification.meal_name}`)

        // Marquer la notification comme envoyée
        await supabase
          .from('meal_notifications')
          .update({ notification_sent: true })
          .eq('id', notification.id)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})
