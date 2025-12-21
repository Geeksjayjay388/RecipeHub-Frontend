import api from './api';

// Send message to admin
export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

// Get user's messages
export const getUserMessages = async () => {
  const response = await api.get('/messages/my-messages');
  return response.data;
};

// Get all messages (Admin)
export const getAllMessages = async (params = {}) => {
  const response = await api.get('/messages', { params });
  return response.data;
};

// Get messages stats (Admin)
export const getMessagesStats = async () => {
  try {
    const response = await api.get('/messages/stats');
    return response.data;
  } catch (error) {
    // Fallback: calculate stats from all messages
    const messages = await getAllMessages();
    const messagesArray = messages.messages || messages;
    return {
      total: messagesArray.length,
      pending: messagesArray.filter(m => m.status === 'pending').length,
      replied: messagesArray.filter(m => m.status === 'replied').length,
      read: messagesArray.filter(m => m.status === 'read').length
    };
  }
};

// Update message status (Admin)
export const updateMessageStatus = async (id, status) => {
  const response = await api.put(`/messages/${id}/status`, { status });
  return response.data;
};

// Reply to message (Admin)
export const replyToMessage = async (id, content) => {
  const response = await api.post(`/messages/${id}/reply`, { content });
  return response.data;
};

// Delete message (Admin)
export const deleteMessage = async (id) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};