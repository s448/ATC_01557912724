
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/getstarted');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <span className="text-2xl font-bold text-primary">Event Horizon</span>
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/login">
            <Button variant="outline" className="mr-2">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </motion.div>
      </header>

      <main className="flex-grow grid md:grid-cols-2 container mx-auto px-4">
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Discover Amazing Events
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Find and book the best events happening near you. From concerts to conferences, 
            we've got you covered with a seamless booking experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-8 py-6 text-lg rounded-lg shadow-lg flex items-center gap-2">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/getstarted">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-lg border-2">
                  Browse Events
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-12 grid grid-cols-3 gap-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">500+</h3>
              <p className="text-gray-600 dark:text-gray-300">Events</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">10k+</h3>
              <p className="text-gray-600 dark:text-gray-300">Users</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">50+</h3>
              <p className="text-gray-600 dark:text-gray-300">Cities</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hidden md:flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-full max-w-lg">
            {/* Floating decoration elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            
            {/* Content */}
            <div className="relative">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3" 
                  alt="Tech event" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold">Tech Conference 2023</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Learn about the latest advancements in technology</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-24 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-48 transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3" 
                  alt="Music event" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-bold">Summer Music Festival</h3>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-48 transform rotate-6 hover:rotate-0 transition-transform duration-300"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3" 
                  alt="Food event" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-bold">Food & Wine Festival</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="container mx-auto py-6 px-4">
        <motion.p 
          className="text-center text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          © {new Date().getFullYear()} Event Horizon. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
};

export default LandingPage;
