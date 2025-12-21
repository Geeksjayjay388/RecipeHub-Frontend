import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStarredRecipes, updateProfile } from '../services/authService';
import toast from 'react-hot-toast';
import { 
  FiUser, FiMail, FiEdit2, FiSave, FiX, FiStar, 
  FiClock, FiBookmark, FiSettings, FiLogOut 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [starredRecipes, setStarredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    fetchStarredRecipes();
  }, []);

  const fetchStarredRecipes = async () => {
    try {
      setLoading(true);
      const data = await getStarredRecipes();
      setStarredRecipes(data);
    } catch (error) {
      toast.error('Failed to load starred recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <img
                  src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=ff6b35&color=fff&size=128`}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg"
                />
                {editing && (
                  <button className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full">
                    <FiEdit2 />
                  </button>
                )}
              </div>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-gray-800 text-center border-b border-gray-300 focus:outline-none focus:border-orange-500"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              )}
              <div className="flex items-center justify-center mt-2">
                <FiMail className="text-gray-400 mr-2" />
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-gray-600 text-center border-b border-gray-300 focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <span className="text-gray-600">{user?.email}</span>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Member since</span>
                <span className="font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Role</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Starred Recipes</span>
                <span className="font-semibold">{starredRecipes.length}</span>
              </div>
            </div>

            <div className="space-y-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    <FiSave />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        avatar: user?.avatar || ''
                      });
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    <FiX />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    <FiEdit2 />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Starred Recipes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FiBookmark className="mr-2" />
                Starred Recipes
              </h2>
              <span className="text-gray-600">
                {starredRecipes.length} recipes
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            ) : starredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <FiStar className="text-4xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No starred recipes</h3>
                <p className="text-gray-500 mb-6">Star recipes you love to find them here later</p>
                <Link
                  to="/recipes"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Browse Recipes
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {starredRecipes.map(recipe => (
                  <Link
                    key={recipe._id}
                    to={`/recipe/${recipe._id}`}
                    className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={recipe.image || 'https://via.placeholder.com/80'}
                        alt={recipe.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {recipe.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>{recipe.prepTime + recipe.cookTime} min</span>
                          </div>
                          <div className="flex items-center text-sm text-yellow-500">
                            <FiStar className="mr-1" />
                            <span>{recipe.averageRating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-4">
                  <FiStar />
                </div>
                <div>
                  <p className="font-semibold">Starred a new recipe</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-4">
                  <FiUser />
                </div>
                <div>
                  <p className="font-semibold">Updated profile information</p>
                  <p className="text-sm text-gray-600">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mr-4">
                  <FiSettings />
                </div>
                <div>
                  <p className="font-semibold">Changed account settings</p>
                  <p className="text-sm text-gray-600">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;