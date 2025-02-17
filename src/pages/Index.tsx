
import React from 'react';
import { Calendar, User, Bell, ListChecks, Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ProfileForm } from '@/components/ProfileForm';
import { NotificationPermission } from '@/components/NotificationPermission';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold tracking-wide">FoodPlanner</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/mission" className="text-foreground/80 hover:text-foreground transition-colors">Notre Mission</Link>
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Fonctionnalités</a>
              <a href="#form" className="text-foreground/80 hover:text-foreground transition-colors">Programme</a>
            </div>
            <div className="flex items-center gap-4">
              <NotificationPermission />
              <Button variant="default" className="bg-primary hover:bg-primary/90 transition-colors">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-32 pb-24 px-4 bg-gradient-to-b from-secondary/50 to-background">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Une alimentation saine et équilibrée
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Découvrez votre programme nutritionnel personnalisé et atteignez vos objectifs de santé naturellement.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-colors">
                Créer mon programme
              </Button>
              <Button size="lg" variant="outline">
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <Calendar className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-lg font-semibold mb-3">Programme sur mesure</h3>
                <p className="text-muted-foreground">Un plan alimentaire adapté à votre mode de vie.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <User className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-lg font-semibold mb-3">Profil personnalisé</h3>
                <p className="text-muted-foreground">Suivi de vos préférences et objectifs.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <Bell className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-lg font-semibold mb-3">Rappels personnalisés</h3>
                <p className="text-muted-foreground">Notifications adaptées à votre rythme.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <ListChecks className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-lg font-semibold mb-3">Liste de courses</h3>
                <p className="text-muted-foreground">Génération automatique des ingrédients.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="form" className="py-24 px-4 bg-secondary/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                Votre programme personnalisé
              </h2>
              <p className="text-lg text-muted-foreground">
                Commencez votre parcours vers une meilleure santé
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <ProfileForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">FoodPlanner</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Votre guide vers une alimentation saine et équilibrée.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/mission" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Notre Mission
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Mentions Légales
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: contact@foodplanner.fr<br />
                Suivez-nous sur les réseaux sociaux
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FoodPlanner. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
