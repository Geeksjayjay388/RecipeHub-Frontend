import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../hooks/useMessages';
import toast from 'react-hot-toast';
import { 
  FiMessageSquare, FiMail, FiUser, FiImage, FiSend, 
  FiCheckCircle, FiHelpCircle, FiAlertCircle 
} from 'react-icons/fi';

const ContactPage = () => {
  const { user } = useAuth();
  const { sendNewMessage } = useMessages();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'suggestion',
    title: '',
    content: '',
    image: ''
  });

  const messageTypes = [
    { value: 'suggestion', label: 'Recipe Suggestion', icon: FiCheckCircle, color: 'bg-green-500' },
    { value: 'feedback', label: 'Feedback', icon: FiHelpCircle, color: 'bg-blue-500' },
    { value: 'review', label: 'Review', icon: FiMessageSquare, color: 'bg-purple-500' },
    { value: 'question', label: 'Question', icon: FiAlertCircle, color: 'bg-orange-500' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send messages');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await sendNewMessage(formData);
      setFormData({
        type: 'suggestion',
        title: '',
        content: '',
        image: ''
      });
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
          <FiMessageSquare className="text-4xl text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">
          Have suggestions, feedback, or questions? We'd love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Message Types</h3>
                <div className="space-y-3">
                  {messageTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${formData.type === type.value ? 'bg-gray-100 border-2 border-orange-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => setFormData({ ...formData, type: type.value })}
                      >
                        <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                          <Icon />
                        </div>
                        <span className="font-medium">{type.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-3" />
                    <span>support@recipehub.com</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-3" />
                    <span>Response time: 24-48 hours</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Sending as</h3>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=ff6b35&color=fff`}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{user?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-600">{user?.email || 'Please login to send messages'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Your Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message Type Display */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {(() => {
                    const typeInfo = messageTypes.find(t => t.value === formData.type);
                    const Icon = typeInfo?.icon;
                    return (
                      <>
                        <div className={`w-12 h-12 ${typeInfo?.color} rounded-lg flex items-center justify-center text-white mr-4`}>
                          <Icon />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sending as</p>
                          <p className="text-lg font-semibold">{typeInfo?.label}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="What is this regarding?"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-700 mb-2">Message *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Please provide detailed information..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-gray-700 mb-2">
                  <FiImage className="inline mr-2" />
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Message Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be clear and specific about your suggestion or feedback</li>
                  <li>• Include any relevant recipe links or references</li>
                  <li>• For recipe suggestions, include ingredients and instructions if possible</li>
                  <li>• Be respectful and constructive in your feedback</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                {user ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-3 py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    <FiSend />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">Please login to send messages to the admin</p>
                    <a
                      href="/login"
                      className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Login Now
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Response Info */}
          <div className="mt-8 p-6 bg-green-50 rounded-2xl">
            <div className="flex items-start">
              <FiCheckCircle className="text-2xl text-green-500 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">What happens next?</h3>
                <ul className="text-green-700 space-y-2">
                  <li>• You'll receive a confirmation email</li>
                  <li>• Our team reviews all messages within 24-48 hours</li>
                  <li>• We may contact you for more information if needed</li>
                  <li>• Your suggestions help improve RecipeHub for everyone!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;