
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Mentions Légales
            </h1>
            <p className="text-xl text-muted-foreground">
              Informations légales et conditions d'utilisation de FoodPlanner
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="prose prose-lg mx-auto text-muted-foreground"
          >
            <section className="bg-secondary/20 p-6 rounded-lg border-l-4 border-primary mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold mb-2 text-foreground">Avis Important Concernant Votre Santé</h2>
                  <p className="font-semibold">
                    Les informations et recommandations fournies par FoodPlanner ne remplacent en aucun cas l'avis d'un professionnel de santé qualifié. Avant d'entreprendre tout changement significatif dans votre alimentation ou de suivre un programme nutritionnel, il est vivement recommandé de consulter votre médecin traitant, un nutritionniste ou un diététicien.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Éditeur du Site</h2>
              <p>
                FoodPlanner est édité par [Nom de la société], société [forme juridique] au capital de [montant] euros,
                immatriculée au Registre du Commerce et des Sociétés sous le numéro [numéro],
                dont le siège social est situé [adresse].
              </p>
              <p>
                Directeur de la publication : [Nom du directeur]<br />
                Email : contact@foodplanner.fr<br />
                Téléphone : [numéro]
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Hébergement</h2>
              <p>
                Le site FoodPlanner est hébergé par [Nom de l'hébergeur],<br />
                [Adresse de l'hébergeur]<br />
                Téléphone : [numéro]
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Protection des Données Personnelles</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), FoodPlanner s'engage à assurer la protection,
                la confidentialité et la sécurité des données personnelles de ses utilisateurs.
              </p>
              <p>
                Les utilisateurs disposent d'un droit d'accès, de rectification, de suppression et d'opposition aux données
                personnelles les concernant, qu'ils peuvent exercer en contactant : privacy@foodplanner.fr
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Propriété Intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, base de données, marques, etc.) est protégé par
                le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, est interdite sans
                autorisation préalable.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Cookies</h2>
              <p>
                FoodPlanner utilise des cookies pour améliorer l'expérience utilisateur. En utilisant notre site,
                vous acceptez l'utilisation des cookies conformément à notre politique de confidentialité.
              </p>
            </section>

            <div className="mt-12 text-center">
              <Link to="/" className="text-primary hover:text-primary/90 transition-colors">
                Retour à l'accueil
              </Link>
            </div>
          </motion.div>
        </article>
      </main>
    </div>
  );
};

export default Legal;
