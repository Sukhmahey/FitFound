import { toast } from 'react-toastify';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { notificationApi } from '../services/notificationApi';

const DUMMY_MODE = process.env.REACT_APP_DUMMY_MODE === "true";

const useNotify = () => {
  const { isMuted } = useNotification();
  const { user } = useAuth();

  const sendToDB = async (type, msg) => {
    if (!user?.userId || DUMMY_MODE) return;
    try {
       await notificationApi.create({
        userId: user.userId,
        message: msg,
        type,
      });
      
    } catch (err) {
      console.error("Failed to store notification:", err.message);
    }
  };

  const notify = {
    success: async (msg, options = {}) => {
      if (!isMuted) toast.success(msg, options);
      await sendToDB("success", msg);
    },
    error: async (msg, options = {}) => {
      if (!isMuted) toast.error(msg, options);
      await sendToDB("error", msg);
    },
    info: async (msg, options = {}) => {
      if (!isMuted) toast.info(msg, options);
      await sendToDB("info", msg);
    },
    warning: async (msg, options = {}) => {
      if (!isMuted) toast.warning(msg, options);
      await sendToDB("warning", msg);
    },
  };

  return notify;
};

export default useNotify;
