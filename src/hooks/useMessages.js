import { useState } from 'react';
import { getUserMessages, sendMessage } from '../services/messageService';
import toast from 'react-hot-toast';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserMessages();
      setMessages(data);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch messages');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendNewMessage = async (messageData) => {
    try {
      const data = await sendMessage(messageData);
      setMessages(prev => [data, ...prev]);
      toast.success('Message sent successfully!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
      throw error;
    }
  };

  return {
    messages,
    loading,
    error,
    fetchUserMessages,
    sendNewMessage
  };
};