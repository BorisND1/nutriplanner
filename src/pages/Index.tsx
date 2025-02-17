
import React from 'react';
import { Calendar, User, Bell, ListChecks, Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ProfileForm } from '@/components/ProfileForm';
import { NotificationPermission } from '@/components/NotificationPermission';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden transition-colors">
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10 dark:opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
            alt="Fruits"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-1/4 -right-16 w-48 h-48 rounded-full opacity-10 dark:opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" 
            alt="Légumes"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute bottom-1/4 -left-12 w-40 h-40 rounded-full opacity-10 dark:opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1501286353178-1ec881214838" 
            alt="Noix"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      <nav className="border-b glass-light dark:glass-dark fixed w-full z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold tracking-wide">NutriPlanner</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/mission" className="text-foreground/80 hover:text-foreground transition-colors">Notre Mission</Link>
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Fonctionnalités</a>
              <a href="#form" className="text-foreground/80 hover:text-foreground transition-colors">Programme</a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <NotificationPermission />
              <Button variant="default" className="bg-primary hover:bg-primary/90 transition-colors">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-32 pb-24 px-4 bg-gradient-to-b from-secondary/50 to-background relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-primary/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/5 rounded-full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto relative"
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

        <section id="features" className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent opacity-50" />
          <div className="max-w-6xl mx-auto relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-light dark:glass-dark p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
                className="glass-light dark:glass-dark p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
                className="glass-light dark:glass-dark p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
                className="glass-light dark:glass-dark p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <ListChecks className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-lg font-semibold mb-3">Liste de courses</h3>
                <p className="text-muted-foreground">Génération automatique des ingrédients.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="form" className="py-24 px-4 bg-secondary/20 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                Votre programme personnalisé
              </h2>
              <p className="text-lg text-muted-foreground">
                Commencez votre parcours vers une meilleure santé
              </p>
            </div>
            <div className="glass-light dark:glass-dark p-8 rounded-2xl shadow-sm relative">
              <ProfileForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="glass-light dark:glass-dark border-t py-12 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">NutriPlanner</h3>
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
                Email: contact@nutriplanner.net<br />
                Suivez-nous sur les réseaux sociaux
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NutriPlanner. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
