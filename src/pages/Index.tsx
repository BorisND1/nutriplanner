import React from 'react';
import { Calendar, User, Bell, ListChecks } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ProfileForm } from '@/components/ProfileForm';
import { NotificationPermission } from '@/components/NotificationPermission';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 text-primary font-semibold">FoodPlanner</div>
            <div className="hidden md:flex space-x-8">
              <Link to="/mission" className="text-foreground/80 hover:text-foreground transition-colors">Notre Mission</Link>
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Fonctionnalités</a>
              <a href="#form" className="text-foreground/80 hover:text-foreground transition-colors">Programme</a>
              <a href="#profile" className="text-foreground/80 hover:text-foreground transition-colors">Profil</a>
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
        <section className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Planifiez vos repas en toute simplicité
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Atteignez vos objectifs alimentaires avec un planificateur intelligent qui s'adapte à vos besoins, allergies et budget.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-colors">
                Essayer gratuitement
              </Button>
              <Button size="lg" variant="outline">
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-24 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <Calendar className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Planification hebdomadaire</h3>
                <p className="text-muted-foreground">Organisez vos repas à l'avance pour une semaine équilibrée.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <User className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Profil personnalisé</h3>
                <p className="text-muted-foreground">Adaptez vos repas à vos préférences et restrictions alimentaires.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <Bell className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rappels intelligents</h3>
                <p className="text-muted-foreground">Recevez des notifications pour préparer vos repas à temps.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <ListChecks className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Listes de courses</h3>
                <p className="text-muted-foreground">Générez automatiquement vos listes d'ingrédients.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="form" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                Créez votre programme personnalisé
              </h2>
              <p className="text-lg text-muted-foreground">
                Remplissez le formulaire ci-dessous pour obtenir un programme adapté à vos besoins
              </p>
            </div>
            <ProfileForm />
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FoodPlanner</h3>
              <p className="text-sm text-muted-foreground">
                Votre assistant personnel pour une alimentation saine et équilibrée.
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
