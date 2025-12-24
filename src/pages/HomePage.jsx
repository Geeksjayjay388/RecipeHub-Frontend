import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import RecipeGrid from '../components/recipes/RecipeGrid';
import { useRecipe } from '../context/RecipeContext';
import { GiChefToque, GiKnifeFork, GiFruitBowl, GiCookingPot } from 'react-icons/gi';
import { FiClock, FiStar, FiUsers, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { FaFire, FaLeaf, FaHeartbeat, FaRegSmileBeam } from 'react-icons/fa';
import { TbChefHat } from 'react-icons/tb';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { recipes, fetchRecipes } = useRecipe();
  const [isLoaded, setIsLoaded] = useState(false);
  const recipesRef = useRef(null);

  useEffect(() => {
    fetchRecipes({ limit: 8 });
    setIsLoaded(true);
  }, []);

  const featuredRecipes = recipes.slice(0, 4);

  const scrollToRecipes = (e) => {
    e.preventDefault();
    recipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="relative">
      {/* Hero Section - FIXED: Removed overflow-x-hidden from main, added proper full-width wrapper */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Full Width Background Container - FIXED: Changed approach */}
        <div className="absolute inset-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          
          {/* Animated Food Icons Floating */}
          <div className="absolute inset-0 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                  y: [null, typeof window !== 'undefined' ? window.innerHeight + 100 : 900],
                  opacity: [0, 0.1, 0]
                }}
                transition={{
                  duration: 20 + i * 3,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear"
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  fontSize: '3rem'
                }}
              >
                {i % 3 === 0 ? <GiKnifeFork /> : i % 3 === 1 ? <GiFruitBowl /> : <GiCookingPot />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="w-full relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                >
                  <TbChefHat className="text-orange-400" />
                  <span className="text-sm font-medium">Welcome to RecipeHub</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                >
                  <span className="text-orange-400">Savor</span> Every<br />
                  <span className="text-white">Bite, Master</span><br />
                  <span className="text-orange-400">Every Recipe</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed px-4"
                >
                  Join <span className="text-orange-300 font-semibold">10,000+</span> passionate home chefs 
                  exploring world-class recipes. From quick weekday meals to gourmet feasts.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={scrollToRecipes}
                      className="inline-flex items-center justify-center px-8 py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 group shadow-lg"
                    >
                      <span className="text-base md:text-lg">Explore Recipes</span>
                      <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-8 py-3.5 md:px-10 md:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg"
                    >
                      <span className="text-base md:text-lg">Start Cooking Free</span>
                    </Link>
                  </motion.div>
                </motion.div>
                
                {/* Stats Overlay */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block max-w-md mx-auto shadow-lg border border-white/10"
                >
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
                      <div className="text-xs md:text-sm text-gray-300">Recipes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">4.8★</div>
                      <div className="text-xs md:text-sm text-gray-300">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">15min</div>
                      <div className="text-xs md:text-sm text-gray-300">Avg Time</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-20 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={scrollToRecipes}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 text-gray-300">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-16 md:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6"
              >
                <FaLeaf className="w-4 h-4" />
                <span className="text-sm font-semibold">Why Choose RecipeHub</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8">
                Cook Smarter,<br />
                <span className="text-orange-500">Live Healthier</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Our platform combines professional techniques with home-cooking simplicity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {[
                {
                  icon: <GiChefToque className="text-4xl md:text-5xl" />,
                  title: "Pro Techniques",
                  description: "Learn from professional chefs",
                  color: "from-blue-500 to-cyan-500",
                  bg: "bg-blue-50"
                },
                {
                  icon: <FiClock className="text-4xl md:text-5xl" />,
                  title: "Time-Saving",
                  description: "Quick & easy recipes",
                  color: "from-green-500 to-emerald-500",
                  bg: "bg-green-50"
                },
                {
                  icon: <FaHeartbeat className="text-4xl md:text-5xl" />,
                  title: "Healthy Options",
                  description: "Nutritious meal plans",
                  color: "from-purple-500 to-pink-500",
                  bg: "bg-purple-50"
                },
                {
                  icon: <FaRegSmileBeam className="text-4xl md:text-5xl" />,
                  title: "Beginner Friendly",
                  description: "Step-by-step guides",
                  color: "from-orange-500 to-red-500",
                  bg: "bg-orange-50"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className={`${feature.bg} rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-3xl transition-all duration-300`}
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center text-base md:text-lg">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full mb-6"
              >
                <FaFire className="w-4 h-4" />
                <span className="text-sm font-semibold">Trending Now</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Featured <span className="text-orange-500">Recipes</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Discover the most popular recipes loved by our community
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-8 md:mt-0"
            >
              <Link 
                to="/recipes"
                className="inline-flex items-center space-x-3 text-orange-500 hover:text-orange-600 font-bold text-lg group"
              >
                <span>View All Recipes</span>
                <FiArrowRight className="group-hover:translate-x-3 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link to={`/recipe/${recipe._id}`}>
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-3xl transition-all duration-300 border border-gray-200 h-full flex flex-col">
                      {/* Recipe Image */}
                      <div className="relative h-56 md:h-64 overflow-hidden">
                        <img
                          src={recipe.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 text-sm font-bold rounded-xl ${
                            recipe.difficulty === 'Easy' ? 'bg-green-500' :
                            recipe.difficulty === 'Medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          } text-white shadow-lg`}>
                            {recipe.difficulty || 'Easy'}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent"></div>
                        
                        {/* Category */}
                        <div className="absolute bottom-4 left-4">
                          <span className="text-sm font-semibold text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                            {recipe.category || 'Main Course'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Recipe Info */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-3 line-clamp-2">
                          {recipe.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                          {recipe.description || 'Delicious recipe with fresh ingredients'}
                        </p>
                        
                        {/* Recipe Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-2" />
                            <span>{recipe.prepTime + recipe.cookTime || 30} min</span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="w-4 h-4 mr-2" />
                            <span>{recipe.servings || 4} servings</span>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <FiStar className="w-4 h-4 fill-current" />
                            <span className="ml-1 font-semibold">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-20">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <GiCookingPot className="text-5xl md:text-6xl text-orange-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">No recipes available yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">Be the first to share your culinary masterpiece!</p>
              <Link 
                to="/add-recipe"
                className="inline-flex items-center space-x-3 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 group"
              >
                <span>Add Your Recipe</span>
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section - Full Width */}
      <section className="relative py-20 md:py-28">
        {/* FIXED: Better full-width implementation */}
        <div className="absolute inset-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 md:w-[40rem] md:h-[40rem] bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 md:w-[40rem] md:h-[40rem] bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
                RecipeHub <span className="text-orange-400">In Numbers</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Join our growing community of passionate home chefs
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: <GiChefToque />, value: "500+", label: "Recipes", color: "text-blue-400", change: "+24%", trending: true },
                { icon: <FiUsers />, value: "10K+", label: "Community", color: "text-green-400", change: "+18%", trending: true },
                { icon: <FiClock />, value: "15-30", label: "Avg Cook Time", color: "text-orange-400", change: "Fast", trending: false },
                { icon: <FiStar />, value: "4.8", label: "Avg Rating", color: "text-yellow-400", change: "+0.2", trending: true }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-10 text-center hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${stat.color} bg-white/10 flex items-center justify-center mx-auto mb-6 md:mb-8`}>
                    <div className="text-2xl md:text-3xl">{stat.icon}</div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3">{stat.value}</div>
                  <div className="text-gray-300 text-base md:text-lg mb-3 md:mb-4">{stat.label}</div>
                  <div className={`inline-flex items-center space-x-2 text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 rounded-full ${
                    stat.trending ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    <FiTrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{stat.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Recipes Section */}
      <section ref={recipesRef} className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6"
            >
              <FaFire className="w-4 h-4" />
              <span className="text-sm font-semibold">Hot This Week</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8">
              Trending <span className="text-orange-500">Recipes</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Discover what our community is cooking right now
            </p>
          </div>

          {/* Main Recipe Grid */}
          <RecipeGrid />
        </div>
      </section>

      {/* Final CTA Section - Full Width */}
      <section className="relative">
        {/* FIXED: Better full-width implementation */}
        <div className="absolute inset-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 via-orange-500/80 to-orange-600/90"></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
                  Ready to Start Your<br />
                  <span className="text-yellow-300">Culinary Journey?</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-200 mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto">
                  Join thousands of home chefs transforming their cooking skills. 
                  It's free, fun, and delicious!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center mb-12 md:mb-16">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-8 py-4 md:px-12 md:py-5 bg-white text-orange-600 rounded-xl font-bold hover:shadow-3xl transition-all duration-300 group shadow-xl w-full sm:w-auto text-lg md:text-xl"
                    >
                      <span>Get Started Free</span>
                      <FiArrowRight className="ml-3 group-hover:translate-x-3 transition-transform duration-300 w-6 h-6 md:w-7 md:h-7" />
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/recipes"
                      className="inline-flex items-center justify-center px-8 py-4 md:px-12 md:py-5 bg-transparent border-3 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-lg md:text-xl shadow-xl"
                    >
                      <span>Browse Recipes</span>
                    </Link>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Free</div>
                    <div className="text-base text-gray-300">No credit card needed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">24/7</div>
                    <div className="text-base text-gray-300">Access anytime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Community</div>
                    <div className="text-base text-gray-300">10K+ members</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;