import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStarredRecipes, updateProfile, getUserProfile, getUserStats } from '../services/authService';
import toast from 'react-hot-toast';
import { 
  FiUser, FiMail, FiEdit2, FiSave, FiX, FiStar, 
  FiClock, FiBookmark, FiSettings, FiLogOut, 
  FiCalendar, FiUsers, FiActivity, FiTrendingUp, FiPlus,
  FiArrowRight, FiGrid, FiMessageSquare, FiEye
} from 'react-icons/fi';
import { TbChefHat, TbStarFilled } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [starredRecipes, setStarredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    location: ''
  });

  const [userStats, setUserStats] = useState({
    totalRecipesCreated: 0,
    totalReviews: 0,
    weeklyActivity: 0,
    recipesViewed: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchStarredRecipes();
      fetchUserStats();
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || ''
      });
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const profileData = await getUserProfile();
      setUserProfile(profileData);
    } catch (error) {
      console.warn('Could not fetch user profile:', error.message);
      // Fallback to user from context
      setUserProfile(user);
    }
  };

  const fetchStarredRecipes = async () => {
    try {
      setLoading(true);
      const data = await getStarredRecipes();
      if (data && Array.isArray(data)) {
        setStarredRecipes(data);
      } else if (data && data.recipes && Array.isArray(data.recipes)) {
        setStarredRecipes(data.recipes);
      } else if (data && data.starredRecipes && Array.isArray(data.starredRecipes)) {
        setStarredRecipes(data.starredRecipes);
      } else {
        console.log('No starred recipes data structure found, using empty array');
        setStarredRecipes([]);
      }
    } catch (error) {
      console.warn('Could not fetch starred recipes:', error.message);
      setStarredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      const stats = await getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.warn('Could not fetch user stats:', error.message);
      // Set default stats
      setUserStats({
        totalRecipesCreated: 0,
        totalReviews: 0,
        weeklyActivity: 0,
        recipesViewed: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setUserProfile(updatedUser);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getAvatarUrl = () => {
    if (formData.avatar && formData.avatar.trim() !== '') {
      return formData.avatar;
    }
    if (user?.avatar && user.avatar.trim() !== '') {
      return user.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || user?.name || 'User')}&background=ff6b35&color=fff&size=256&bold=true`;
  };

  // Calculate member duration with proper date handling
  const getMemberDuration = () => {
    // Try to get createdAt from userProfile first, then fallback to user context
    const createdAt = userProfile?.createdAt || user?.createdAt;
    
    if (!createdAt) return 'N/A';
    
    try {
      const joinDate = new Date(createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - joinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months !== 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years !== 1 ? 's' : ''}`;
      }
    } catch (error) {
      console.error('Error calculating member duration:', error);
      return 'N/A';
    }
  };

  // Get formatted join date
  const getJoinDate = () => {
    const createdAt = userProfile?.createdAt || user?.createdAt;
    
    if (!createdAt) return 'N/A';
    
    try {
      const joinDate = new Date(createdAt);
      return joinDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting join date:', error);
      return 'N/A';
    }
  };

  // Generate recent activity from user data
  const generateRecentActivity = () => {
    const activities = [];
    const createdAt = userProfile?.createdAt || user?.createdAt;
    
    // Add join activity
    if (createdAt) {
      activities.push({
        id: 1,
        title: 'Joined RecipeHub',
        time: `${getJoinDate()} • ${getMemberDuration()} ago`,
        icon: <FiUser />,
        color: 'blue'
      });
    }
    
    if (starredRecipes.length > 0) {
      activities.push({
        id: 2,
        title: `Starred ${starredRecipes.length} recipes`,
        time: 'Recently',
        icon: <FiStar />,
        color: 'yellow'
      });
    }
    
    const lastLogin = userProfile?.lastLogin || user?.lastLogin;
    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin);
      const timeAgo = Math.floor((Date.now() - lastLoginDate) / (1000 * 60 * 60));
      activities.push({
        id: 3,
        title: 'Last login',
        time: timeAgo < 1 ? 'Just now' : 
              timeAgo < 24 ? `${timeAgo} hour${timeAgo !== 1 ? 's' : ''} ago` : 
              `${Math.floor(timeAgo / 24)} day${Math.floor(timeAgo / 24) !== 1 ? 's' : ''} ago`,
        icon: <FiActivity />,
        color: 'green'
      });
    }
    
    return activities;
  };

  const recentActivity = generateRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">My Profile</h1>
          <p className="text-lg text-gray-600">Manage your account, recipes, and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100"
            >
              <div className="text-center mb-6">
                <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 mx-auto relative">
                    <img
                      src={getAvatarUrl()}
                      alt={formData.name || user?.name || 'User'}
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || user?.name || 'User')}&background=ff6b35&color=fff&size=256`;
                      }}
                    />
                    {editing && (
                      <button 
                        className="absolute bottom-3 right-3 bg-gradient-to-br from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                        onClick={() => {
                          const newAvatar = prompt('Enter avatar URL:', formData.avatar);
                          if (newAvatar !== null) {
                            setFormData({...formData, avatar: newAvatar});
                          }
                        }}
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {editing ? (
                    <div className="mt-4 space-y-3">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-2xl font-bold text-gray-800 text-center border-b-2 border-gray-300 focus:outline-none focus:border-orange-500 px-2 py-1 w-full"
                        placeholder="Your Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="text-gray-600 text-center border-b-2 border-gray-300 focus:outline-none focus:border-orange-500 px-2 py-1 w-full"
                        placeholder="your@email.com"
                      />
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="text-gray-600 text-center border-b-2 border-gray-300 focus:outline-none focus:border-orange-500 px-2 py-1 w-full resize-none"
                        placeholder="Add a short bio"
                        rows="2"
                      />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="text-gray-600 text-center border-b-2 border-gray-300 focus:outline-none focus:border-orange-500 px-2 py-1 w-full"
                        placeholder="Location"
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h2 className="text-3xl font-bold text-gray-800 mb-1">{user?.name}</h2>
                      <div className="flex items-center justify-center text-gray-600 mb-3">
                        <FiMail className="mr-2" />
                        <span>{user?.email}</span>
                      </div>
                      {user?.bio && (
                        <p className="text-gray-700 italic mt-3 px-4">"{user.bio}"</p>
                      )}
                      {user?.location && (
                        <div className="flex items-center justify-center text-gray-500 mt-2">
                          <FiUsers className="mr-1" />
                          <span>{user.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <FiCalendar className="mr-2" />
                      Joined
                    </span>
                    <span className="font-semibold text-gray-800">
                      {getJoinDate()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <FiClock className="mr-2" />
                      Member for
                    </span>
                    <span className="font-semibold text-gray-800">
                      {getMemberDuration()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Role</span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      user?.role === 'admin' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800'
                    }`}>
                      {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 flex items-center">
                      <TbStarFilled className="mr-2 text-yellow-500" />
                      Starred Recipes
                    </span>
                    <span className="font-bold text-2xl text-gray-800">{starredRecipes.length}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {editing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="w-full flex items-center justify-center space-x-3 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        <FiSave className="w-5 h-5" />
                        <span>Save Changes</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            avatar: user?.avatar || '',
                            bio: user?.bio || '',
                            location: user?.location || ''
                          });
                        }}
                        className="w-full flex items-center justify-center space-x-3 py-3.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-all"
                      >
                        <FiX className="w-5 h-5" />
                        <span>Cancel</span>
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEditing(true)}
                        className="w-full flex items-center justify-center space-x-3 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        <FiEdit2 className="w-5 h-5" />
                        <span>Edit Profile</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-3 py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiActivity className="mr-3 text-orange-500" />
                Your Stats
              </h3>
              {statsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {[
                    { 
                      label: 'Recipes Created', 
                      value: userStats.totalRecipesCreated, 
                      icon: <TbChefHat className="w-5 h-5" />,
                      color: 'from-blue-500 to-cyan-500'
                    },
                    { 
                      label: 'Reviews', 
                      value: userStats.totalReviews, 
                      icon: <FiMessageSquare className="w-5 h-5" />,
                      color: 'from-green-500 to-emerald-500'
                    },
                    { 
                      label: 'Recipes Viewed', 
                      value: userStats.recipesViewed, 
                      icon: <FiEye className="w-5 h-5" />,
                      color: 'from-yellow-500 to-orange-500'
                    },
                    { 
                      label: 'Weekly Activity', 
                      value: userStats.weeklyActivity, 
                      icon: <FiTrendingUp className="w-5 h-5" />,
                      color: 'from-purple-500 to-pink-500'
                    }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                          <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Starred Recipes & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Starred Recipes Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FiBookmark className="mr-3 text-orange-500" />
                    Starred Recipes
                  </h2>
                  <p className="text-gray-600 mt-1">Your favorite recipes saved for later</p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full">
                  <span className="text-orange-800 font-bold">{starredRecipes.length} {starredRecipes.length === 1 ? 'recipe' : 'recipes'}</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your starred recipes...</p>
                </div>
              ) : starredRecipes.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full flex items-center justify-center">
                    <FiStar className="text-5xl text-orange-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">No starred recipes yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Star recipes you love to find them here later. Explore our collection and save your favorites!
                  </p>
                  <Link
                    to="/recipes"
                    className="inline-flex items-center space-x-3 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all group"
                  >
                    <span>Explore Recipes</span>
                    <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {starredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Link
                        to={`/recipe/${recipe._id}`}
                        className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 border border-gray-100 block"
                      >
                        <div className="flex items-start space-x-5">
                          <div className="relative flex-shrink-0">
                            <img
                              src={recipe.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                              alt={recipe.title}
                              className="w-24 h-24 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-1.5 rounded-full shadow-lg">
                              <TbStarFilled className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
                              {recipe.title || 'Untitled Recipe'}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {recipe.description || 'A delicious recipe waiting for you to try'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <FiClock className="mr-2" />
                                <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0) || 30} min</span>
                              </div>
                              <div className="flex items-center text-sm font-bold text-orange-600">
                                <FiStar className="mr-1 fill-current" />
                                <span>{recipe.averageRating?.toFixed(1) || '4.8'}</span>
                              </div>
                            </div>
                            {recipe.category && (
                              <div className="mt-3">
                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 text-xs font-semibold rounded-full">
                                  {recipe.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Activity Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <FiActivity className="mr-3 text-orange-500" />
                Recent Activity
              </h2>
              
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <FiActivity className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity to show</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className={`flex items-center p-5 rounded-2xl bg-gradient-to-r ${
                        activity.color === 'yellow' ? 'from-yellow-50 to-amber-50' :
                        activity.color === 'blue' ? 'from-blue-50 to-cyan-50' :
                        activity.color === 'green' ? 'from-green-50 to-emerald-50' :
                        'from-orange-50 to-red-50'
                      } hover:shadow-lg transition-all duration-300`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-md ${
                        activity.color === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-orange-400' :
                        activity.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                        activity.color === 'green' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                        'bg-gradient-to-br from-orange-500 to-red-500'
                      }`}>
                        <div className="text-white text-xl">
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;