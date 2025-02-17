
import React from 'react';
import { Calendar, User, Bell, ListChecks, Apple, Clock, ChefHat } from 'lucide-react';
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
            <div className="flex items-center gap-2">
              <Apple className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold">FoodPlanner</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/mission" className="text-foreground/80 hover:text-foreground transition-colors">Notre Mission</Link>
              <a href="#dashboard" className="text-foreground/80 hover:text-foreground transition-colors">Tableau de bord</a>
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

      <main className="pt-16">
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/50 to-background">
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
              Atteignez vos objectifs alimentaires avec un planificateur intelligent qui s'adapte à vos besoins.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 transition-colors">
                Essayer gratuitement
              </Button>
              <Button size="lg" variant="outline">
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </section>

        <section id="dashboard" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                Votre tableau de bord nutritionnel
              </h2>
              <p className="text-lg text-muted-foreground">
                Suivez votre programme alimentaire en un coup d'œil
              </p>
            </div>
            
            <div className="dashboard-grid">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Prochain repas</h3>
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold mb-2">12:30</p>
                <p className="text-muted-foreground">Déjeuner équilibré</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Programme du jour</h3>
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="w-16 text-sm text-muted-foreground">08:00</span>
                    <span className="flex-1">Petit-déjeuner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-16 text-sm text-muted-foreground">12:30</span>
                    <span className="flex-1">Déjeuner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-16 text-sm text-muted-foreground">16:00</span>
                    <span className="flex-1">Collation</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Préparation</h3>
                  <ChefHat className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">Ingrédients à préparer :</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary/20"></span>
                    <span>Légumes frais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary/20"></span>
                    <span>Protéines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary/20"></span>
                    <span>Féculents</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="form" className="py-16 px-4 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                Créez votre programme personnalisé
              </h2>
              <p className="text-lg text-muted-foreground">
                Remplissez le formulaire ci-dessous pour obtenir un programme adapté à vos besoins
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <ProfileForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Apple className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">FoodPlanner</h3>
              </div>
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
                  <a href="#dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Tableau de bord
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
