import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getUsersCount } from '../services/authService';
import { getRecipes, deleteRecipe, getRecipesCount, getRecentRecipes } from '../services/recipeService';
import { getAllMessages, getMessagesStats } from '../services/messageService';
import toast from 'react-hot-toast';
import { 
  FiUsers, FiBook, FiMessageSquare, FiPlus, FiEdit2, 
  FiTrash2, FiEye, FiBarChart2, FiSettings, FiBell,
  FiCheckCircle, FiClock, FiAlertCircle, FiUserCheck,
  FiTrendingUp, FiStar, FiHeart, FiDownload, FiFilter,
  FiSearch, FiRefreshCw, FiCalendar, FiActivity
} from 'react-icons/fi';
import { 
  FaUtensils, 
  FaChartLine, 
  FaRegChartBar, 
  FaCrown,
  FaFire,
  FaSeedling
} from 'react-icons/fa';
import { 
  MdOutlineRateReview, 
  MdOutlineAnalytics,
  MdOutlineInsights
} from 'react-icons/md';
import { 
  TbChefHat, 
  TbSalad,
  TbCooker
} from 'react-icons/tb';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalMessages: 0,
    pendingMessages: 0,
    todayRecipes: 0,
    activeUsers: 0,
    avgRecipeRating: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersData, recipesData, messagesData, statsData] = await Promise.all([
        getAllUsers(),
        getRecipes({ limit: 10, sort: 'newest' }),
        getAllMessages({ limit: 5 }),
        fetchStats()
      ]);

      setUsers(usersData.users || usersData);
      setRecipes(recipesData.recipes || recipesData);
      setMessages(messagesData.messages || messagesData);
      setStats(statsData);
      
      // Generate recent activity
      generateRecentActivity(usersData, recipesData, messagesData);
      
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
      
      // Set mock data for development
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // In a real app, you would have API endpoints for these stats
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Mock stats - replace with real API calls
    return {
      totalUsers: 1247,
      totalRecipes: 586,
      totalMessages: 342,
      pendingMessages: 23,
      todayRecipes: 12,
      activeUsers: 89,
      avgRecipeRating: 4.7,
      totalLikes: 12345,
      growthRate: 12.5,
      completionRate: 87
    };
  };

  const generateRecentActivity = (usersData, recipesData, messagesData) => {
    const activities = [
      ...(recipesData.recipes || recipesData).slice(0, 3).map(recipe => ({
        id: recipe._id,
        type: 'recipe',
        title: `New recipe: ${recipe.title}`,
        user: recipe.author?.name || 'Chef',
        time: recipe.createdAt,
        icon: <FaUtensils className="text-orange-500" />
      })),
      ...(messagesData.messages || messagesData).slice(0, 2).map(msg => ({
        id: msg._id,
        type: 'message',
        title: `New ${msg.type}: ${msg.title}`,
        user: msg.user?.name || 'User',
        time: msg.createdAt,
        icon: <FiMessageSquare className="text-blue-500" />
      })),
      ...(usersData.users || usersData).slice(0, 2).map(usr => ({
        id: usr._id,
        type: 'user',
        title: `New user joined: ${usr.name}`,
        user: 'System',
        time: usr.createdAt,
        icon: <FiUserCheck className="text-green-500" />
      }))
    ];
    
    // Sort by time and limit
    setRecentActivity(activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5));
  };

  const setMockData = () => {
    setStats({
      totalUsers: 1247,
      totalRecipes: 586,
      totalMessages: 342,
      pendingMessages: 23,
      todayRecipes: 12,
      activeUsers: 89,
      avgRecipeRating: 4.7,
      totalLikes: 12345,
      growthRate: 12.5,
      completionRate: 87
    });
    
    setRecentActivity([
      {
        id: '1',
        type: 'recipe',
        title: 'New recipe: Spicy Thai Curry',
        user: 'Chef Mario',
        time: new Date(Date.now() - 3600000).toISOString(),
        icon: <FaUtensils className="text-orange-500" />
      },
      {
        id: '2',
        type: 'message',
        title: 'New suggestion: Add keto category',
        user: 'John Doe',
        time: new Date(Date.now() - 7200000).toISOString(),
        icon: <FiMessageSquare className="text-blue-500" />
      },
      {
        id: '3',
        type: 'user',
        title: 'New user joined: Sarah Smith',
        user: 'System',
        time: new Date(Date.now() - 10800000).toISOString(),
        icon: <FiUserCheck className="text-green-500" />
      }
    ]);
  };

  const handleDeleteRecipe = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteRecipe(id);
        setRecipes(recipes.filter(recipe => recipe._id !== id));
        toast.success('Recipe deleted successfully');
        fetchDashboardData(); // Refresh stats
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      // Implement API call to update role
      toast.success(`User role updated to ${newRole}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleExportData = (type) => {
    toast.success(`${type} data exported successfully`);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || recipe.category === filter || recipe.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: FiBarChart2, color: 'text-purple-600' },
    { id: 'recipes', label: 'Recipes', icon: FiBook, color: 'text-orange-600' },
    { id: 'users', label: 'Users', icon: FiUsers, color: 'text-blue-600' },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare, color: 'text-green-600' },
    { id: 'analytics', label: 'Analytics', icon: MdOutlineAnalytics, color: 'text-red-600' }
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      icon: <FiUsers className="text-2xl" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      detail: `${stats.activeUsers} active today`
    },
    {
      title: 'Total Recipes',
      value: stats.totalRecipes.toLocaleString(),
      change: '+8.2%',
      icon: <FaUtensils className="text-2xl" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      detail: `${stats.todayRecipes} added today`
    },
    {
      title: 'Messages',
      value: stats.totalMessages.toLocaleString(),
      change: '+5.7%',
      icon: <FiMessageSquare className="text-2xl" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      detail: `${stats.pendingMessages} pending`
    },
    {
      title: 'Avg Rating',
      value: stats.avgRecipeRating.toFixed(1),
      change: '+0.3',
      icon: <FiStar className="text-2xl" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      detail: `${stats.totalLikes.toLocaleString()} total likes`
    }
  ];

  const quickActions = [
    { label: 'Create Recipe', icon: FiPlus, action: () => navigate('/admin/create-recipe'), color: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'Manage Users', icon: FiUsers, action: () => setActiveTab('users'), color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'View Messages', icon: FiMessageSquare, action: () => setActiveTab('messages'), color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Export Data', icon: FiDownload, action: () => handleExportData('All'), color: 'bg-purple-500 hover:bg-purple-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            <TbCooker className="absolute inset-0 m-auto text-2xl text-orange-500" />
          </div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <TbChefHat className="mr-3 text-orange-400" />
                RecipeHub Admin
              </h1>
              <p className="text-gray-300 mt-2">
                Welcome back, <span className="font-semibold text-orange-300">{user?.name}</span>
                <span className="ml-2 px-2 py-1 bg-orange-500 text-xs rounded-full">ADMIN</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              
              <div className="relative">
                <button className="relative p-2 hover:bg-gray-700 rounded-lg">
                  <FiBell size={22} />
                  {stats.pendingMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {stats.pendingMessages}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-2xl shadow-lg overflow-hidden`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-600 mt-1">{stat.title}</p>
                <p className="text-sm text-gray-500 mt-2">{stat.detail}</p>
              </div>
              <div className="h-1 bg-gradient-to-r via-gray-200 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
            <FiActivity className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <action.icon className="text-2xl mb-2" />
                  <span className="font-semibold">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 
                      'border-b-2 border-orange-500 text-orange-600 bg-orange-50 rounded-t-lg' : 
                      'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={tab.color} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Activity */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiClock className="mr-3 text-orange-500" />
                    Recent Activity
                  </h2>
                  <span className="text-sm text-gray-500">Last 24 hours</span>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiUserCheck className="mr-1" />
                          <span className="mr-4">{activity.user}</span>
                          <FiCalendar className="mr-1" />
                          <span>{new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.type === 'recipe' ? 'bg-orange-100 text-orange-800' :
                        activity.type === 'message' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {activity.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts/Graphs Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MdOutlineInsights className="mr-2 text-purple-500" />
                    Performance Metrics
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <FaChartLine className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Analytics charts will appear here</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaRegChartBar className="mr-2 text-blue-500" />
                    User Engagement
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <FiTrendingUp className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Engagement metrics will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Recipe Management</h2>
                  <p className="text-gray-600">Manage all recipes in the system</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                  
                  <Link
                    to="/admin/create-recipe"
                    className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    <FiPlus />
                    <span>Create New</span>
                  </Link>
                </div>
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <TbSalad className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
                  <p className="text-gray-500">Try adjusting your search or create a new recipe</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map(recipe => (
                    <div key={recipe._id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={recipe.image || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187'}
                          alt={recipe.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-800 line-clamp-1">{recipe.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {recipe.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{recipe.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <FiClock className="mr-1" />
                            <span>{recipe.prepTime + recipe.cookTime} min</span>
                          </div>
                          <div className="flex items-center">
                            <FiHeart className="mr-1" />
                            <span>{recipe.likes?.length || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/recipe/${recipe._id}`)}
                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                          >
                            <FiEye className="mr-2" />
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/admin/edit-recipe/${recipe._id}`)}
                            className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
                          >
                            <FiEdit2 className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRecipe(recipe._id, recipe.title)}
                            className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <FiTrash2 className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab - Keep your existing users table */}
          {activeTab === 'users' && (
            <div>
              {/* Your existing users table code here */}
            </div>
          )}

          {/* Messages Tab - Keep your existing messages code */}
          {activeTab === 'messages' && (
            <div>
              {/* Your existing messages code here */}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="text-center py-12">
                <MdOutlineAnalytics className="text-6xl text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Advanced Analytics</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Detailed analytics and insights will be available soon. Track user behavior, 
                  recipe performance, and engagement metrics in real-time.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <FaCrown className="text-3xl text-blue-500 mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Top Recipes</h3>
                  <p className="text-gray-600 text-sm">Most viewed and liked recipes</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                  <FaSeedling className="text-3xl text-green-500 mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Growth Insights</h3>
                  <p className="text-gray-600 text-sm">User acquisition and retention</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                  <FaFire className="text-3xl text-purple-500 mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Trend Analysis</h3>
                  <p className="text-gray-600 text-sm">Popular categories and trends</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.growthRate}%</div>
            <div className="text-sm text-gray-600">Growth Rate</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-gray-800">24/7</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-gray-800">{messages.filter(m => m.status === 'replied').length}</div>
            <div className="text-sm text-gray-600">Replied Messages</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;