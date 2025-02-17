
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Heart, Brain, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mission = () => {
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
              Notre Mission
            </h1>
            <p className="text-xl text-muted-foreground">
              Révolutionner la planification des repas pour une vie plus saine
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="prose prose-lg mx-auto text-muted-foreground"
          >
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Une alimentation saine accessible à tous</h2>
            <p>
              Chez FoodPlanner, nous croyons fermement que manger sainement ne devrait pas être un luxe ou un défi insurmontable. Notre mission est de démocratiser l'accès à une alimentation équilibrée en simplifiant la planification des repas pour tous.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-secondary/10 p-6 rounded-lg">
                <Leaf className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Alimentation Durable</h3>
                <p className="text-muted-foreground">
                  Nous encourageons des choix alimentaires durables et respectueux de l'environnement, tout en tenant compte de votre budget.
                </p>
              </div>
              <div className="bg-secondary/10 p-6 rounded-lg">
                <Heart className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Bien-être Personnel</h3>
                <p className="text-muted-foreground">
                  Chaque plan alimentaire est conçu pour répondre à vos besoins spécifiques en matière de santé et de nutrition.
                </p>
              </div>
              <div className="bg-secondary/10 p-6 rounded-lg">
                <Brain className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Intelligence Artificielle</h3>
                <p className="text-muted-foreground">
                  Notre technologie analyse vos préférences pour créer des plans de repas personnalisés et adaptés à votre mode de vie.
                </p>
              </div>
              <div className="bg-secondary/10 p-6 rounded-lg">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Communauté</h3>
                <p className="text-muted-foreground">
                  Rejoignez une communauté engagée partageant des conseils et des recettes pour une alimentation plus saine.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-foreground">Notre Vision pour l'Avenir</h2>
            <p>
              Nous aspirons à créer un monde où chacun a accès à une alimentation équilibrée et personnalisée. Notre plateforme combine expertise nutritionnelle et technologie de pointe pour rendre la planification des repas simple, efficace et adaptée à tous les modes de vie.
            </p>
            
            <div className="mt-12 text-center">
              <Link to="/">
                <Button size="lg" className="bg-primary hover:bg-primary/90 transition-colors">
                  Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </article>
      </main>
    </div>
  );
};

export default Mission;
